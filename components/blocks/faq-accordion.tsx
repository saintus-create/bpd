import { MessageCircleIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/velora/blur-fade";
import { DotPattern } from "@/components/velora/grid-pattern";

const FAQS = [
  {
    question: "Is this medical advice?",
    answer:
      "No. The knowledge base holds sample documents written for this demo. It is general information, not a diagnosis or a treatment plan, and it does not replace a qualified professional.",
  },
  {
    question: "Where do the answers come from?",
    answer:
      "From the Markdown files in the knowledge folder: an overview, anxiety, depression, treatment options, clinical trials and crisis support.",
  },
  {
    question: "How does the assistant find an answer?",
    answer:
      "It calls the search_knowledge tool. That endpoint splits each file into paragraphs, scores them against your question and returns the five best matches with their filenames.",
  },
  {
    question: "What if the answer isn't in the documents?",
    answer:
      "It tells you the knowledge base doesn't cover it rather than guessing. The endpoint returns an explicit 'no relevant passages' message in that case.",
  },
  {
    question: "What should I do in a crisis?",
    answer:
      "Contact a helpline or emergency services rather than relying on this demo. In India, Tele-MANAS on 14416 is free and available 24/7, and the emergency number is 112. The crisis support page lists more, including lines outside India.",
  },
  {
    question: "Are the clinical trials real?",
    answer:
      "No — the listings on the trials page are invented examples used to show the layout. For real studies, use the Clinical Trials Registry of India or ClinicalTrials.gov.",
  },
  {
    question: "What powers the voice?",
    answer:
      "The voice layer is Hume's Empathic Voice Interface. Retrieval runs inside this Next.js app, so the documents stay within your own deployment.",
  },
  {
    question: "Can I add my own documents?",
    answer:
      "Yes — drop .md files into the knowledge folder and they are picked up automatically, subfolders included.",
  },
];

/**
 * Centered FAQ: a single-open accordion of common questions, then a
 * contact row for anything the list doesn't answer.
 */
export function FaqAccordion() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
      <DotPattern
        aria-hidden
        className="absolute inset-0 -z-10 size-full fill-foreground/10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_55%)]"
      />

      <div className="mx-auto max-w-3xl">
        <BlurFade className="text-center">
          <p className="text-sm font-medium text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            Questions, answered
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
            How the retrieval works, where your files live, and what happens
            when the answer isn&apos;t in your documents.
          </p>
        </BlurFade>

        <BlurFade delay={0.1} className="mt-14">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="rounded-2xl border bg-card/80 px-6 shadow-sm backdrop-blur sm:px-8"
          >
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.question} value={`item-${i}`}>
                <AccordionTrigger className="py-5 text-base hover:no-underline hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pr-8 pb-5 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </BlurFade>

        <BlurFade delay={0.2} className="mt-10">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed bg-muted/40 p-6 text-center sm:flex-row sm:p-8 sm:text-left">
            <span
              aria-hidden
              className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
            >
              <MessageCircleIcon className="size-6" />
            </span>
            <div className="flex-1">
              <h3 className="font-semibold">Need help right now?</h3>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">
                Crisis lines in India and internationally, and what to do while
                you wait.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="h-10 shrink-0 rounded-full px-5"
            >
              <a href="/resources">
                <MessageCircleIcon aria-hidden />
                Crisis support
              </a>
            </Button>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
