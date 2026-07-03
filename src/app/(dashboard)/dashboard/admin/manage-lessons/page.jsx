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
  FiStar,
  FiCheckCircle,
  FiFilter,
  FiGlobe,
  FiLock,
  FiFlag
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import LoadingData from "@/components/ui/LoadingData";

export default function ManageLessonsPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  // Hydration-safe state handling using a strict sync store hook pattern
  const isMounted = React.useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );

  // Core Functional Component States
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Advanced Multi-Tier Administrative Filtering States
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVisibility, setSelectedVisibility] = useState("all");
  const [selectedFlagStatus, setSelectedFlagStatus] = useState("all");

  // Pagination Configuration
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Transactional Modal Control Overlays
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, targetLesson: null });
  const [actionProcessing, setActionProcessing] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Data Fetching Memoized Callback
  const fetchLessonsData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetching records directly from the application's core data API stream
      const response = await fetch(`${BASE_URL}/api/admin/lessons`, {
        cache: "no-store",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Failed to pull platform lesson asset ledger.");
      const data = await response.json();

      // Handle array unpacking depending on structure variations
      const normalizedData = Array.isArray(data) ? data : (data.lessons || []);
      setLessons(normalizedData);
    } catch (error) {
      console.error("Lessons API Retrieval Error:", error);
      toast.error("Failed loading target lesson registry arrays.");
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  // Route Authentication Gate Controller
  useEffect(() => {
    if (isMounted && !isPending) {
      if (!session) {
        router.push("/login");
      } else if (session.user.role !== "admin") {
        toast.error("Access Forbidden. Administrative elevation credentials required.");
        router.push("/dashboard");
      } else {
        queueMicrotask(() => {
          fetchLessonsData();
        });
      }
    }
  }, [session, isPending, isMounted, router, fetchLessonsData]);

  // Core Mutation Request Toggles: Feature Status Toggling
  const handleToggleFeatured = async (lessonId, currentStatus) => {
    try {
      // FIXED: Appended '/featured' to match the backend route exactly
      const response = await fetch(`${BASE_URL}/api/admin/lessons/${lessonId}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentStatus })
      });

      if (!response.ok) {
        throw new Error("Could not update lesson feature status configuration.");
      }

      toast.success(!currentStatus ? "Lesson marked as Featured live entry!" : "Lesson removed from Featured status.");
      fetchLessonsData(); // Refreshes UI state smoothly
    } catch (error) {
      toast.error(error.message || "Failed to update asset visibility tier status.");
    }
  };

  // Core Mutation Request Toggles: Content Review Review Verification
  const handleMarkReviewed = async (lessonId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/lessons/${lessonId}/reviewed`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isReviewed: true, isFlagged: false }) // Resolves flags upon review completion
      });

      if (!response.ok) throw new Error("Could not modify account asset review flag data.");

      toast.success("Content marked as reviewed and cleared.");
      fetchLessonsData();
    } catch (error) {
      toast.error(error.message || "Failed to commit content review confirmation parameters.");
    }
  };

  // Core Mutation Request Toggles: Deletion Execution Handler
  const handleDeleteLesson = async () => {
    if (!deleteModal.targetLesson) return;
    try {
      setActionProcessing(true);

      // FIXED: Updated BASE_URL to use process.env.NEXT_PUBLIC_API_URL explicitly
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/lessons/${deleteModal.targetLesson._id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("The target entity destruction loop failed on the server.");
      }

      toast.success("Lesson content data dropped from records successfully.");
      setDeleteModal({ isOpen: false, targetLesson: null });
      fetchLessonsData(); // Refreshes the admin view roster smoothly
    } catch (error) {
      toast.error(error.message || "Failed to delete target asset registry object.");
    } finally {
      setActionProcessing(false);
    }
  };

  // Multi-Tier Client Filtering Block Optimization Logic Engine
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      // 1. Evaluate Text Search Component Query Bounds
      const cleanQuery = searchQuery.toLowerCase().trim();
      const titleMatch = lesson.title?.toLowerCase().includes(cleanQuery);
      const categoryMatchText = lesson.category?.toLowerCase().includes(cleanQuery);
      const authorMatch = lesson.authorName?.toLowerCase().includes(cleanQuery);
      const matchesSearch = !cleanQuery || titleMatch || categoryMatchText || authorMatch;

      // 2. Evaluate Explicit Selected Dropdown Filter Configurations
      const matchesCategory = selectedCategory === "all" ||
        lesson.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesVisibility = selectedVisibility === "all" ||
        (selectedVisibility === "public" && lesson.visibility !== "private") ||
        (selectedVisibility === "private" && lesson.visibility === "private");

      const matchesFlags = selectedFlagStatus === "all" ||
        (selectedFlagStatus === "flagged" && (lesson.isFlagged || lesson.reportsCount > 0)) ||
        (selectedFlagStatus === "reviewed" && lesson.isReviewed) ||
        (selectedFlagStatus === "pending" && !lesson.isReviewed && !lesson.isFlagged);

      return matchesSearch && matchesCategory && matchesVisibility && matchesFlags;
    });
  }, [lessons, searchQuery, selectedCategory, selectedVisibility, selectedFlagStatus]);

  // Aggregate Computation Metrics Real-Time System Statistics Evaluator
  const metrics = useMemo(() => {
    return {
      publicCount: lessons.filter(l => l.visibility !== "private").length,
      privateCount: lessons.filter(l => l.visibility === "private").length,
      flaggedCount: lessons.filter(l => l.isFlagged || l.reportsCount > 0).length,
    };
  }, [lessons]);

  // Paginated user computation layout slices
  const paginatedLessons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLessons.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLessons, currentPage]);

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage) || 1;

  // Global Filter Reset Matrix Trigger Function
  const handleResetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedVisibility("all");
    setSelectedFlagStatus("all");
    setCurrentPage(1);
  };

  if (!isMounted || isPending || !session || session.user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background text-foreground">
        <LoadingData text="Validating administrative clearances..." />
      </div>
    );
  }

  return (
    <main className="pb-20">

      {/* 1. AGGREGATED METRICS STATS HEADER GRID */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <FiBookOpen className="text-primary shrink-0" /> Manage Lessons
          </h1>
          <p className="text-muted text-sm mt-1">
            Review, inspect, or remove published streams and course contents across the digital space.
          </p>
        </div>

        {/* Real-Time Platform Counters */}
        <div className="grid grid-cols-3 gap-4 w-full lg:w-auto shrink-0">
          <div className="bg-card px-4 py-3 rounded-xl border border-border shadow-sm min-w-27.5">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-0.5">Public</span>
            <div className="flex items-center gap-1.5">
              <FiGlobe className="text-success text-sm" />
              <span className="text-xl font-bold text-foreground">{metrics.publicCount}</span>
            </div>
          </div>
          <div className="bg-card px-4 py-3 rounded-xl border border-border shadow-sm min-w-27.5">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-0.5">Private</span>
            <div className="flex items-center gap-1.5">
              <FiLock className="text-primary text-sm" />
              <span className="text-xl font-bold text-foreground">{metrics.privateCount}</span>
            </div>
          </div>
          <div className="bg-card px-4 py-3 rounded-xl border border-border shadow-sm min-w-27.5">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-0.5">Flagged</span>
            <div className="flex items-center gap-1.5">
              <FiFlag className="text-red-500 text-sm" />
              <span className="text-xl font-bold text-foreground">{metrics.flaggedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ADVANCED CONTROL SYSTEM PANEL FILTER BAR */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm mb-6 flex flex-col xl:flex-row items-stretch xl:items-center gap-4">
        {/* Real-time query search box inputs */}
        <div className="relative flex-1">
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
            aria-label="Search content inputs"
          />
        </div>

        {/* Multi-Tier Select Filtering Node Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          {/* Category Dropdown */}
          <div className="relative flex items-center">
            <FiFilter className="absolute left-3 text-muted pointer-events-none text-xs" />
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-8 py-2.5 bg-background border border-border rounded-xl text-xs font-medium text-foreground focus:outline-none focus:border-secondary transition-colors appearance-none cursor-pointer w-full"
              aria-label="Filter category"
            >
              <option value="all">All Categories</option>
              <option value="personal growth">Personal Growth</option>
              <option value="career">Career</option>
              <option value="mindset">Mindset</option>
              <option value="mistakes learned">Mistakes Learned</option>
            </select>
          </div>

          {/* Visibility Dropdown */}
          <div className="relative flex items-center">
            <FiGlobe className="absolute left-3 text-muted pointer-events-none text-xs" />
            <select
              value={selectedVisibility}
              onChange={(e) => { setSelectedVisibility(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-8 py-2.5 bg-background border border-border rounded-xl text-xs font-medium text-foreground focus:outline-none focus:border-secondary transition-colors appearance-none cursor-pointer w-full"
              aria-label="Filter visibility parameters"
            >
              <option value="all">All Visibility Types</option>
              <option value="public">Public Content</option>
              <option value="private">Private Content</option>
            </select>
          </div>

          {/* Moderation Status Dropdown */}
          <div className="relative flex items-center">
            <FiAlertTriangle className="absolute left-3 text-muted pointer-events-none text-xs" />
            <select
              value={selectedFlagStatus}
              onChange={(e) => { setSelectedFlagStatus(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-8 py-2.5 bg-background border border-border rounded-xl text-xs font-medium text-foreground focus:outline-none focus:border-secondary transition-colors appearance-none cursor-pointer w-full"
              aria-label="Filter moderation flag level"
            >
              <option value="all">All Moderation Tiers</option>
              <option value="flagged">Reported / Flagged</option>
              <option value="reviewed">Approved / Reviewed</option>
              <option value="pending">Awaiting Audit</option>
            </select>
          </div>
        </div>

        {/* Global Reset Switch Handle */}
        {(searchQuery || selectedCategory !== "all" || selectedVisibility !== "all" || selectedFlagStatus !== "all") && (
          <button
            onClick={handleResetAllFilters}
            className="text-xs font-bold text-primary hover:underline px-2 text-center shrink-0 self-center"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* 3. CORE MATERIAL WORKSPACE CARDS GRID SYSTEM CONTAINER */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-card rounded-2xl border border-border shadow-sm">
          <LoadingData text="Fetching dashboard course records..." />
        </div>
      ) : paginatedLessons.length === 0 ? (
        <div className="text-center py-20 px-4 bg-card rounded-2xl border border-border shadow-sm">
          <FiSearch className="w-12 h-12 text-muted mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-base font-bold text-foreground">No platform lessons match requested filters</h3>
          <p className="text-muted text-xs mt-1 max-w-xs mx-auto">
            Try adjusting your configuration filters or query phrases above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedLessons.map((lesson) => {
              const isItemFlagged = lesson.isFlagged || (lesson.reportsCount > 0);
              return (
                <motion.div
                  key={lesson._id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-border-hover transition-colors relative ${isItemFlagged ? "border-red-500/40 dark:border-red-500/30" : "border-border"
                    }`}
                >
                  {/* Top Graphic Media Layer */}
                  <div className="relative h-44 w-full bg-surface">
                    {lesson.image ? (
                      <Image
                        src={lesson.image}
                        alt={lesson.title}
                        fill
                        className="object-cover"
                        unoptimized
                        loading="eager"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted">
                        <FiBookOpen className="w-10 h-10 stroke-[1.2]" />
                      </div>
                    )}

                    {/* Operational Badges Row */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                      <span className="bg-background/90 backdrop-blur-md text-foreground font-bold text-[10px] px-2.5 py-1 rounded-md border border-border uppercase tracking-wide">
                        {lesson.category || "General"}
                      </span>
                      {lesson.isFeatured && (
                        <span className="bg-primary text-white font-bold text-[10px] px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wide shadow-sm">
                          <FiStar className="fill-current text-xs" /> Featured
                        </span>
                      )}
                      {lesson.visibility === "private" && (
                        <span className="bg-neutral-900/80 backdrop-blur-md text-white font-bold text-[10px] px-2 py-1 rounded-md border border-white/10 flex items-center gap-1 uppercase tracking-wide">
                          <FiLock className="text-xs" /> Private
                        </span>
                      )}
                    </div>

                    {/* Inappropriate/Report Alert Header Overlay */}
                    {isItemFlagged && (
                      <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent p-3 pt-8 flex items-center justify-between text-white">
                        <span className="text-xs font-bold flex items-center gap-1.5 text-red-400">
                          <FiAlertTriangle className="animate-pulse" /> Reported Content
                        </span>
                        <span className="text-[10px] bg-red-500 font-extrabold px-1.5 py-0.5 rounded">
                          {lesson.reportsCount || 1} Flags
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Text Metadata Layer */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="mb-4">
                      <h3 className="font-bold text-base text-foreground line-clamp-1 mb-1" title={lesson.title}>
                        {lesson.title}
                      </h3>
                      <p className="text-muted text-xs line-clamp-2 leading-relaxed">
                        {lesson.description || "No descriptive summary logs cataloged for this training framework."}
                      </p>
                    </div>

                    {/* Meta/Author Footer Row */}
                    <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 max-w-[50%] truncate">
                        {lesson.authorImg ? (
                          <Image
                            src={lesson.authorImg}
                            alt={lesson.authorName || "Author"}
                            width={26}
                            height={26}
                            className="rounded-full object-cover shrink-0 border border-border"
                            unoptimized
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-secondary/10 text-secondary text-[9px] font-bold flex items-center justify-center shrink-0">
                            {lesson.authorName ? lesson.authorName.substring(0, 2).toUpperCase() : "AU"}
                          </div>
                        )}
                        <span className="text-xs font-medium text-foreground truncate">
                          By {lesson.authorName || "Anonymous"}
                        </span>
                      </div>

                      {/* Interactive Administration Control Array */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Toggle Featured Trigger */}
                        <button
                          onClick={() => handleToggleFeatured(lesson._id, lesson.isFeatured)}
                          className={`p-2 rounded-xl border transition-all ${lesson.isFeatured
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-surface text-muted border-border hover:text-primary hover:border-primary/40"
                            }`}
                          title={lesson.isFeatured ? "Demote from Featured Section" : "Make Feature Item"}
                          aria-label="Toggle Featured item status"
                        >
                          <FiStar className={`w-3.5 h-3.5 ${lesson.isFeatured ? "fill-current" : ""}`} />
                        </button>

                        {/* Mark Reviewed/Clear Toggles */}
                        {(!lesson.isReviewed || isItemFlagged) && (
                          <button
                            onClick={() => handleMarkReviewed(lesson._id)}
                            className="p-2 bg-surface text-muted border border-border hover:text-success hover:border-success/40 rounded-xl transition-all"
                            title="Approve Content & Clear Flags"
                            aria-label="Approve content items"
                          >
                            <FiCheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* View Production Live Details Path */}
                        <button
                          onClick={() => router.push(`/lessons/${lesson._id}`)}
                          className="p-2 bg-surface text-foreground border border-border hover:bg-border-hover rounded-xl transition-colors"
                          title="View Live Page View"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Entity Permanent Removal Triggers */}
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, targetLesson: lesson })}
                          className="p-2 bg-red-500/10 text-red-500 border border-red-200/20 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                          title="Purge Inappropriate Lesson Content"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* 4. DYNAMIC PAGINATION FOOTER BLOCK CONTROLLER */}
      {!loading && filteredLessons.length > itemsPerPage && (
        <div className="mt-8 p-4 bg-surface border border-border rounded-2xl flex items-center justify-between gap-4 shadow-sm">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 bg-card border border-border text-foreground text-xs font-semibold rounded-xl hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <FiChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="text-xs text-muted font-medium">
            Page <span className="text-foreground font-bold">{currentPage}</span> of <span className="text-foreground font-bold">{totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 bg-card border border-border text-foreground text-xs font-semibold rounded-xl hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            Next <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. MODAL OVERLAY: REMOVAL CONFIRMATION SYSTEM */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-md border border-red-500/20 p-6 rounded-2xl shadow-xl text-foreground"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <h3 className="text-base font-bold flex items-center gap-2 text-red-500">
                  <FiAlertTriangle className="w-5 h-5 animate-bounce" /> Purge Lesson Entry
                </h3>
                <button
                  onClick={() => setDeleteModal({ isOpen: false, targetLesson: null })}
                  className="p-1.5 hover:bg-surface rounded-lg text-muted transition-colors"
                  aria-label="Close modal dialog"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                You are about to execute a permanent deletion protocol against the lesson course file:
                <span className="block my-2 p-2.5 bg-surface text-foreground font-bold rounded-xl border border-border wrap-break-word">
                  {deleteModal.targetLesson?.title}
                </span>
                This action cannot be undone and will drop all user bookmark associations instantly.
              </p>
              <div className="flex items-center justify-end gap-3 mt-6 border-t border-border pt-4">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, targetLesson: null })}
                  disabled={actionProcessing}
                  className="px-4 py-2 bg-surface hover:bg-border-hover text-foreground font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteLesson}
                  disabled={actionProcessing}
                  className="px-4 py-2 bg-red-500 text-white font-bold text-xs rounded-xl hover:bg-red-600 transition-colors shadow-sm"
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