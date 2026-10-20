"use client";

import { useEffect, useRef } from "react";
import { MicIcon, PhoneIcon, PhoneOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartesiaAgent } from "./useCartesiaAgent";

export function CartesiaVoice({ agentId }: { agentId?: string }) {
  const { status, error, turns, draft, micLevel, start, stop } =
    useCartesiaAgent(agentId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns, draft]);

  if (status === "idle" || status === "error") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background p-4">
        <div className="flex max-w-md flex-col items-center text-center">
          <Button
            className="flex items-center gap-1.5 rounded-full"
            onClick={() => void start()}
          >
            <PhoneIcon className="size-4 fill-current opacity-50" strokeWidth={0} />
            Start Call
          </Button>
          <p className="mt-6 text-sm text-muted-foreground">
            Ask about anxiety, treatment options, clinical trials or where to
            get help. Answers come from the sample documents.
          </p>
          {error && (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <p className="mt-6 text-xs text-muted-foreground">
            Sample documents for a demo · general information, not medical advice
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span
            aria-hidden
            className={
              status === "live"
                ? "size-2 animate-pulse rounded-full bg-primary"
                : "size-2 rounded-full bg-muted-foreground/50"
            }
          />
          <span className="text-muted-foreground">
            {status === "live" ? "Listening" : "Connecting…"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-24 items-center overflow-hidden rounded-full bg-muted">
            <span
              aria-hidden
              className="h-full rounded-full bg-primary transition-[width] duration-100"
              style={{ width: `${Math.min(100, Math.round(micLevel * 140))}%` }}
            />
          </span>
          <MicIcon className="size-4 text-muted-foreground" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {turns.map((turn, index) => (
            <div
              key={`${index}-${turn.role}`}
              className={
                turn.role === "user"
                  ? "ml-auto max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                  : "mr-auto max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-sm text-foreground"
              }
            >
              {turn.text}
            </div>
          ))}
          {draft && (
            <div className="mr-auto max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
              {draft}
            </div>
          )}
          {turns.length === 0 && !draft && status === "live" && (
            <p className="mt-16 text-center text-sm text-muted-foreground">
              Go ahead — ask your first question.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 border-t px-4 py-5">
        <Button
          variant="outline"
          className="flex items-center gap-1.5 rounded-full"
          onClick={stop}
        >
          <PhoneOffIcon className="size-4" />
          End call
        </Button>
        <p className="text-xs text-muted-foreground">
          Sample documents for a demo · general information, not medical advice
        </p>
      </div>
    </div>
  );
}
