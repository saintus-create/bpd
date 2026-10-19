import Link from "next/link";
import { ArrowRightIcon, PhoneIcon, TriangleAlertIcon } from "lucide-react";

import { FooterColumns } from "@/components/blocks/footer-columns";
import { PageHeader } from "@/components/page-header";
import { BlurFade } from "@/components/velora/blur-fade";
import { AuroraBackground } from "@/components/velora/aurora-background";

export const metadata = {
  title: "Crisis support — bpd",
  description:
    "What to do in a mental health emergency, and helplines in India and internationally.",
};

type Line = { name: string; number: string; note: string };

const INDIA: Line[] = [
  {
    name: "Tele-MANAS",
    number: "14416",
    note: "Free, 24/7, in multiple Indian languages. The national tele-mental health programme.",
  },
  {
    name: "KIRAN Helpline",
    number: "1800-599-0019",
    note: "Free, 24/7, in 13 languages.",
  },
  {
    name: "AASRA",
    number: "+91-9820466726",
    note: "24/7 befriending service.",
  },
  {
    name: "Emergency",
    number: "112",
    note: "If you or someone else is in immediate danger.",
  },
];

const INTERNATIONAL: Line[] = [
  {
    name: "US and Canada — 988 Lifeline",
    number: "988",
    note: "Call or text. Free, 24/7.",
  },
  {
    name: "UK and Ireland — Samaritans",
    number: "116 123",
    note: "Free, 24/7.",
  },
  {
    name: "Australia — Lifeline",
    number: "13 11 14",
    note: "24/7 crisis support.",
  },
];

const STEPS = [
  "Call your local emergency number. In India that is 112.",
  "If you can, stay with someone, or ask someone to stay with you, until help arrives.",
  "Move away from anything you could use to hurt yourself.",
  "Call a helpline — they can stay on the line with you while you wait.",
];

const HELPING = [
  "Ask directly whether they are thinking about suicide. Asking does not plant the idea, and people usually feel relief at being asked.",
  "Stay with them, or make sure someone else can.",
  "Help them contact a helpline or a clinician, and offer to make the call with them.",
  "Remove or lock away means of harm where that is possible.",
  "Follow up afterwards.",
];

function HelplineCard({ line }: { line: Line }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card p-5">
      <span className="text-sm font-medium text-muted-foreground">
        {line.name}
      </span>
      <a
        href={`tel:${line.number.replace(/[^0-9+]/g, "")}`}
        className="mt-2 inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-primary hover:underline"
      >
        <PhoneIcon className="size-5" />
        {line.number}
      </a>
      <p className="mt-2 text-sm text-muted-foreground">{line.note}</p>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <>
      <PageHeader />

      <main>
        <section className="relative isolate overflow-hidden px-6 pt-20 pb-12 lg:px-8">
          <AuroraBackground intensity="subtle" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <BlurFade>
              <p className="text-sm font-medium text-primary">Crisis support</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                If you need help now
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">
                This page is here for the demo, but the numbers on it are real.
                If you are in danger, please contact emergency services or a
                helpline rather than this app.
              </p>
            </BlurFade>
          </div>
        </section>

        <section className="px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <BlurFade>
              <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm sm:p-5">
                <TriangleAlertIcon className="mt-0.5 size-5 shrink-0 text-amber-600" />
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    In an immediate emergency, call your local emergency number.
                  </span>{" "}
                  In India that is <span className="font-medium text-foreground">112</span>.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.1}>
              <h2 className="mt-12 text-2xl font-semibold tracking-tight">
                While you wait for help
              </h2>
              <ol className="mt-5 space-y-4">
                {STEPS.map((step, i) => (
                  <li key={step} className="flex gap-4 text-sm">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </BlurFade>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <BlurFade>
              <h2 className="text-2xl font-semibold tracking-tight">India</h2>
            </BlurFade>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {INDIA.map((line, i) => (
                <BlurFade key={line.name} delay={(i % 2) * 0.08}>
                  <HelplineCard line={line} />
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-16 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <BlurFade>
              <h2 className="text-2xl font-semibold tracking-tight">
                Elsewhere
              </h2>
            </BlurFade>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {INTERNATIONAL.map((line, i) => (
                <BlurFade key={line.name} delay={i * 0.08}>
                  <HelplineCard line={line} />
                </BlurFade>
              ))}
            </div>
            <BlurFade delay={0.2}>
              <p className="mt-6 text-sm text-muted-foreground">
                The International Association for Suicide Prevention lists
                crisis centres by country —{" "}
                <a
                  href="https://www.iasp.info/resources/Crisis_Centres/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  iasp.info
                </a>
                .
              </p>
            </BlurFade>
          </div>
        </section>

        <section className="px-6 pb-20 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <BlurFade>
              <h2 className="text-2xl font-semibold tracking-tight">
                If you are worried about someone else
              </h2>
              <ul className="mt-5 max-w-3xl space-y-3">
                {HELPING.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </BlurFade>

            <BlurFade delay={0.15}>
              <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-muted/40 p-6 text-center sm:flex-row sm:p-8 sm:text-left">
                <div className="flex-1">
                  <h3 className="font-semibold">Looking for something else?</h3>
                  <p className="mt-1 text-sm text-pretty text-muted-foreground">
                    The topics page covers anxiety, depression and treatment
                    options, and the trials page explains clinical research.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/topics"
                    className="inline-flex h-10 items-center gap-1.5 rounded-full border px-5 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Topics
                  </Link>
                  <Link
                    href="/clinical-trials"
                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Clinical trials
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </div>
              </div>
            </BlurFade>
          </div>
        </section>
      </main>

      <FooterColumns />
    </>
  );
}
