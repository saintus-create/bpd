# Connect Hume EVI to the Markdown knowledge base

The BPD repository now has a server-side retrieval endpoint and Hume tool-call handler. The remaining account-side step is registering the custom tool in your Hume EVI configuration.

## 1. Configure Vercel

Set these environment variables in the Vercel project:
- `HUME_API_KEY`
- `HUME_SECRET_KEY`
- `NEXT_PUBLIC_HUME_CONFIG_ID` — your saved EVI configuration ID, if applicable.

Keep API keys private and server-side. Do not put secrets in variables prefixed with `NEXT_PUBLIC_`.

## 2. Add documents

Place Markdown files under `knowledge/`, including subfolders if desired, then push to GitHub. The current search uses keyword matching and is a small, functional baseline; it is not semantic/vector search.

## 3. Register the Hume custom tool

In the Hume EVI configuration used by this app, create a custom tool named `search_knowledge`.

Description:

> Search the project's Markdown knowledge base for passages relevant to the user's question. Call this before answering questions that depend on supplied documents. Use returned passages as evidence and state when the knowledge base does not contain the answer.

Configure the tool to call the application's endpoint using HTTP POST:

`https://YOUR-VERCEL-DOMAIN/api/knowledge-search`

Input JSON schema:

```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "The user's question or a concise search query for the supplied documents."
    }
  },
  "required": ["query"]
}
```

The app's `onToolCall` handler accepts the tool call named `search_knowledge`, sends its parameters to the endpoint, and returns the retrieved text to Hume. If your Hume dashboard exposes different webhook fields, configure it to send the tool's `query` parameter in the request body as `parameters.query` or `query`.

## 4. Set the EVI system prompt

Use instructions along these lines:

> You are a voice assistant grounded in a supplied knowledge base. For questions about supplied documents, call `search_knowledge` first. Base factual answers on returned passages and name the source filename when useful. If no relevant passages are returned, say the connected knowledge base does not contain enough information. Do not invent citations or claim a document says something it does not say. Explain the answer naturally for spoken conversation.

## 5. Test

After deployment and tool setup, ask a question answered in `knowledge/example.md`. Confirm the tool is called and returns the sample fact. Then test a question absent from the documents and verify that the assistant does not fabricate an answer from the knowledge base.

## Current limits

This repository change implements a baseline retrieval path, but cannot create Hume dashboard settings or add secrets to Vercel because those require access to your accounts. Keyword search can miss relevant passages whose wording differs from the query. For a large legal or research corpus, use semantic/vector search and source metadata, then test retrieval quality against real questions.
