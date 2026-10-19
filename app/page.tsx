import { HeroAurora } from "@/components/blocks/hero-aurora";
import { FeaturesBento } from "@/components/blocks/features-bento";
import { FaqAccordion } from "@/components/blocks/faq-accordion";
import { CtaVortex } from "@/components/blocks/cta-vortex";
import { FooterColumns } from "@/components/blocks/footer-columns";

export const metadata = {
  title: "bpd — a voice assistant for your Markdown knowledge base",
  description:
    "Talk to your own documents. A Hume-powered voice assistant that searches your Markdown files, cites the passages it used, and says when the answer isn't there.",
};

/**
 * Landing page. Sections are Velora UI blocks (MIT) — see components/blocks/.
 * The voice assistant itself lives at /talk.
 */
export default function LandingPage() {
  return (
    <main className="relative">
      <HeroAurora />
      <FeaturesBento />
      <FaqAccordion />
      <CtaVortex />
      <FooterColumns />
    </main>
  );
}
