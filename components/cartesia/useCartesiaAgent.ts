"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Browser client for a Cartesia Managed Agent.
 *
 * Protocol notes (Cartesia API version 2026-08-14):
 * - The agent socket is `wss://api.cartesia.ai/v1/agents/websocket/{agent_id}`.
 *   Browsers can't set WebSocket headers, so the short-lived access token is
 *   passed as a query parameter.
 * - `session_create` must be the first frame, sent within 10s of connecting.
 *   `input_format` is required and selects headerless mono PCM; the agent's
 *   audio comes back in the same format.
 * - Audio travels as base64 inside JSON text frames, in 20–100 ms chunks.
 * - `audio_output_clear` means the caller interrupted: drop queued playback.
 * - `client_tool_call` asks this browser to run a function; reply with
 *   `client_tool_result` when `expects_response` is true.
 */

const CARTESIA_VERSION = "2026-08-14";
const TARGET_RATE = 16000;
const CHUNK_SAMPLES = 1024; // ~64 ms at 16 kHz

export type ChatTurn = { role: "user" | "assistant"; text: string };
export type AgentStatus = "idle" | "connecting" | "live" | "error";

type AgentEvent = {
  type: string;
  audio?: string;
  text?: string;
  role?: string;
  tool_name?: string;
  tool_call_id?: string;
  expects_response?: boolean;
  parameters?: Record<string, unknown>;
  [key: string]: unknown;
};

const WORKLET_SOURCE = `
class PcmCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(${CHUNK_SAMPLES});
    this.filled = 0;
  }
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (!channel) return true;
    for (let i = 0; i < channel.length; i++) {
      this.buffer[this.filled++] = channel[i];
      if (this.filled === this.buffer.length) {
        this.port.postMessage(this.buffer.slice(0));
        this.filled = 0;
      }
    }
    return true;
  }
}
registerProcessor("pcm-capture", PcmCapture);
`;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode(...bytes.subarray(i, i + step));
  }
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Float32 [-1,1] -> signed 16-bit little-endian PCM. */
function floatToPcm16(input: Float32Array): Uint8Array {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return new Uint8Array(out.buffer);
}

/**
 * Linear resampler, used only when the browser ignores the requested
 * AudioContext sample rate. `carry` tracks the fractional position that
 * spans two buffers so the output stays continuous.
 */
function resample(
  input: Float32Array,
  inputRate: number,
  outputRate: number,
  carry: { phase: number },
): Float32Array {
  if (inputRate === outputRate) return input;
  const ratio = inputRate / outputRate;
  const available = input.length - carry.phase;
  const count = Math.max(0, Math.floor(available / ratio));
  const out = new Float32Array(count);
  let position = carry.phase;
  for (let i = 0; i < count; i++) {
    const index = Math.floor(position);
    const frac = position - index;
    const a = input[index] ?? 0;
    const b = input[index + 1] ?? a;
    out[i] = a + (b - a) * frac;
    position += ratio;
  }
  carry.phase = Math.max(0, position - input.length);
  return out;
}

