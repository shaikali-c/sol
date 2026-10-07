"use client";

import type { ComponentType } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  type TargetAndTransition,
} from "motion/react";

export type Stage = {
  label: string;
  Icon: ComponentType<{ className?: string; weight?: "regular" | "bold" | "fill" }>;
  animate: TargetAndTransition;
};

export default function StageLoader({
  stages,
  stage,
  totalMs,
}: {
  stages: Stage[];
  stage: number;
  totalMs: number;
}) {
  const current = stages[stage];

  return (
    <MotionConfig reducedMotion="user">
      <div className="mt-6" aria-live="polite">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={stage}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <motion.span
                  animate={current.animate}
                  className="flex items-center justify-center"
                >
                  <current.Icon className="h-7 w-7 text-blue-600" />
                </motion.span>
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="overflow-hidden">
            <span
              key={stage}
              className="word-swap block font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl"
            >
              {current.label}
            </span>
          </div>
        </div>
        <div className="mt-5 h-0.5 max-w-md overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all ease-out"
            style={{
              width: `${((stage + 1) / stages.length) * 100}%`,
              transitionDuration: `${totalMs}ms`,
            }}
          />
        </div>
      </div>
    </MotionConfig>
  );
}
