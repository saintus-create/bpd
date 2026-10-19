"use client";

import { VoiceProvider, ToolCallHandler } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef } from "react";
import { toast } from "sonner";

const handleToolCall: ToolCallHandler = async (message, send) => {
  if (message.name !== "search_knowledge") {
    return send.error({
      error: "Tool not found",
      code: "tool_not_found",
      level: "warn",
      content: "The requested tool is not configured in this application."
    });
  }

  try {
    const response = await fetch("/api/knowledge-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parameters: message.parameters })
    });
    const result = await response.json();

    if (response.ok && result.success) {
      return send.success(result.data);
    }

    return send.error(result.error ?? {
      error: "Knowledge search failed",
      code: "knowledge_search_error",
      level: "error",
      content: "The knowledge search could not complete."
    });
  } catch {
    return send.error({
      error: "Knowledge search failed",
      code: "knowledge_search_error",
      level: "error",
      content: "The knowledge search endpoint could not be reached."
    });
  }
};

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const configId = process.env["NEXT_PUBLIC_HUME_CONFIG_ID"];

  return (
    <div className={"relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"}>
      <VoiceProvider
        onToolCall={handleToolCall}
        onMessage={() => {
          if (timeout.current) window.clearTimeout(timeout.current);
          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              ref.current.scrollTo({
                top: ref.current.scrollHeight,
                behavior: "smooth"
              });
            }
          }, 200);
        }}
        onError={(error) => toast.error(error.message)}
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall configId={configId} accessToken={accessToken} />
      </VoiceProvider>
    </div>
  );
}
