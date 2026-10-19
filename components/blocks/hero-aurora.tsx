"use client";

import { ArrowRightIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { BlurFade } from "@/components/velora/blur-fade";
import { DotPattern } from "@/components/velora/grid-pattern";
import { ShimmerButton } from "@/components/velora/shimmer-button";

/**
 * Centered hero with a drifting aurora, a dotted backdrop and staggered
 * copy. Replace the copy and links; everything else re-themes from your
 * brand tokens.
 */
export function HeroAurora() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
      <AuroraBackground intensity="medium" />
      {/* Fade the aurora into the page background so it doesn't cut off at the
          section's bottom edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-background"
      />
      <DotPattern
        aria-hidden
        className="absolute inset-0 -z-10 size-full fill-foreground/10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <BlurFade>
          <a
            href="/topics"
            className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-sm text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <SparklesIcon className="size-4 text-primary" />
            Mental health, answered out loud
            <ArrowRightIcon className="size-3.5" />
          </a>
        </BlurFade>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Ask about{" "}
          <AnimatedGradientText>mental health</AnimatedGradientText>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
          A voice assistant that answers from a curated set of mental health
          documents — anxiety, depression, treatment options, clinical trials
          and crisis support. It names the passage it used, and says when the
          answer isn&apos;t there.
        </p>

        <BlurFade delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ShimmerButton
              onClick={() => {
                window.location.href = "/talk";
              }}
            >
              Start a call
            </ShimmerButton>
            <Button variant="ghost" size="lg" asChild>
              <a href="/topics">
                Browse topics <ArrowRightIcon />
              </a>
            </Button>
          </div>
        </BlurFade>

        <BlurFade delay={0.4}>
          <p className="mt-8 text-sm text-muted-foreground">
            Sample documents for a demo · general information, not medical
            advice
          </p>
        </BlurFade>
      </div>
    </section>
  );
}
