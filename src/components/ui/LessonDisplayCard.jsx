import React from "react";
import Image from "next/image";
import { FiHeart, FiTag, FiCalendar, FiUser } from "react-icons/fi";

/**
 * LessonDisplayCard - High performance Next.js optimized component card 
 * mapped seamlessly onto your live production MongoDB data objects.
 */
export default function LessonDisplayCard({ lessonData = {} }) {
  // Destructure attributes cleanly from your live database layout
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

  // Format ISO timestamps into clean visual text layers (e.g., Jun 21, 2026)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "";
    }
  };

  // Assign tone design configurations based on global styles
  const getToneStyles = (tone) => {
    const standardizedTone = tone?.toLowerCase() || "";
    if (standardizedTone.includes("motivational") || standardizedTone.includes("gratitude")) {
      return "bg-primary/10 dark:bg-primary/20 text-primary border-primary/20";
    }
    if (standardizedTone.includes("sad") || standardizedTone.includes("realization")) {
      return "bg-secondary/10 dark:bg-secondary/20 text-secondary border-secondary/20";
    }
    return "bg-surface text-muted border-border";
  };

  return (
    <article className="w-full max-w-3xl mx-auto bg-card text-foreground border border-border hover:border-border-hover rounded-3xl overflow-hidden shadow-md transition-all duration-300">
      
      {/* Immersive Image Header - Fixed using Next.js capital <Image /> handler */}
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

      {/* Primary Context Container Details */}
      <div className="p-6 sm:p-8 md:p-10">
        
        {/* Author Bio Identity Section */}
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border/60">
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
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground/90">{authorName}</span>
            {createdAt && (
              <span className="text-xs text-muted flex items-center gap-1 mt-0.5">
                <FiCalendar className="w-3 h-3" />
                {formatDate(createdAt)}
              </span>
            )}
          </div>
        </div>

        {/* Categories / Tone Badges Container */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-surface border border-border text-muted">
            <FiTag className="w-3 h-3 text-secondary" />
            {category}
          </span>
          
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border tracking-wide uppercase ${getToneStyles(emotionalTone)}`}>
            <FiHeart className="w-3 h-3 fill-current" />
            {emotionalTone}
          </span>
        </div>

        {/* Header Block Section */}
        <header className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-foreground/95">
            {title}
          </h1>
        </header>

        {/* Lesson Prose Content Section */}
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <p className="text-foreground/85 text-base sm:text-lg leading-relaxed whitespace-pre-wrap tracking-wide font-normal">
            {description}
          </p>
        </div>

      </div>
    </article>
  );
}