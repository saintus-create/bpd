import { HeroAurora } from "@/components/blocks/hero-aurora";
import { FeaturesBento } from "@/components/blocks/features-bento";
import { FaqAccordion } from "@/components/blocks/faq-accordion";
import { CtaVortex } from "@/components/blocks/cta-vortex";
import { FooterColumns } from "@/components/blocks/footer-columns";

export const metadata = {
  title: "bpd — a voice assistant for mental health information",
  description:
    "Ask about mental health and hear the answer. A Hume-powered voice assistant that searches a sample knowledge base — anxiety, depression, treatment options, clinical trials and crisis support.",
};

/**
 * Landing page. Sections are Velora UI blocks (MIT) — see components/blocks/.
 * The voice assistant itself lives at /talk; the content pages are /topics,
 * /clinical-trials and /resources.
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
