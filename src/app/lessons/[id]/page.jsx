// src/app/lessons/[id]/page.jsx
import React from "react";
import Container from "@/components/shared/Container";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import LessonDisplayCard from "@/components/ui/LessonDisplayCard";

/**
 * Dynamic Lesson Detail Page (Server Component)
 * Automatically receives the "id" parameter from the URL path matrix.
 */
export default async function DynamicLessonPage({ params }) {
  // Await the params object in modern Next.js conventions
  const { id } = await params;
  
  let lessonData = null;
  let errorMessage = null;

  try {
    // Fetch data directly from your backend express API server running on port 5000
    const response = await fetch(`http://localhost:5000/api/lessons/${id}`, {
      // Next.js cache control option: 
      // Revalidate page data if it hasn't been requested in the last 60 seconds
      next: { revalidate: 60 }, 
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve lesson data. Status: ${response.status}`);
    }

    lessonData = await response.json();
  } catch (error) {
    console.error(`Error connecting to lesson API data stream for ID ${id}:`, error);
    errorMessage = error.message;
  }

  // Graceful Error State UI Layout Boundary
  if (errorMessage || !lessonData) {
    return (
      <main className="min-h-screen bg-background text-foreground py-20 transition-colors duration-300">
        <Container>
          <div className="max-w-md mx-auto text-center bg-card border border-border p-8 rounded-3xl shadow-sm">
            <FiAlertCircle className="w-12 h-12 text-secondary mx-auto mb-4 animate-pulse" />
            <h1 className="text-xl font-black tracking-tight mb-2">Lesson Unavailable</h1>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              We couldn&apos;t load the requested life lesson asset. It may have been restricted or removed from our database records.
            </p>
            <Link 
              href="/lessons" 
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors"
            >
              <FiArrowLeft />
              <span>Return to Lessons Stream</span>
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-12 sm:py-16 transition-colors duration-300">
      <Container>
        
        {/* Section Aesthetic Context Header Layout */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-black tracking-widest text-primary mb-2 block">
            Archived Journal Log
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Lesson Stream Content
          </h1>
        </div>

        {/* Clean presentation card reading your live, dynamic API database values */}
        <LessonDisplayCard lessonData={lessonData} />

      </Container>
    </main>
  );
}