"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiEye, 
  FiEyeOff, 
  FiLock, 
  FiUnlock, 
  FiHeart, 
  FiBookmark, 
  FiCalendar, 
  FiEdit3, 
  FiTrash2, 
  FiGlobe, 
  FiSearch, 
  FiPlus, 
  FiBookOpen,
  FiX
} from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function MyLessonsPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  // Hydration protection hook tracking state
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Core Data States
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog System Component States
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, lesson: null });
  const [actionProcessing, setActionProcessing] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch creator-specific lesson lists using the newly optimized route channel
  // Updated frontend data hook targeting the user's authentic creatorId index value
  const fetchCreatorLessons = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      
      // Target the new route passing down the explicit creator session ID string
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creator/lessons/${session.user.id}`, {
        cache: "no-store",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) throw new Error("Could not sync personalized workspace items.");
      const data = await response.json();
      
      setLessons(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync your platform lesson index records.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Security Access & Asynchronous Data Initialization Route Controller
  useEffect(() => {
    if (isMounted && !isPending) {
      if (!session) {
        router.push("/login");
      } else {
        const controller = new AbortController();
        
        // Wrap state assignment execution into an asynchronous frame to avoid cascading render error
        const scheduleFetch = async () => {
          await new Promise(resolve => setTimeout(resolve, 0));
          if (!controller.signal.aborted) {
            fetchCreatorLessons();
          }
        };

        scheduleFetch();

        return () => {
          controller.abort();
        };
      }
    }
  }, [session, isPending, isMounted, router, fetchCreatorLessons]);

  // Action: Toggle Visibility Attributes (Public/Private)
  const handleToggleVisibility = async (lessonId, currentVisibility) => {
    const nextVisibility = currentVisibility === "Public" ? "Private" : "Public";
    try {
      const response = await fetch(`${API_BASE}/api/lessons/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: nextVisibility, isPublic: nextVisibility === "Public" })
      });

      if (!response.ok) throw new Error("Server rejected state transformation workflow.");
      
      toast.success(`Lesson visibility is now set to ${nextVisibility}.`);
      fetchCreatorLessons();
    } catch (err) {
      toast.error(err.message || "Failed to mutate access scope property.");
    }
  };

  // Action: Toggle Access Level Attributes (Free/Premium) with Premium User Gate Check
  const handleToggleAccessLevel = async (lessonId, currentAccess) => {
    if (!session?.user?.isPremium) {
      toast.error("Access tier promotion requires a Premium Account membership upgrade.");
      return;
    }

    const nextAccess = currentAccess === "Premium" ? "Free" : "Premium";
    try {
      const response = await fetch(`${API_BASE}/api/lessons/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessLevel: nextAccess, isPremium: nextAccess === "Premium" })
      });

      if (!response.ok) throw new Error("Server rejected premium transformation tier adjustments.");
      
      toast.success(`Lesson set to ${nextAccess} access format.`);
      fetchCreatorLessons();
    } catch (err) {
      toast.error(err.message || "Failed to commit content access profile variables.");
    }
  };

  // Action: Execute Permanent Deletion Sequence
  const handleDeleteExecute = async () => {
    if (!deleteModal.lesson?._id) return;
    try {
      setActionProcessing(true);
      const response = await fetch(`${API_BASE}/api/lessons/${deleteModal.lesson._id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Destruction pipeline rejected execution transaction.");

      toast.success("Lesson content dropped from system matrices successfully.");
      setDeleteModal({ isOpen: false, lesson: null });
      fetchCreatorLessons();
    } catch (err) {
      toast.error(err.message || "Failed to completely drop asset record references.");
    } finally {
      setActionProcessing(false);
    }
  };

  // Keyboard accessibility helper inside deletion modal component
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && deleteModal.isOpen) {
        setDeleteModal({ isOpen: false, lesson: null });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteModal.isOpen]);

  // Memoized client-side filtration optimization processing
  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) return lessons;
    const matchStr = searchQuery.toLowerCase();
    return lessons.filter(l => 
      l.title?.toLowerCase().includes(matchStr) || 
      l.category?.toLowerCase().includes(matchStr)
    );
  }, [lessons, searchQuery]);

  if (!isMounted || isPending || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background text-foreground transition-colors duration-200">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-muted mt-3 font-semibold tracking-wide uppercase">Syncing secure creator workspace...</p>
      </div>
    );
  }

  return (
    <main className="pb-20">
      
      {/* STUDIO BANNER CONTAINER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <FiBookOpen className="text-secondary shrink-0" /> Studio Workspace
          </h1>
          <p className="text-xs text-muted mt-1">
            Build, test, distribute, and track analytical metrics on your course materials.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/add-lesson")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary-hover transition-all active:scale-[0.98]"
        >
          <FiPlus className="w-4 h-4" /> Publish New Entry
        </button>
      </div>

      {/* FILTER SEARCH FIELD AND METRICS OVERVIEW HUB */}
      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center transition-colors duration-200">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search records by course titles or fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-secondary transition-colors placeholder:text-muted/60"
            aria-label="Search items by core fields"
          />
        </div>
        <div className="sm:ml-auto text-xs font-semibold text-muted bg-surface border border-border px-4 py-2 rounded-xl transition-colors duration-200">
          Total Content Assets: <span className="text-foreground font-black" aria-live="polite">{filteredLessons.length}</span>
        </div>
      </div>

      {/* RENDER BODY LAYER CONDITIONAL ASSIGNMENT */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-card rounded-2xl border border-border transition-colors duration-200">
          <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-muted font-bold tracking-wide mt-3 uppercase">Assembling localized workspace records...</p>
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="text-center py-24 bg-card border border-border rounded-2xl shadow-sm transition-colors duration-200">
          <div className="w-12 h-12 text-muted/40 mx-auto mb-3 flex items-center justify-center bg-surface rounded-full">
            <FiEdit3 className="w-5 h-5 text-muted" />
          </div>
          <h3 className="text-sm font-bold text-foreground">No dynamic records located</h3>
          <p className="text-xs text-muted mt-1 max-w-xs mx-auto px-4">
            You haven&apos;t added any lesson material configurations into our cloud platform registers yet.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden transition-colors duration-200">
          
          {/* DESKTOP TABULAR INTERACTIVE RUNTIME COMPONENT */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border text-[10px] font-extrabold uppercase tracking-wider text-muted select-none transition-colors duration-200">
                  <th className="p-4 pl-6">Course Material Header Info</th>
                  <th className="p-4 text-center">Visibility Matrix</th>
                  <th className="p-4 text-center">Access Pricing Tier</th>
                  <th className="p-4 text-center">Performance Stats</th>
                  <th className="p-4 pr-6 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs font-medium text-foreground transition-colors duration-200">
                {filteredLessons.map((lesson) => {
                  const isPublic = lesson.visibility === "Public" || lesson.isPublic === true;
                  const isPremiumTier = lesson.accessLevel === "Premium" || lesson.isPremium === true;
                  const parsedDate = lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" }) : "Recently Added";

                  return (
                    <tr key={lesson._id} className="hover:bg-surface/30 transition-colors duration-150">
                      <td className="p-4 pl-6 max-w-sm">
                        <span className="text-[10px] font-bold text-primary tracking-wide block mb-0.5 capitalize">{lesson.category || "General Content"}</span>
                        <div className="font-medium text-sm text-foreground truncate" title={lesson.title}>{lesson.title}</div>
                        <div className="flex items-center gap-1 text-[10px] text-muted mt-1">
                          <FiCalendar /> Released: {parsedDate}
                        </div>
                      </td>
                      
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleVisibility(lesson._id, lesson.visibility || "Private")}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all active:scale-95 ${
                            isPublic 
                              ? "bg-success/5 border-success/10 text-success hover:bg-success/10" 
                              : "bg-muted/5 border-border text-muted hover:bg-muted/10"
                          }`}
                          aria-label={`Toggle visibility state for ${lesson.title}`}
                        >
                          {isPublic ? <FiEye className="w-3.5 h-3.5" /> : <FiEyeOff className="w-3.5 h-3.5" />}
                          {isPublic ? "Public" : "Private"}
                        </button>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleAccessLevel(lesson._id, lesson.accessLevel || "Free")}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all active:scale-95 relative ${
                            isPremiumTier 
                              ? "bg-secondary/5 border-secondary/10 text-secondary hover:bg-secondary/10" 
                              : "bg-background border-border text-foreground hover:bg-surface"
                          }`}
                          aria-label={`Toggle pricing parameter locks for ${lesson.title}`}
                        >
                          {isPremiumTier ? <FiLock className="w-3.5 h-3.5" /> : <FiUnlock className="w-3.5 h-3.5" />}
                          {isPremiumTier ? "Premium" : "Free"}
                          {!session?.user?.isPremium && (
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3 text-muted text-[11px] font-bold">
                          <span className="flex items-center gap-1 text-foreground" title="Reactions Counter metrics">
                            <FiHeart className="text-primary shrink-0" /> {lesson.reactionsCount || lesson.likes || 0}
                          </span>
                          <span className="flex items-center gap-1 text-foreground" title="Total User Saves Counter metrics">
                            <FiBookmark className="text-secondary shrink-0" /> {lesson.savesCount || lesson.favorites || 0}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/lessons/${lesson._id}`)}
                            className="p-2 bg-background border border-border hover:border-border-hover rounded-xl text-foreground transition-colors active:scale-95"
                            title="Inspect live user presentation interface views"
                          >
                            <FiGlobe className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/my-lessons/edit/${lesson._id}`)}
                            className="p-2 bg-background border border-border hover:border-border-hover rounded-xl text-foreground transition-colors active:scale-95"
                            title="Adjust metadata schemas configurations"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, lesson })}
                            className="p-2 bg-background border border-transparent hover:bg-red-500/10 rounded-xl text-red-500 transition-colors active:scale-95"
                            title="Purge asset index registry completely"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TABLET & MOBILE VIEWPORT CARD GRID COMPONENT */}
          <div className="grid grid-cols-1 divide-y divide-border md:hidden transition-colors duration-200">
            {filteredLessons.map((lesson) => {
              const isPublic = lesson.visibility === "Public" || lesson.isPublic === true;
              const isPremiumTier = lesson.accessLevel === "Premium" || lesson.isPremium === true;
              return (
                <div key={lesson._id} className="p-4 flex flex-col gap-3 hover:bg-surface/10 transition-colors duration-150">
                  <div>
                    <span className="text-[9px] font-bold text-primary tracking-widest block capitalize">{lesson.category || "General Asset"}</span>
                    <h4 className="font-bold text-foreground text-sm line-clamp-2 leading-tight mt-0.5">{lesson.title}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleToggleVisibility(lesson._id, lesson.visibility || "Private")}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold active:scale-98 ${
                        isPublic ? "bg-success/5 border-success/10 text-success" : "bg-muted/5 border-border text-muted"
                      }`}
                    >
                      {isPublic ? <FiEye /> : <FiEyeOff />} {isPublic ? "Public" : "Private"}
                    </button>
                    <button
                      onClick={() => handleToggleAccessLevel(lesson._id, lesson.accessLevel || "Free")}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold active:scale-98 relative ${
                        isPremiumTier ? "bg-secondary/5 border-secondary/10 text-secondary" : "bg-background border-border text-foreground"
                      }`}
                    >
                      {isPremiumTier ? <FiLock /> : <FiUnlock />} {isPremiumTier ? "Premium" : "Free"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3 mt-1 transition-colors duration-200">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-muted">
                      <span className="flex items-center gap-1 text-foreground"><FiHeart className="text-primary" /> {lesson.reactionsCount || 0}</span>
                      <span className="flex items-center gap-1 text-foreground"><FiBookmark className="text-secondary" /> {lesson.savesCount || 0}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => router.push(`/lessons/${lesson._id}`)}
                        className="p-2 bg-background border border-border rounded-lg text-foreground"
                      >
                        <FiGlobe className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/my-lessons/edit/${lesson._id}`)}
                        className="p-2 bg-background border border-border rounded-lg text-foreground"
                      >
                        <FiEdit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, lesson })}
                        className="p-2 bg-background border border-transparent text-red-500"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* DELETION CONFIRMATION PORTAL BACKDROP */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="bg-card w-full max-w-sm border border-border p-5 rounded-2xl shadow-2xl text-foreground transition-colors duration-200"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title-deletion"
            >
              <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
                <FiTrash2 className="w-5 h-5 shrink-0" />
                <h3 id="modal-title-deletion" className="text-base tracking-tight">Confirm Permanent Deletion</h3>
              </div>
              
              <p className="text-xs text-muted leading-relaxed mb-4">
                Are you absolutely certain you wish to completely delete <strong className="text-foreground">{deleteModal.lesson?.title}</strong>? This operation clears the file registry indexes and cannot be undone.
              </p>

              <div className="flex justify-end gap-2 border-t border-border pt-3.5 transition-colors duration-200">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, lesson: null })}
                  disabled={actionProcessing}
                  className="px-3.5 py-2 bg-surface hover:bg-border border border-border font-bold text-xs rounded-xl transition-all text-foreground active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteExecute}
                  disabled={actionProcessing}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 font-bold text-xs rounded-xl text-white transition-all active:scale-95 disabled:opacity-50"
                >
                  {actionProcessing ? "Dropping records..." : "Delete Permanently"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}