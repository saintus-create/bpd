#!/usr/bin/env node
/**
 * Creates the Cartesia Managed Agent this app talks to, plus the
 * `search_knowledge` tool that grounds it in the Markdown knowledge base.
 *
 * Usage:
 *   CARTESIA_API_KEY=sk_car_... node scripts/setup-cartesia-agent.mjs
 *
 * Optional overrides:
 *   CARTESIA_VOICE_ID   Sonic voice id (defaults to the one in Cartesia's docs)
 *   CARTESIA_MODEL_ID   managed LLM catalog id (defaults to claude-haiku-4.5)
 *   CARTESIA_AGENT_NAME agent name (defaults to "bpd mental health demo")
 *
 * The tool is registered as a *client* tool, which means the browser runs it
 * and calls this app's own /api/knowledge-search endpoint. That keeps working
 * locally with no tunnel. If you later want Cartesia's servers to call the
 * endpoint directly (useful for telephony), create the tool with
 * `type: "webhook"` and an `api_schema` pointing at a public HTTPS URL.
 */

const API = "https://api.cartesia.ai";
const VERSION = "2026-08-14";

const apiKey = process.env.CARTESIA_API_KEY;
if (!apiKey) {
  console.error(
    "CARTESIA_API_KEY is not set. Run it as:\n" +
      "  CARTESIA_API_KEY=sk_car_... node scripts/setup-cartesia-agent.mjs",
  );
  process.exit(1);
}

const VOICE_ID =
  process.env.CARTESIA_VOICE_ID ?? "e07c00bc-4134-4eae-9ea4-1a55fb45746b";
const MODEL_ID = process.env.CARTESIA_MODEL_ID ?? "claude-haiku-4.5";
const AGENT_NAME = process.env.CARTESIA_AGENT_NAME ?? "bpd mental health demo";

const INSTRUCTIONS = `You are a calm, careful voice assistant for a mental health information demo.

You answer from a small set of sample documents. Before answering any question about mental health, symptoms, treatment, clinical trials or where to get help, call the search_knowledge tool, and base your answer on the passages it returns.

Rules:
- Speak naturally and briefly — one to three sentences, as you would out loud.
- Ground every factual claim in the returned passages. Name the source file when it helps.
- If no relevant passage comes back, say the knowledge base does not cover it. Never invent an answer.
- You are not a clinician. Do not diagnose, do not prescribe, and do not give dosages. For anything personal or urgent, say that a qualified professional should be consulted.
- If someone may be in danger, or mentions self-harm, respond with care and give crisis numbers directly: in India, Tele-MANAS on 14416 (free, 24/7), and emergency 112. Do not rely on the knowledge base for this.
- The documents are samples for a demo, not medical advice. Say so if the person seems to be treating them as such.`;

const INITIAL_MESSAGE =
  "Hi. I can answer questions about mental health from a small set of sample documents — though it's a demo, not medical advice. What would you like to know?";

async function call(path, body) {
  const response = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cartesia-Version": VERSION,
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }

  if (!response.ok) {
    throw new Error(
      `${path} failed (${response.status}): ${
        typeof parsed === "string" ? parsed : JSON.stringify(parsed)
      }`,
    );
  }
  return parsed;
}

async function main() {
  console.log("Creating the search_knowledge tool…");

  const tool = await call("/v1/agents/tools", {
    type: "client",
    name: "search_knowledge",
    description:
      "Search the project's Markdown knowledge base for passages relevant to the caller's question. Call this before answering anything that depends on the documents, and use the returned passages as your evidence.",
    pre_tool_speech: "auto",
    execution_mode: "immediate",
    expects_response: true,
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "The caller's question, or a concise search query for the documents.",
        },
      },
      required: ["query"],
    },
  });

  const toolId = tool.id;
  console.log(`  tool id: ${toolId}`);

  console.log("Creating the agent…");

  const agent = await call("/v1/agents", {
    name: AGENT_NAME,
    config: {
      instructions: INSTRUCTIONS,
      initial_message: INITIAL_MESSAGE,
      model: { id: MODEL_ID },
      audio: { output: { voice_id: VOICE_ID } },
      tools: [{ id: toolId }],
    },
  });

  const agentId = agent.id;

  console.log(`  agent id: ${agentId}`);
  console.log(`
Done. Now add this to .env.local (and to Vercel for the deployment):

  CARTESIA_API_KEY=sk_car_...
  CARTESIA_AGENT_ID=${agentId}

Then restart the dev server. /talk will use this agent.

To change the voice, the model or the wording, edit the agent in the Cartesia
Playground — the id stays the same, so nothing in the app needs to change.`);
}

main().catch((error) => {
  console.error(`\n${error.message}\n`);
  console.error(
    "If the voice id or model id was rejected, override them:\n" +
      "  CARTESIA_VOICE_ID=... CARTESIA_MODEL_ID=... node scripts/setup-cartesia-agent.mjs",
  );
  process.exit(1);
});
