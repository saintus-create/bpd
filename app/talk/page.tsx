import { CartesiaVoice } from "@/components/cartesia/CartesiaVoice";

// Read CARTESIA_AGENT_ID at request time rather than baking it into the build.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Talk — bpd",
  description:
    "Ask about mental health and hear the answer, grounded in a sample knowledge base.",
};

export default function TalkPage() {
  return (
    <div className="grow flex flex-col">
      <CartesiaVoice agentId={process.env.CARTESIA_AGENT_ID} />
    </div>
  );
}
