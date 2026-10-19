<div align="center">
  <img src="https://storage.googleapis.com/hume-public-logos/hume/hume-banner.png">
  <h1>Hume Voice Assistant + Knowledge Search</h1>
</div>

This repository combines Hume's Empathic Voice Interface (EVI) with a small Markdown knowledge base. The voice UI uses Hume; the server searches your documents and returns matching passages to the voice assistant through the \`search_knowledge\` tool.

## Run locally

1. Install dependencies using the package manager and lockfile already used by this repository.
2. Copy \`.env.example\` to \`.env.local\`.
3. Set \`HUME_API_KEY\`, \`HUME_SECRET_KEY\`, and, if using a saved EVI configuration, \`NEXT_PUBLIC_HUME_CONFIG_ID\`.
4. Start the app using the existing development script in \`package.json\`.
5. Open \`/api/knowledge-search\` in your browser. It should return a JSON status and the number of Markdown documents found.

## Add knowledge

Put Markdown documents (\`.md\`) in \`knowledge/\` or a subfolder. A small example document is included. The endpoint ranks paragraphs using simple keyword matching and returns up to five passages.

## Connect the Hume voice

In the Hume EVI configuration used by this app, register a custom tool named \`search_knowledge\` with one required string parameter named \`query\`. Configure the tool to call:

\`POST https://YOUR-DEPLOYMENT-DOMAIN/api/knowledge-search\`

Send a JSON body like \`{"parameters":{"query":"What does the supplied document say?"}}\`. The endpoint responds with \`{"success":true,"data":"...retrieved passages..." }\`. The app's Hume tool handler invokes the endpoint and sends the returned passages back to EVI.

Add the following instruction to the EVI system prompt:

> For questions about the supplied documents, call search_knowledge before answering. Base the answer on the returned passages. Mention the source filename when helpful. If no relevant passage is found, say the knowledge base did not provide an answer; do not invent what a document says.

See [the setup guide](docs/HUME-KNOWLEDGE-SETUP.md) for the exact tool schema and deployment notes.

## Deploy to Vercel

Import this GitHub repository into Vercel and configure the environment variables above in Project Settings → Environment Variables. Deploy the \`main\` branch. After deployment, open \`/api/knowledge-search\` to confirm the endpoint responds. The knowledge documents are bundled with the server function via \`next.config.js\`.

## Important limits

This is a minimal working baseline, not a semantic search engine. Keyword matching can miss passages that use different words. The Hume custom tool must also be registered in your Hume dashboard; source-code changes cannot configure that account-side setting automatically. Never commit API keys or other secrets.
