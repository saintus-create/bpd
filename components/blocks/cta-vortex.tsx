import { ArrowRightIcon, CheckIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Vortex } from "@/components/velora/vortex";

const EYEBROW = "Ready when you are";
const TITLE = "Give your documents a voice";
const COPY =
  "Add your Markdown files, start a call, and ask. The assistant answers from your documents — and says so when the answer isn't there.";
const PRIMARY = { label: "Start a call", href: "/talk" };
const SECONDARY = { label: "See how it works", href: "#how" };
const PERKS = [
  "Bring your own Markdown",
  "Cites its sources",
  "Says when it doesn't know",
];

/**
 * Dark call-to-action band with a brand-tinted particle vortex swirling
 * behind the copy. The `dark` class scopes the dark theme tokens to the
 * band, so it stays dark on light pages and lifts off dark ones.
 */
export function CtaVortex() {
  return (
    <section className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
      {/* Soft gradient field so the section eases in and out of the page
          background instead of meeting it at a hard edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-brand/[0.07] to-background"
      />
      {/* Soft brand halo behind the band so the dark block eases into the page
          instead of sitting on flat background. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-1/2 mx-auto h-[18rem] max-w-4xl -translate-y-1/2 rounded-full bg-brand/20 blur-3xl"
      />
      <div className="dark relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl border bg-card px-6 py-20 text-center text-foreground shadow-2xl shadow-brand/10 sm:px-12 sm:py-28">
        <Vortex particles={900} speed={0.8} range={0.95} />
        {/* Calms the bright centre of the swirl so the copy stays readable. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-radial from-card/85 from-10% via-card/40 via-35% to-transparent to-65%"
        />
        {/* On narrow screens the copy spans the full width of the swirl. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-card/60 sm:hidden" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-to/60 to-transparent"
        />

        <div className="relative mx-auto max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-sm text-muted-foreground backdrop-blur">
            <SparklesIcon aria-hidden className="size-4 text-brand-to" />
            {EYEBROW}
          </p>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {TITLE}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
            {COPY}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-11 w-full rounded-full bg-foreground px-6 text-background hover:bg-foreground/90 sm:w-auto"
            >
              <a href={PRIMARY.href}>
                {PRIMARY.label}
                <ArrowRightIcon aria-hidden />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 w-full rounded-full bg-background/40 px-6 backdrop-blur sm:w-auto"
            >
              <a href={SECONDARY.href}>{SECONDARY.label}</a>
            </Button>
          </div>

          <ul className="mt-10 flex flex-col items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground sm:flex-row">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-2">
                <CheckIcon aria-hidden className="size-4 text-brand-to" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
