"use client";

export default function ClassicLoader({ fullScreen = true, message = "" }) {
  // Conditional classes depending on if you want it full-screen or boxed inline
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
    : "w-full h-full min-h-[150px] flex flex-col items-center justify-center bg-transparent";

  return (
    <div className={`${containerClasses} transition-colors duration-300`}>
      <div className="flex flex-col items-center gap-4">
        
        {/* Core Animated Spinner Ring */}
        <div 
          className="h-10 w-10 animate-spin rounded-full border-4 border-surface border-t-primary"
          role="status"
          aria-label="Loading content"
        />

        {/* Semantic Assistive text for screen-readers */}
        <span role="status" aria-live="polite" className="sr-only">
          {message || "Loading page data, please wait..."}
        </span>

        {/* Optional UI Micro-copy (Visible text below the spinner if passed) */}
        {message && (
          <p className="text-sm font-medium tracking-wide text-muted animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}