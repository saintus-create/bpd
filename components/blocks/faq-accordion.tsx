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
    question: "Where do my documents go?",
    answer:
      "Put .md files in the knowledge/ folder — subfolders work too. The search walks the whole folder, so anything you add there is picked up automatically.",
  },
  {
    question: "How does the assistant find an answer?",
    answer:
      "When you ask something that depends on your documents, it calls the search_knowledge tool. That endpoint splits each file into paragraphs, scores them against your question and returns the five best matches.",
  },
  {
    question: "What if the answer isn't in my documents?",
    answer:
      "It tells you the knowledge base doesn't cover it rather than guessing. The endpoint returns an explicit 'no relevant passages' message in that case.",
  },
  {
    question: "What powers the voice?",
    answer:
      "The voice layer is Hume's Empathic Voice Interface. Retrieval runs inside this Next.js app, so your documents stay within your own deployment.",
  },
  {
    question: "Do I need to set anything up in Hume?",
    answer:
      "Yes — register a custom tool named search_knowledge in your EVI configuration and point it at /api/knowledge-search. The code can't create that dashboard setting for you.",
  },
  {
    question: "How accurate is the search?",
    answer:
      "It's keyword matching, not semantic search: it can miss a passage worded very differently from your question. Fine for a focused corpus; swap in embeddings for a large one.",
  },
  {
    question: "Can I check what it found?",
    answer:
      "Yes. Every returned passage is labelled with its source filename, so you can open the file and read it yourself.",
  },
  {
    question: "What file types are supported?",
    answer:
      "Markdown (.md) today. Anything else in the folder is ignored by the search.",
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
              <h3 className="font-semibold">Want the exact wiring?</h3>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">
                The setup guide covers the endpoint, the Hume tool schema and
                the system prompt.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="h-10 shrink-0 rounded-full px-5"
            >
              <a href="#how">
                <MessageCircleIcon aria-hidden />
                Read the guide
              </a>
            </Button>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
