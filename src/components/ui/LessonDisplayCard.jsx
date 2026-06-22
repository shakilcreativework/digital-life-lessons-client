import Image from "next/image";
import React from "react";
import { FiBookOpen, FiHeart, FiTag, FiUser } from "react-icons/fi";

/**
 * LessonDisplayCard - High-fidelity presentation component built as a 
 * React Server Component (RSC). Supports dark mode via native Tailwind configuration tokens.
 */
export default function LessonDisplayCard({ lessonData = {} }) {
      const {
    title = "Untitled Lesson",
    description = "",
    category = "General",
    emotionalTone = "Realization",
    image = null,
    authorName = "Anonymous",
    authorImg = null,
    createdAt,
  } = lessonData;

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "Recently";
    }
  };

  // Safe helper to determine tone color pairings from the system color palette tokens
  const getToneStyles = (tone) => {
    const standardizedTone = tone.toLowerCase();
    if (standardizedTone.includes("motivational") || standardizedTone.includes("gratitude")) {
      return "bg-primary/10 dark:bg-primary/20 text-primary border-primary/20";
    }
    if (standardizedTone.includes("sad") || standardizedTone.includes("mistake")) {
      return "bg-secondary/10 dark:bg-secondary/20 text-secondary border-secondary/20";
    }
    return "bg-surface text-muted border-border";
  };

  return (
    <article 
      className="w-full max-w-3xl mx-auto bg-card text-foreground border border-border hover:border-border-hover rounded-3xl overflow-hidden shadow-md transition-all duration-300"
      aria-labelledby="lesson-card-heading"
    >
      {/* Featured Image Frame Component - Optimized with layout shift protections */}
      {image && (
        <div className="w-full aspect-video bg-surface relative overflow-hidden group select-none">
          <Image
            src={image}
            alt={`Visual canvas presentation for: ${title}`}
            width={1200}
            height={675}
            className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-103"
            priority={true} 
            unoptimized={true} // Bypasses hostname requirement for third party URLs like ibb.co instantly
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Primary Structural Content Section */}
      <div className="p-6 sm:p-8 md:p-10">
        <div className="flex items-center gap-3 mb-8">
            {authorImg ? (
            <div className="relative w-10 h-10 overflow-hidden rounded-full ring-2 ring-border">
              <Image 
                src={authorImg} 
                alt={`${authorName} avatar`} 
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized={true}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-muted">
              <FiUser className="w-5 h-5" />
            </div>
          )}
          <h3 className="font-semibold">{authorName}</h3>
        </div>
        {/* Metadata Badges Matrix Row */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6" aria-label="Lesson metadata tags">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-surface border border-border text-muted"
            aria-label={`Category classification: ${category}`}
          >
            <FiTag className="w-3 h-3 text-secondary" aria-hidden="true" />
            {category}
          </span>
          
          <span 
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border tracking-wide uppercase ${getToneStyles(emotionalTone)}`}
            aria-label={`Emotional tone vibe: ${emotionalTone}`}
          >
            <FiHeart className="w-3 h-3 fill-current" aria-hidden="true" />
            {emotionalTone}
          </span>
        </div>

        {/* Title Heading Element */}
        <header className="mb-6">
          <h2 
            id="lesson-card-heading" 
            className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight mb-2 text-foreground"
          >
            {title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted font-medium">
            <FiBookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Estimated publish: {formatDate(createdAt)}</span>
          </div>
        </header>

        {/* Lesson Prose Rich Narrative Text Frame */}
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <p className="text-foreground/85 text-base sm:text-lg leading-relaxed whitespace-pre-wrap tracking-wide font-normal">
            {description}
          </p>
        </div>

      </div>
    </article>
  );
}