import Link from "next/link";
import { ArrowRightIcon, FlaskConicalIcon, LifeBuoyIcon } from "lucide-react";

import { FooterColumns } from "@/components/blocks/footer-columns";
import { PageHeader } from "@/components/page-header";
import { BlurFade } from "@/components/velora/blur-fade";
import { AuroraBackground } from "@/components/velora/aurora-background";

export const metadata = {
  title: "Topics — bpd",
  description:
    "Sample mental health topics: overview, anxiety, depression and treatment options.",
};

const TOPICS = [
  {
    id: "overview",
    title: "Overview",
    summary:
      "What mental health covers, and why it is not a matter of willpower.",
    points: [
      "Mental health describes how a person thinks, feels and copes with ordinary life. It sits on a spectrum — everyone has good and bad periods.",
      "Around one in eight people globally lives with a mental health condition, according to the World Health Organization. Depression and anxiety are among the leading causes of disability worldwide.",
      "Biology, circumstances and experience all shape it: genetics, physical health, sleep, money and housing, work, relationships, and major life events such as bereavement.",
      "Reaching out early tends to make things easier, but help is worthwhile at any point.",
    ],
  },
  {
    id: "anxiety",
    title: "Anxiety and panic",
    summary: "Persistent worry, panic attacks, and what tends to help.",
    points: [
      "Anxiety is the body's response to perceived threat. It becomes a problem when it is persistent, out of proportion, or starts to interfere with daily life.",
      "Common signs include racing thoughts, restlessness, a tight chest, disturbed sleep, and avoiding the situations that trigger the feeling.",
      "Avoidance brings short-term relief and tends to make anxiety worse over time, because the feared situation is never tested.",
      "A panic attack peaks within minutes and feels dangerous, but is not medically dangerous in itself. Cognitive behavioural therapy is the most studied treatment.",
    ],
  },
  {
    id: "depression",
    title: "Depression and low mood",
    summary: "When low mood stops lifting, and how it is treated.",
    points: [
      "Depression is persistent and affects how a person functions. It does not lift in response to good news or rest.",
      "Signs include lost interest or pleasure, changed sleep and appetite, fatigue, difficulty concentrating, guilt, and thoughts of self-harm.",
      "A diagnosis generally requires several symptoms to persist for two weeks or more, and only a qualified professional can make it.",
      "Talking therapies, medication where appropriate, and structured routine all have evidence behind them; combination treatment is often more effective for moderate to severe depression.",
    ],
  },
  {
    id: "treatment",
    title: "Treatment options",
    summary: "Talking therapies, medication, and self-care that supports them.",
    points: [
      "CBT, behavioural activation, interpersonal therapy and trauma-focused approaches are the main talking therapies, usually delivered weekly over six to twenty sessions.",
      "Medication is prescribed and reviewed by a clinician, takes weeks to work, and is usually continued for a period after recovery rather than stopped at the first good week.",
      "Sleep, daylight, movement, reduced alcohol, and staying connected to one or two people all have measurable effects on mood.",
      "Self-care supports treatment — it is not a replacement for it when symptoms are significant.",
    ],
  },
];

export default function TopicsPage() {
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
                Mental health topics
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">
                A short tour of the documents the voice assistant searches.
                General information for a demo — not a diagnosis, and not a
                substitute for a qualified professional.
              </p>
            </BlurFade>
          </div>
        </section>

        <section className="px-6 pb-8 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2">
            <BlurFade>
              <Link
                href="/clinical-trials"
                className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition-colors hover:bg-accent/40"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <FlaskConicalIcon className="size-5" />
                </span>
                <h2 className="mt-4 font-semibold">Clinical trials</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  How trials are phased, what taking part involves, and a sample
                  listing of studies.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  See the sample listing
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </BlurFade>
            <BlurFade delay={0.1}>
              <Link
                href="/resources"
                className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition-colors hover:bg-accent/40"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <LifeBuoyIcon className="size-5" />
                </span>
                <h2 className="mt-4 font-semibold">Crisis support</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  What to do in an emergency, and helplines in India and
                  internationally.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Get help now
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </BlurFade>
          </div>
        </section>

        <section className="px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-12">
            {TOPICS.map((topic, i) => (
              <BlurFade key={topic.id} delay={(i % 2) * 0.08}>
                <article id={topic.id} className="scroll-mt-20">
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {topic.title}
                  </h2>
                  <p className="mt-2 text-muted-foreground">{topic.summary}</p>
                  <ul className="mt-5 space-y-3">
                    {topic.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-relaxed">
                        <span
                          aria-hidden
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                        />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </BlurFade>
            ))}
          </div>
        </section>

        <section className="px-6 pb-20 lg:px-8">
          <BlurFade>
            <div className="mx-auto max-w-3xl rounded-2xl border border-dashed bg-muted/40 p-6 text-center sm:p-8">
              <h2 className="font-semibold">Prefer to just ask?</h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-pretty text-muted-foreground">
                Start a call and ask in your own words. The assistant searches
                these documents and reads back the passages it used.
              </p>
              <Link
                href="/talk"
                className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start a call
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </BlurFade>
        </section>
      </main>

      <FooterColumns />
    </>
  );
}
