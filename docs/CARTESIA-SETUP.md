# Swapping the voice layer to Cartesia

The voice assistant now runs on Cartesia at `/talk`. The Hume implementation is
kept, unchanged, at `/talk-hume` so the two can be compared side by side.

Nothing else moved: the landing page, the content pages and
`/api/knowledge-search` are exactly as they were.

## Three steps

### 1. Create the agent and its tool

```bash
CARTESIA_API_KEY=sk_car_... node scripts/setup-cartesia-agent.mjs
```

That creates two things in your Cartesia account: a tool called
`search_knowledge`, and an agent that has it attached. It prints the agent id.

If the default voice or model is rejected, override them:

```bash
CARTESIA_VOICE_ID=... CARTESIA_MODEL_ID=... node scripts/setup-cartesia-agent.mjs
```

You can also build both by hand in the Cartesia Playground — the script is just
a convenience.

### 2. Set the environment

`.env.local` for local development, and the same two in Vercel for the deploy:

```
CARTESIA_API_KEY=sk_car_...
CARTESIA_AGENT_ID=agent_...
```

Restart the dev server afterwards.

### 3. Talk to it

Open `/talk` and press **Start Call**. Your browser asks for microphone
permission, mints a short-lived token from `/api/cartesia-token`, and opens the
agent socket.

## How the grounding is wired

The retrieval is registered as a **client tool**. When the model decides it
needs your documents, Cartesia sends a `client_tool_call` down the socket, the
browser POSTs it to `/api/knowledge-search` — the same endpoint as before, with
the same `{ parameters: { query } }` contract — and sends the returned passages
back as a `client_tool_result`.

I chose a client tool over a webhook tool deliberately. A webhook tool has
Cartesia's servers call your endpoint directly, which is tidier and works for
phone calls, but it needs a public HTTPS URL — so it would not work on
`localhost` without a tunnel. Since you want to play with this locally, the
client tool works everywhere. Switching later is a config change, not a code
change: recreate the tool with `type: "webhook"` and an `api_schema` pointing at
`https://your-domain/api/knowledge-search`.

## What is verified, and what is not

Verified by building and running it here:

- The app compiles and all routes build.
- `/api/cartesia-token` fails cleanly with a readable message when
  `CARTESIA_API_KEY` is missing, rather than crashing.
- `/api/knowledge-search` still answers, and returns the right documents.
- `/talk` renders its idle state with no page errors.

**Not verified — I could not:** a real call. That needs your Cartesia key, a
created agent, and a microphone, so the audio path has never actually run. The
protocol is implemented from Cartesia's published docs (API version
`2026-08-14`), but treat the first call as the test.

Two specific things to watch on that first call:

1. **Transcript events.** The client reads `turn_output_text_delta` for the
   live caption and `turn_ended` to close a turn. Cartesia documents these
   event names but I could not confirm the exact field shape for the user's
   side of the transcript, so the caller's own words may not appear in the
   transcript panel even though the conversation works. If they don't, that is
   where to look.
2. **Sample rate.** The client asks for a 16 kHz AudioContext and falls back to
   a linear resampler if the browser refuses. Chrome and Firefox honour the
   request; if the audio sounds pitched, the resampler is the place to check.

## Cost

The free tier is enough to try this: one provisioned number and 8 concurrent
calls. Paid voice-agent usage is $0.06/min of call duration, plus $0.014/min if
you use a Cartesia-provided phone number. The LLM is passed through at cost now
that Cartesia's free-LLM promotion has ended.

## Why the client got much smaller

`/talk` on Cartesia is a 5.36 kB route; the Hume version is 95.9 kB. That is
almost entirely the Hume React SDK leaving the bundle — this client is a
WebSocket, an AudioWorklet and about 300 lines.
