"use client";

import LoadingData from "@/components/ui/LoadingData";

export default function GlobalLoading() {
  return (
    <div className="flex flex-col items-center gap-4">
      <LoadingData className="min-h-80" />
    </div>
  );
}
