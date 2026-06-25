"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiHeart, FiEye, FiTrash2, FiSliders, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const EMOTIONAL_TONES = [
  "Motivational",
  "Sad",
  "Realization",
  "Gratitude",
];

export default function MyFavoritesPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [toneFilter, setToneFilter] = useState("All");

  const sessionIdRef = useRef(null);

  // Update ref when session changes (stable reference)
  useEffect(() => {
    if (session?.user?.id) {
      sessionIdRef.current = session.user.id;
    }
  }, [session?.user?.id]);

  const fetchFavorites = useCallback(async () => {
    const userId = sessionIdRef.current;
    if (!userId) return;

    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/favorites?userId=${userId}`);

      if (!res.ok) throw new Error("Failed to fetch favorites");

      const data = await res.json();
      if (data.success) {
        setFavorites(data.data || []);
      }
    } catch (err) {
      toast.error("Failed to load favorites.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - uses ref for session ID

  // Trigger fetch when session is ready
  useEffect(() => {
    if (!sessionLoading && session?.user?.id) {
      fetchFavorites();
    }
  }, [sessionLoading, session?.user?.id, fetchFavorites]);

  const handleRemove = async (lessonId, title) => {
    const userId = sessionIdRef.current;
    if (!userId) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/lessons/${lessonId}/favorite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        setFavorites((prev) => prev.filter((l) => l._id !== lessonId));
        toast.success(`Removed "${title}" from favorites`);
      } else {
        toast.error("Failed to remove favorite");
      }
    } catch (err) {
      toast.error("Error updating favorites");
      console.error(err);
    }
  };

  const filteredData = useMemo(() => {
    return favorites.filter((item) => {
      const matchCat = categoryFilter === "All" || item.category === categoryFilter;
      const matchTone = toneFilter === "All" || item.emotionalTone === toneFilter;
      return matchCat && matchTone;
    });
  }, [favorites, categoryFilter, toneFilter]);

  const clearFilters = () => {
    setCategoryFilter("All");
    setToneFilter("All");
  };

  if (sessionLoading || loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-background">
        <FiLoader className="animate-spin text-primary text-3xl" />
      </div>
    );
  }

  return (
    <main className="p-6 md:p-8 max-w-7xl mx-auto bg-background min-h-screen text-foreground">
      <div className="flex items-center gap-3 mb-2">
        <FiHeart className="text-primary text-3xl" />
        <h1 className="text-3xl font-black tracking-tight">My Favorites</h1>
      </div>
      <p className="text-muted mb-8 max-w-md">
        Curated lessons and insights you&apos;ve saved for later.
      </p>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-8 bg-card p-5 rounded-3xl border border-border items-center">
        <div className="flex items-center gap-2 text-primary">
          <FiSliders className="text-xl" />
          <span className="font-medium text-sm uppercase tracking-widest text-muted">Filters</span>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-surface border border-border focus:border-primary-hover rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          aria-label="Filter by category"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={toneFilter}
          onChange={(e) => setToneFilter(e.target.value)}
          className="bg-surface border border-border focus:border-primary-hover rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          aria-label="Filter by emotional tone"
        >
          <option value="All">All Tones</option>
          {EMOTIONAL_TONES.map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </select>

        {(categoryFilter !== "All" || toneFilter !== "All") && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-4"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-6 opacity-40">♡</div>
            <p className="text-xl font-medium mb-2">No matching favorites</p>
            <p className="text-muted max-w-xs">Try changing your filters or saving some lessons.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-160" role="table">
              <caption className="sr-only">Your favorite lessons</caption>
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th scope="col" className="p-5 font-bold uppercase text-xs tracking-widest text-muted">
                    Lesson
                  </th>
                  <th scope="col" className="p-5 font-bold uppercase text-xs tracking-widest text-muted">
                    Category
                  </th>
                  <th scope="col" className="p-5 font-bold uppercase text-xs tracking-widest text-muted">
                    Tone
                  </th>
                  <th scope="col" className="p-5 text-right font-bold uppercase text-xs tracking-widest text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence>
                  {filteredData.map((lesson) => (
                    <motion.tr
                      key={lesson._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="group hover:bg-surface/70 transition-colors"
                    >
                      <td className="p-5 text-nowrap font-medium pr-8">{lesson.title}</td>
                      <td className="p-5 text-nowrap text-sm text-muted">{lesson.category}</td>
                      <td className="p-5 text-nowrap text-sm text-muted">{lesson.emotionalTone}</td>
                      <td className="p-5">
                        <div className="flex items-center gap-3 justify-end">
                          <button
                            onClick={() => router.push(`/lessons/${lesson._id}`)}
                            aria-label={`View details for ${lesson.title}`}
                            className="p-3 rounded-2xl border border-border hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
                          >
                            <FiEye className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleRemove(lesson._id, lesson.title)}
                            aria-label={`Remove ${lesson.title} from favorites`}
                            className="p-3 rounded-2xl border border-border hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all active:scale-95"
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}