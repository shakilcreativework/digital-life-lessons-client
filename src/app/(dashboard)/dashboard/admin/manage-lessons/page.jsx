"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiBookOpen, 
  FiTrash2, 
  FiAlertTriangle, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight,
  FiEye,
  FiSmile
} from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ManageLessonsPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  // Core Lifecycle States
  const [isMounted, setIsMounted] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination Config
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Deletion Modal Control State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, targetLesson: null });
  const [actionProcessing, setActionProcessing] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Prevent server/client hydration mismatches safely
  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  // Fetch all lessons from the admin endpoint
  const fetchLessonsData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/lessons`, {
        cache: "no-store",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) throw new Error("Failed fetching lesson stream records.");
      const data = await response.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Lessons Error:", error);
      toast.error("Failed loading platform lesson ledger.");
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  // Auth gate checks
  useEffect(() => {
    if (isMounted && !isPending) {
      if (!session) {
        router.push("/login");
      } else if (session.user.role !== "admin") {
        toast.error("Access Forbidden.");
        router.push("/dashboard");
      } else {
        queueMicrotask(() => {
          fetchLessonsData();
        });
      }
    }
  }, [session, isPending, isMounted, router, fetchLessonsData]);

  // Delete handler action execution
  const handleDeleteLesson = async () => {
    if (!deleteModal.targetLesson) return;
    try {
      setActionProcessing(true);
      const response = await fetch(`${BASE_URL}/api/lessons/${deleteModal.targetLesson._id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Purge request failed on server.");

      toast.success("Lesson content entry permanently removed.");
      setDeleteModal({ isOpen: false, targetLesson: null });
      fetchLessonsData();
    } catch (error) {
      toast.error(error.message || "Failed to remove target lesson record.");
    } finally {
      setActionProcessing(false);
    }
  };

  // Search filter implementation (checks title, category, and author name)
  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) return lessons;
    const cleanQuery = searchQuery.toLowerCase().trim();
    return lessons.filter((lesson) => {
      const titleMatch = lesson.title?.toLowerCase().includes(cleanQuery);
      const catMatch = lesson.category?.toLowerCase().includes(cleanQuery);
      const authorMatch = lesson.authorName?.toLowerCase().includes(cleanQuery);
      return titleMatch || catMatch || authorMatch;
    });
  }, [lessons, searchQuery]);

  // Pagination processing
  const paginatedLessons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLessons.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLessons, currentPage]);

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage) || 1;

  if (!isMounted || isPending || !session || session.user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background text-foreground">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted mt-4 text-sm font-medium">Validating administrative clearances...</p>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-background text-foreground px-4 py-8 md:px-8 max-w-7xl mx-auto">
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <FiBookOpen className="text-primary shrink-0" /> Manage Lessons
          </h1>
          <p className="text-muted text-sm mt-1">
            Review, inspect, or remove published streams and course contents across the digital space.
          </p>
        </div>
        <div className="bg-card px-4 py-2 rounded-xl border border-border shadow-sm text-center md:text-right">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Total Lessons Live</span>
          <span className="text-2xl font-bold text-foreground">{lessons.length}</span>
        </div>
      </div>

      {/* FILTER CONTROL PANEL BAR */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search by title, category, or author..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
        {searchQuery && (
          <button 
            onClick={() => {
              setSearchQuery("");
              setCurrentPage(1);
            }}
            className="text-xs font-semibold text-primary hover:underline self-start md:self-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* WORK CONTENT CONTAINER GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted text-xs mt-3">Fetching current lesson archives...</p>
        </div>
      ) : paginatedLessons.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card rounded-2xl border border-border">
          <FiSearch className="w-12 h-12 text-muted mx-auto mb-3" />
          <h3 className="text-base font-bold text-foreground">No corresponding lessons match your query</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedLessons.map((lesson) => (
              <motion.div
                key={lesson._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col hover:border-border-hover transition-colors"
              >
                {/* Image / Card Cover Banner Area */}
                <div className="relative h-44 w-full bg-surface">
                  {lesson.image ? (
                    <Image
                      src={lesson.image}
                      alt={lesson.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted">
                      <FiBookOpen className="w-10 h-10 stroke-[1.5]" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md text-foreground font-semibold text-[11px] px-2.5 py-1 rounded-md border border-border uppercase tracking-wide">
                    {lesson.category || "General"}
                  </div>
                </div>

                {/* Main Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-foreground line-clamp-1 mb-1" title={lesson.title}>
                      {lesson.title}
                    </h3>
                    <p className="text-muted text-xs line-clamp-2 mb-4 leading-relaxed">
                      {lesson.description || "No dynamic descriptions provided for this course asset entry."}
                    </p>
                  </div>

                  {/* Meta / Profile Information Row footer */}
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2 max-w-[65%]">
                      {lesson.authorImg ? (
                        <Image
                          src={lesson.authorImg}
                          alt={lesson.authorName}
                          width={28}
                          height={28}
                          className="rounded-full object-cover shrink-0 border border-border"
                          unoptimized
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold flex items-center justify-center shrink-0">
                          {lesson.authorName?.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs font-medium text-foreground truncate">
                        By {lesson.authorName}
                      </span>
                    </div>

                    {/* Operational Admin Mod Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => router.push(`/lessons/${lesson._id}`)}
                        className="p-2 bg-surface text-foreground border border-border hover:bg-border-hover rounded-xl transition-colors"
                        title="View Live Lesson Page"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, targetLesson: lesson })}
                        className="p-2 bg-red-500/10 text-red-500 border border-red-200/20 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                        title="Delete Lesson Content"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* FOOTER CONTROLS ROW */}
      {!loading && filteredLessons.length > itemsPerPage && (
        <div className="mt-8 p-4 bg-surface border border-border rounded-2xl flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 bg-card border border-border text-foreground text-sm font-medium rounded-xl hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <FiChevronLeft className="w-4 h-4" /> Previous
          </button>
          <div className="text-xs text-muted font-medium">
            Page <span className="text-foreground font-bold">{currentPage}</span> of <span className="text-foreground font-bold">{totalPages}</span>
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 bg-card border border-border text-foreground text-sm font-medium rounded-xl hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            Next <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* REMOVAL DIALOG ACTION MODAL */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-md border border-red-200/30 p-6 rounded-2xl shadow-xl text-foreground"
            >
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <h3 className="text-base font-bold flex items-center gap-2 text-red-500">
                  <FiAlertTriangle className="w-5 h-5" /> Purge Lesson Entry
                </h3>
                <button 
                  onClick={() => setDeleteModal({ isOpen: false, targetLesson: null })}
                  className="p-1.5 hover:bg-surface rounded-lg text-muted transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Are you sure you want to permanently delete the lesson titled: <span className="font-bold text-foreground">{deleteModal.targetLesson?.title}</span>? This will wipe the lesson entry completely from public data lists.
              </p>
              <div className="flex items-center justify-end gap-3 mt-6 border-t border-border pt-4">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, targetLesson: null })}
                  disabled={actionProcessing}
                  className="px-4 py-2 bg-surface hover:bg-border-hover text-foreground font-medium text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteLesson}
                  disabled={actionProcessing}
                  className="px-4 py-2 bg-red-500 text-white font-semibold text-xs rounded-xl hover:bg-red-600 transition-colors"
                >
                  {actionProcessing ? "Purging..." : "Confirm Deletion"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}