export function useCartesiaAgent(agentId: string | undefined) {
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [micLevel, setMicLevel] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nodeRef = useRef<AudioWorkletNode | null>(null);
  const readyRef = useRef(false);
  const playHeadRef = useRef(0);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const draftRef = useRef("");
  const resampleCarry = useRef({ phase: 0 });

  const clearPlayback = useCallback(() => {
    for (const source of sourcesRef.current) {
      try {
        source.stop();
      } catch {
        /* already stopped */
      }
    }
    sourcesRef.current = [];
    playHeadRef.current = ctxRef.current?.currentTime ?? 0;
  }, []);

  const playAudio = useCallback((bytes: Uint8Array) => {
    const ctx = ctxRef.current;
    if (!ctx || bytes.length < 2) return;

    const usable = bytes.length - (bytes.length % 2);
    const view = new DataView(bytes.buffer, bytes.byteOffset, usable);
    const count = usable / 2;
    const samples = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      samples[i] = view.getInt16(i * 2, true) / 0x8000;
    }

    const buffer = ctx.createBuffer(1, count, TARGET_RATE);
    buffer.copyToChannel(samples, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const startAt = Math.max(playHeadRef.current, ctx.currentTime);
    source.start(startAt);
    playHeadRef.current = startAt + buffer.duration;

    sourcesRef.current.push(source);
    source.onended = () => {
      sourcesRef.current = sourcesRef.current.filter((s) => s !== source);
    };
  }, []);

  const runClientTool = useCallback(async (event: AgentEvent) => {
    const ws = wsRef.current;
    if (!ws) return;

    const reply = (result: string, isError: boolean) => {
      if (!event.expects_response) return;
      ws.send(
        JSON.stringify({
          type: "client_tool_result",
          tool_call_id: event.tool_call_id,
          result,
          is_error: isError,
        }),
      );
    };

    if (event.tool_name !== "search_knowledge") {
      reply(`Unknown tool: ${String(event.tool_name)}`, true);
      return;
    }

    try {
      const response = await fetch("/api/knowledge-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parameters: event.parameters }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        reply(String(data.data), false);
      } else {
        reply("The knowledge search could not complete.", true);
      }
    } catch {
      reply("The knowledge search endpoint could not be reached.", true);
    }
  }, []);

  const handleEvent = useCallback(
    async (event: AgentEvent) => {
      switch (event.type) {
        case "session_ready":
          readyRef.current = true;
          setStatus("live");
          break;

        case "audio_output":
          if (event.audio) playAudio(base64ToBytes(event.audio));
          break;

        case "audio_output_clear":
          clearPlayback();
          break;

        case "client_tool_call":
          await runClientTool(event);
          break;

        case "turn_output_text_delta":
          draftRef.current += event.text ?? "";
          setDraft(draftRef.current);
          break;

        case "turn_ended": {
          const text = (event.text ?? draftRef.current ?? "").trim();
          if (text) {
            const role = event.role === "user" ? "user" : "assistant";
            setTurns((prev) => [...prev, { role, text }]);
          }
          draftRef.current = "";
          setDraft("");
          break;
        }

        default:
          break;
      }
    },
    [clearPlayback, playAudio, runClientTool],
  );

  const stop = useCallback(() => {
    readyRef.current = false;
    clearPlayback();

    try {
      wsRef.current?.close();
    } catch {
      /* already closed */
    }
    wsRef.current = null;

    try {
      nodeRef.current?.disconnect();
    } catch {
      /* already detached */
    }
    nodeRef.current = null;

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    void ctxRef.current?.close().catch(() => undefined);
    ctxRef.current = null;

    setMicLevel(0);
    setStatus("idle");
  }, [clearPlayback]);

  const start = useCallback(async () => {
    if (!agentId) {
      setError(
        "CARTESIA_AGENT_ID is not set. Run scripts/setup-cartesia-agent.mjs, then add the id to your environment.",
      );
      setStatus("error");
      return;
    }

    setError(null);
    setTurns([]);
    setDraft("");
    draftRef.current = "";
    resampleCarry.current = { phase: 0 };
    setStatus("connecting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext({ sampleRate: TARGET_RATE });
      ctxRef.current = ctx;

      const workletUrl = URL.createObjectURL(
        new Blob([WORKLET_SOURCE], { type: "application/javascript" }),
      );
      await ctx.audioWorklet.addModule(workletUrl);
      URL.revokeObjectURL(workletUrl);

      const tokenResponse = await fetch("/api/cartesia-token", {
        method: "POST",
      });
      if (!tokenResponse.ok) {
        const body = await tokenResponse.json().catch(() => null);
        throw new Error(body?.error ?? "Could not get a Cartesia access token.");
      }
      const { token } = (await tokenResponse.json()) as { token: string };

      const socket = new WebSocket(
        `wss://api.cartesia.ai/v1/agents/websocket/${agentId}` +
          `?cartesia_version=${CARTESIA_VERSION}&access_token=${encodeURIComponent(token)}`,
      );
      wsRef.current = socket;

      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            type: "session_create",
            audio: {
              input_format: "pcm_16000",
              output_delivery: "speaking_pace",
            },
          }),
        );
      };

      socket.onmessage = (message) => {
        try {
          void handleEvent(JSON.parse(message.data as string) as AgentEvent);
        } catch {
          /* ignore malformed frames */
        }
      };

      socket.onerror = () => {
        setError("The voice connection failed.");
      };

      socket.onclose = () => {
        if (readyRef.current) {
          setError("The call ended.");
        }
      };

      // Microphone -> worklet -> PCM16 -> socket.
      const source = ctx.createMediaStreamSource(stream);
      const node = new AudioWorkletNode(ctx, "pcm-capture");
      nodeRef.current = node;

      node.port.onmessage = (event: MessageEvent<Float32Array>) => {
        const frames = event.data;
        let peak = 0;
        for (let i = 0; i < frames.length; i++) {
          const abs = Math.abs(frames[i]);
          if (abs > peak) peak = abs;
        }
        setMicLevel(peak);

        if (!readyRef.current || socket.readyState !== WebSocket.OPEN) return;

        const pcm = floatToPcm16(
          resample(frames, ctx.sampleRate, TARGET_RATE, resampleCarry.current),
        );
        socket.send(
          JSON.stringify({ type: "audio_input", audio: bytesToBase64(pcm) }),
        );
      };

      source.connect(node);
      // A worklet only runs while it is connected through to a destination, so
      // route it through a silent gain node rather than to the speakers.
      const silent = ctx.createGain();
      silent.gain.value = 0;
      node.connect(silent);
      silent.connect(ctx.destination);
    } catch (err) {
      stop();
      setError(err instanceof Error ? err.message : "Could not start the call.");
      setStatus("error");
    }
  }, [agentId, handleEvent, stop]);

  useEffect(() => stop, [stop]);

  return { status, error, turns, draft, micLevel, start, stop };
}
