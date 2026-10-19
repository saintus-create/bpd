import Link from "next/link";
import { ArrowRightIcon, ExternalLinkIcon, TriangleAlertIcon } from "lucide-react";

import { FooterColumns } from "@/components/blocks/footer-columns";
import { PageHeader } from "@/components/page-header";
import { BlurFade } from "@/components/velora/blur-fade";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Clinical trials — bpd",
  description:
    "How mental health clinical trials work, what taking part involves, and a sample listing of studies.",
};

type Trial = {
  title: string;
  phase: string;
  condition: string;
  status: "Recruiting" | "Active, not recruiting" | "Completed" | "Not yet recruiting";
};

// Illustrative only — invented to demonstrate the layout.
const TRIALS: Trial[] = [
  {
    title: "A 12-week CBT programme delivered by video for generalised anxiety",
    phase: "Phase 2",
    condition: "Generalised anxiety disorder",
    status: "Recruiting",
  },
  {
    title: "Adjunctive digital sleep intervention in treatment-resistant depression",
    phase: "Phase 3",
    condition: "Major depressive disorder",
    status: "Recruiting",
  },
  {
    title: "Ketamine-assisted psychotherapy versus standard care",
    phase: "Phase 2",
    condition: "Treatment-resistant depression",
    status: "Active, not recruiting",
  },
  {
    title: "Peer-support plus usual care for first-episode psychosis",
    phase: "Phase 3",
    condition: "Psychosis",
    status: "Recruiting",
  },
  {
    title: "A school-based early intervention for adolescent anxiety",
    phase: "Phase 2",
    condition: "Adolescent anxiety",
    status: "Completed",
  },
  {
    title: "Wearable monitoring to predict relapse in bipolar disorder",
    phase: "Phase 1",
    condition: "Bipolar disorder",
    status: "Not yet recruiting",
  },
];

const PHASES = [
  { phase: "Phase 1", what: "Small numbers, mainly checking safety and dosage." },
  { phase: "Phase 2", what: "Larger, looking at whether the intervention seems to work." },
  { phase: "Phase 3", what: "Large, comparing against the current standard treatment." },
  { phase: "Phase 4", what: "After approval, monitoring in wider use." },
];

const REGISTRIES = [
  {
    name: "Clinical Trials Registry — India (CTRI)",
    href: "https://ctri.nic.in",
    note: "India's national trial registry.",
  },
  {
    name: "ClinicalTrials.gov",
    href: "https://clinicaltrials.gov",
    note: "The largest international registry.",
  },
  {
    name: "WHO ICTRP",
    href: "https://trialsearch.who.int",
    note: "Searches many national registries at once.",
  },
];

const QUESTIONS = [
  "What is being compared with what?",
  "Could I receive a placebo?",
  "What are the possible risks and side effects?",
  "What happens when the trial ends?",
  "Who do I contact if something goes wrong?",
];

export default function ClinicalTrialsPage() {
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
              <p className="text-sm font-medium text-primary">
                Sample knowledge base
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Clinical trials
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">
                How mental health trials work, what taking part involves, and a
                sample listing so you can see the layout.
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
                    The listings below are invented examples.
                  </span>{" "}
                  They exist to show what the page looks like and are not real
                  studies. For actual trials, use the registries at the bottom of
                  this page.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.1}>
              <div className="mt-8 overflow-hidden rounded-2xl border">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                        <th scope="col" className="px-4 py-3 font-medium">
                          Study
                        </th>
                        <th scope="col" className="px-4 py-3 font-medium">
                          Phase
                        </th>
                        <th scope="col" className="px-4 py-3 font-medium">
                          Condition
                        </th>
                        <th scope="col" className="px-4 py-3 font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {TRIALS.map((trial) => (
                        <tr
                          key={trial.title}
                          className="border-b last:border-0 hover:bg-accent/40"
                        >
                          <td className="px-4 py-3.5 align-top font-medium">
                            {trial.title}
                          </td>
                          <td className="px-4 py-3.5 align-top whitespace-nowrap text-muted-foreground">
                            {trial.phase}
                          </td>
                          <td className="px-4 py-3.5 align-top text-muted-foreground">
                            {trial.condition}
                          </td>
                          <td className="px-4 py-3.5 align-top">
                            <Badge
                              variant={
                                trial.status === "Recruiting"
                                  ? "default"
                                  : "secondary"
                              }
                              className="whitespace-nowrap"
                            >
                              {trial.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </BlurFade>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:gap-16">
            <BlurFade>
              <h2 className="text-2xl font-semibold tracking-tight">
                The four phases
              </h2>
              <ul className="mt-5 space-y-4">
                {PHASES.map((item) => (
                  <li key={item.phase} className="flex gap-3 text-sm">
                    <span className="mt-0.5 inline-flex shrink-0 items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {item.phase}
                    </span>
                    <span className="text-muted-foreground">{item.what}</span>
                  </li>
                ))}
              </ul>
            </BlurFade>

            <BlurFade delay={0.1}>
              <h2 className="text-2xl font-semibold tracking-tight">
                Before you join one
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Participation is voluntary. Every trial is reviewed by an ethics
                committee, requires informed consent, and you can withdraw at any
                point without affecting your usual care.
              </p>
              <ul className="mt-5 space-y-3">
                {QUESTIONS.map((q) => (
                  <li key={q} className="flex gap-3 text-sm text-muted-foreground">
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    {q}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-muted-foreground">
                If your current treatment is not working, raise it with your
                treating clinician first. Do not stop prescribed medication to
                join a study.
              </p>
            </BlurFade>
          </div>
        </section>

        <section className="px-6 pb-20 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <BlurFade>
              <h2 className="text-2xl font-semibold tracking-tight">
                Find real trials
              </h2>
            </BlurFade>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {REGISTRIES.map((reg, i) => (
                <BlurFade key={reg.name} delay={i * 0.08}>
                  <a
                    href={reg.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-2xl border bg-card p-5 transition-colors hover:bg-accent/40"
                  >
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      {reg.name}
                      <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
                    </span>
                    <span className="mt-2 text-sm text-muted-foreground">
                      {reg.note}
                    </span>
                  </a>
                </BlurFade>
              ))}
            </div>

            <BlurFade delay={0.2}>
              <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-muted/40 p-6 text-center sm:flex-row sm:p-8 sm:text-left">
                <div className="flex-1">
                  <h3 className="font-semibold">Worried about someone now?</h3>
                  <p className="mt-1 text-sm text-pretty text-muted-foreground">
                    Crisis lines in India and internationally, and what to do
                    while you wait.
                  </p>
                </div>
                <Link
                  href="/resources"
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Crisis support
                  <ArrowRightIcon className="size-4" />
                </Link>
              </div>
            </BlurFade>
          </div>
        </section>
      </main>

      <FooterColumns />
    </>
  );
}
