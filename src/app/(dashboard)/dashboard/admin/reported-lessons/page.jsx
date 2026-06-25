"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiAlertTriangle,
    FiTrash2,
    FiCheck,
    FiEye,
    FiX,
    FiSearch,
    FiFlag,
    FiUser,
    FiInfo
} from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ReportedLessonsPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    // Protect against client/server hydration markup mismatches
    const isMounted = React.useSyncExternalStore(
        () => () => { },
        () => true,
        () => false
    );

    // Component Data & UI Control States
    const [reportedLessons, setReportedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal Control States
    const [detailsModal, setDetailsModal] = useState({ isOpen: false, lesson: null });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, lesson: null });
    const [actionProcessing, setActionProcessing] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Fetch only lessons containing reports or active flags
    const fetchReportedLessons = useCallback(async () => {
        try {
            setLoading(true);

            // Connects directly to your new aggregated administration data stream
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/reported-lessons-summary`, {
                cache: "no-store",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error("Failed to load aggregated moderation records.");
            const data = await response.json();

            setReportedLessons(data); // Receives the cleanly mapped [ { _id, title, category, reportsCount, reports: [] } ] structure
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to sync structural moderation logs.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Security Access Route Controller
    useEffect(() => {
        if (isMounted && !isPending) {
            if (!session) {
                router.push("/login");
            } else if (session.user.role !== "admin") {
                toast.error("Access Denied. Administrative elevation required.");
                router.push("/dashboard");
            } else {
                queueMicrotask(() => {
                    fetchReportedLessons();
                });
            }
        }
    }, [session, isPending, isMounted, router, fetchReportedLessons]);

    // Action: Clear reports and keep content live (Ignore)
    const handleIgnoreReports = async (lessonId) => {
        try {
            setActionProcessing(true);
            const response = await fetch(`${API_URL}/api/admin/lessons/${lessonId}/reviewed`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error("Server rejected moderation ignore transaction.");

            toast.success("Reports cleared. Lesson marked as safe.");
            setConfirmModal({ isOpen: false, type: null, lesson: null });
            setDetailsModal({ isOpen: false, lesson: null });
            fetchReportedLessons();
        } catch (error) {
            toast.error(error.message || "Failed to update moderation state flags.");
        } finally {
            setActionProcessing(false);
        }
    };

    // Action: Purge inappropriate lesson completely (Delete)
    const handleDeleteLesson = async (lessonId) => {
        try {
            setActionProcessing(true);
            const response = await fetch(`${API_URL}/api/admin/lessons/${lessonId}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Server rejected resource destruction sequence.");

            toast.success("Lesson content permanently removed from platform.");
            setConfirmModal({ isOpen: false, type: null, lesson: null });
            setDetailsModal({ isOpen: false, lesson: null });
            fetchReportedLessons();
        } catch (error) {
            toast.error(error.message || "Failed to execute lesson purge request.");
        } finally {
            setActionProcessing(false);
        }
    };

    // Memoized search filter criteria handling
    const filteredLessons = useMemo(() => {
        if (!searchQuery.trim()) return reportedLessons;
        const cleanQuery = searchQuery.toLowerCase().trim();
        return reportedLessons.filter(lesson =>
            lesson.title?.toLowerCase().includes(cleanQuery) ||
            lesson.category?.toLowerCase().includes(cleanQuery)
        );
    }, [reportedLessons, searchQuery]);

    if (!isMounted || isPending || !session || session.user.role !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background text-foreground">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted mt-4 text-sm font-medium">Validating moderation dashboard clearance...</p>
            </div>
        );
    }

    return (
        <main className="pb-20">

            {/* HEADER SECTION */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    <FiAlertTriangle className="text-primary shrink-0" /> Reported Content
                </h1>
                <p className="text-muted text-sm mt-1">
                    Review user-flagged material, audit underlying violation reasons, and execute moderation actions.
                </p>
            </div>

            {/* SEARCH AND CONTROLS */}
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-96">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search reported lessons by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-secondary transition-colors"
                    />
                </div>
                <div className="ml-auto text-xs text-muted font-medium bg-surface px-3 py-1.5 rounded-lg border border-border">
                    Active Flags Pending Audit: <span className="text-foreground font-bold">{filteredLessons.length}</span>
                </div>
            </div>

            {/* MAIN DATA INTERFACE PANEL */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border">
                    <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted text-xs mt-3 font-medium">Analyzing system moderation indexes...</p>
                </div>
            ) : filteredLessons.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
                    <FiFlag className="w-12 h-12 text-success mx-auto mb-3 opacity-80" />
                    <h3 className="text-base font-bold text-foreground">Moderation queue completely clear</h3>
                    <p className="text-muted text-xs mt-1">No reported or flagged items found.</p>
                </div>
            ) : (
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    {/* DESKTOP TABULAR COMPONENT LAYER */}
                    <div className="overflow-x-auto hidden md:block">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted">
                                    <th className="p-4 pl-6">Lesson Title</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4 text-center">Report Count</th>
                                    <th className="p-4 text-center">Audit Actions</th>
                                    <th className="p-4 pr-6 text-right">Moderation Decisions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-sm">
                                {filteredLessons.map((lesson) => (
                                    <tr key={lesson._id} className="hover:bg-surface/40 transition-colors">
                                        <td className="p-4 pl-6 font-semibold text-foreground max-w-xs truncate" title={lesson.title}>
                                            {lesson.title}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs bg-background px-2.5 py-1 rounded-md font-medium border border-border capitalize">
                                                {lesson.category || "General"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-500/10 text-red-500 px-2.5 py-1 rounded-full border border-red-500/20">
                                                <FiFlag className="w-3 h-3" /> {lesson.reportsCount || (lesson.reports ? lesson.reports.length : 1)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => setDetailsModal({ isOpen: true, lesson })}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-background text-foreground border border-border hover:border-border-hover rounded-xl transition-all"
                                                aria-label="Open detailed report logs"
                                            >
                                                <FiEye className="w-3.5 h-3.5" /> View Reason Logs
                                            </button>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setConfirmModal({ isOpen: true, type: "ignore", lesson })}
                                                    className="p-2 text-success hover:bg-success/10 border border-transparent hover:border-success/20 rounded-xl transition-colors"
                                                    title="Ignore reports and keep item live"
                                                >
                                                    <FiCheck className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmModal({ isOpen: true, type: "delete", lesson })}
                                                    className="p-2 text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-colors"
                                                    title="Permanently remove lesson content"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE RESPONSIVE CARD SYSTEM LAYER */}
                    <div className="grid grid-cols-1 divide-y divide-border md:hidden">
                        {filteredLessons.map((lesson) => (
                            <div key={lesson._id} className="p-4 flex flex-col gap-3 hover:bg-surface/20 transition-colors">
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted block mb-0.5">{lesson.category || "General"}</span>
                                    <h4 className="font-bold text-foreground text-sm line-clamp-2">{lesson.title}</h4>
                                </div>

                                <div className="flex items-center justify-between bg-surface/50 p-2.5 rounded-xl border border-border">
                                    <span className="text-xs text-muted flex items-center gap-1">
                                        <FiFlag className="text-red-500" /> Active Reports:
                                    </span>
                                    <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                        {lesson.reportsCount || (lesson.reports ? lesson.reports.length : 1)}
                                    </span>
                                </div>

                                <div className="flex gap-2 w-full pt-1">
                                    <button
                                        onClick={() => setDetailsModal({ isOpen: true, lesson })}
                                        className="flex-1 py-2 bg-background border border-border hover:border-border-hover text-xs font-semibold rounded-xl text-foreground flex items-center justify-center gap-1.5"
                                    >
                                        <FiEye /> View Reasons
                                    </button>
                                    <button
                                        onClick={() => setConfirmModal({ isOpen: true, type: "ignore", lesson })}
                                        className="p-2 bg-success/10 border border-success/20 text-success rounded-xl hover:bg-success hover:text-white transition-all"
                                        title="Ignore"
                                    >
                                        <FiCheck />
                                    </button>
                                    <button
                                        onClick={() => setConfirmModal({ isOpen: true, type: "delete", lesson })}
                                        className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                        title="Delete Content"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MODAL WINDOW 1: COMPREHENSIVE REASON & REPORTER LOG DETAILS */}
            <AnimatePresence>
                {detailsModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-card w-full max-w-lg border border-border p-6 rounded-2xl shadow-xl text-foreground max-h-[80vh] flex flex-col justify-between"
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="flex items-center justify-between border-b border-border pb-3 mb-4 shrink-0">
                                <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
                                    <FiInfo className="text-secondary" /> Report Violation Audit logs
                                </h3>
                                <button
                                    onClick={() => setDetailsModal({ isOpen: false, lesson: null })}
                                    className="p-1.5 hover:bg-surface rounded-lg text-muted transition-colors"
                                    aria-label="Dismiss view dialog"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-1 my-2">
                                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Target Asset Entry</p>
                                <div className="p-3 bg-surface rounded-xl border border-border mb-4">
                                    <p className="text-sm font-bold text-foreground leading-snug">{detailsModal.lesson?.title}</p>
                                </div>

                                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Submitted Infraction Data Logs</p>
                                <div className="space-y-2.5">
                                    {detailsModal.lesson?.reports && detailsModal.lesson.reports.length > 0 ? (
                                        detailsModal.lesson.reports.map((report, index) => (
                                            <div key={index} className="p-3 bg-background rounded-xl border border-border flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 border-b border-border pb-1.5 mb-1 text-[11px] font-medium text-muted">
                                                    <FiUser className="shrink-0" />
                                                    <span>Reporter: <strong className="text-foreground">{report.reporterEmail || report.reporterName || "Platform User"}</strong></span>
                                                </div>
                                                <p className="text-xs text-foreground italic leading-relaxed">
                                                    {report.reason || "No written context summary log parameters submitted."}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 bg-background rounded-xl border border-border text-center">
                                            <p className="text-xs text-muted italic">
                                                {detailsModal.lesson?.reportReason || "Flagged via quick moderation dashboard marker."}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 mt-6 border-t border-border pt-4 shrink-0">
                                <button
                                    onClick={() => setConfirmModal({ isOpen: true, type: "ignore", lesson: detailsModal.lesson })}
                                    className="px-3.5 py-2 bg-success/10 border border-success/20 text-success font-semibold text-xs rounded-xl hover:bg-success hover:text-white transition-all flex items-center gap-1"
                                >
                                    <FiCheck /> Keep & Clear Reports
                                </button>
                                <button
                                    onClick={() => setConfirmModal({ isOpen: true, type: "delete", lesson: detailsModal.lesson })}
                                    className="px-3.5 py-2 bg-red-500/10 border border-red-200/20 text-red-500 font-semibold text-xs rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-1"
                                >
                                    <FiTrash2 /> Purge Content
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL WINDOW 2: ACTION CONFIRMATION SUB-PROMPT */}
            <AnimatePresence>
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-card w-full max-w-sm border border-border p-5 rounded-2xl shadow-2xl text-foreground"
                        >
                            <div className="flex items-center gap-2 text-base font-bold mb-2">
                                <FiAlertTriangle className={confirmModal.type === "delete" ? "text-red-500 animate-pulse" : "text-success"} />
                                <h3>{confirmModal.type === "delete" ? "Confirm Deletion Protocol" : "Confirm Clear Protocol"}</h3>
                            </div>

                            <p className="text-xs text-muted leading-relaxed mb-5">
                                {confirmModal.type === "delete"
                                    ? "Are you absolutely sure you want to permanently delete this content asset? This will clean it entirely from public feeds."
                                    : "Are you sure you want to dismiss all flagged reports for this lesson? This will clear the moderation queue and retain the asset as active."
                                }
                            </p>

                            <div className="flex justify-end gap-2 border-t border-border pt-3.5">
                                <button
                                    onClick={() => setConfirmModal({ isOpen: false, type: null, lesson: null })}
                                    disabled={actionProcessing}
                                    className="px-3.5 py-2 bg-surface hover:bg-border-hover font-semibold text-xs rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => confirmModal.type === "delete" ? handleDeleteLesson(confirmModal.lesson?._id) : handleIgnoreReports(confirmModal.lesson?._id)}
                                    disabled={actionProcessing}
                                    className={`px-4 py-2 font-bold text-xs rounded-xl text-white transition-colors ${confirmModal.type === "delete" ? "bg-red-500 hover:bg-red-600" : "bg-success hover:bg-success-hover"
                                        }`}
                                >
                                    {actionProcessing ? "Processing..." : "Confirm Action"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}