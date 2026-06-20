"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BaseButton from "@/components/ui/BaseButton";

export default function NotFound({ customTitle = "", customSubtitle = "" }) {
  const router = useRouter();

  // Primary Default Wording Layout Configurations
  const titleText = customTitle || "This chapter doesn't exist yet.";
  const subtitleText =
    customSubtitle ||
    "The life lesson or insight path you are searching for might have been moved, set to private, or hasn't been written yet.";

  return (
    <main className="py-20 md:py-24 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-xl w-full text-center space-y-8 flex flex-col items-center">
        {/* Core Big Visual Accent Stack */}
        <div className="relative select-none">
          <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tighter text-surface select-none leading-none">
            404
          </h1>
        </div>

        {/* Informative Typography Copy Layout */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground transition-colors duration-300">
            {titleText}
          </h2>
          <p className="text-base text-muted max-w-md mx-auto leading-relaxed transition-colors duration-300">
            {subtitleText}
          </p>
        </div>

        {/* Graphic Accent Break Separator */}
        <div
          className="h-0.5 w-16 bg-border rounded-full transition-colors duration-300"
          aria-hidden="true"
        />

        {/* Adaptive Operational Navigation Grid Frame */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Primary CTA Action: Returns to Application Core */}
          <BaseButton
            as="link"
            href="/"
            animated
            animatedSpanOne={'animate-ping'}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm tracking-wide shadow-md shadow-primary/10 transition-all duration-200 text-center cursor-pointer active:scale-[0.98]"
          >
            Return to Home Base
          </BaseButton>

          {/* Secondary CTA Action: Environmental Native History Intercept Step */}
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-card border border-border hover:border-border-hover text-foreground font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Go Back Previous Chapter
          </button>
        </div>
      </div>
    </main>
  );
}
