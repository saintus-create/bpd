import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CARTESIA_VERSION = "2026-08-14";

/**
 * Mints a short-lived Cartesia access token for the browser.
 *
 * The API key never leaves the server — the client gets a token scoped to the
 * `agent` grant that expires in minutes, which is the only thing safe to hand
 * to a browser (browsers can't set WebSocket headers, so the token goes in the
 * query string).
 */
export async function POST() {
  const apiKey = process.env.CARTESIA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "CARTESIA_API_KEY is not set on the server." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch("https://api.cartesia.ai/access-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cartesia-Version": CARTESIA_VERSION,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ grants: { agent: true }, expires_in: 300 }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Cartesia rejected the token request.", status: response.status },
        { status: 502 },
      );
    }

    const data = (await response.json()) as { token?: string };

    if (!data.token) {
      return NextResponse.json(
        { error: "Cartesia returned no token." },
        { status: 502 },
      );
    }

    return NextResponse.json({ token: data.token, expiresIn: 300 });
  } catch {
    return NextResponse.json(
      { error: "Could not reach Cartesia." },
      { status: 502 },
    );
  }
}
