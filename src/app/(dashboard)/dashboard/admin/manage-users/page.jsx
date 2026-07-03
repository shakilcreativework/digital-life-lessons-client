"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiSearch,
    FiShield,
    FiTrash2,
    FiUserCheck,
    FiAlertTriangle,
    FiX,
    FiChevronLeft,
    FiChevronRight,
    FiLock,
    FiBookOpen
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import LoadingData from "@/components/ui/LoadingData";

export default function ManageUserPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    // Lifecycle & Data States
    // const [isMounted, setIsMounted] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modal Control States
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, targetUser: null });
    const [roleModal, setRoleModal] = useState({ isOpen: false, targetUser: null, newRole: "" });
    const [actionProcessing, setActionProcessing] = useState(false);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Prevent server/client markup hydration mismatch anomalies
    const isMounted = React.useSyncExternalStore(
        () => () => { },
        () => true,
        () => false
    );

    // Fetch Platform Users Database Array
    const fetchUsersData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/api/users`, {
                cache: "no-store",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error("Failed to capture platform account logs.");
            }
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Fetch Accounts Error:", error);
            toast.error("Failed loading platform user ledger from Express API.");
        } finally {
            setLoading(false);
        }
    }, [BASE_URL]);

    // Route Authentication Safety Gate Controller
    // FIXED OPTIMIZED PATTERN 🚀
    useEffect(() => {
        if (isMounted && !isPending) {
            if (!session) {
                router.push("/login");
            } else if (session.user.role !== "admin") {
                toast.error("Access Forbidden. Administrative permission required.");
                router.push("/dashboard");
            } else {
                // Defer the state updates to the next microtask queue tick
                queueMicrotask(() => {
                    fetchUsersData();
                });
            }
        }
    }, [session, isPending, isMounted, router, fetchUsersData]);

    // Process User Account Promotion / Role Alteration
    const handleRoleUpdate = async () => {
        if (!roleModal.targetUser) return;
        try {
            setActionProcessing(true);
            const response = await fetch(`${BASE_URL}/api/users/${roleModal.targetUser._id}/role`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: roleModal.newRole })
            });

            if (!response.ok) throw new Error("Could not update account access permissions.");

            toast.success(`Account designated as ${roleModal.newRole} successfully.`);
            setRoleModal({ isOpen: false, targetUser: null, newRole: "" });
            fetchUsersData();
        } catch (error) {
            toast.error(error.message || "Failed to update role state.");
        } finally {
            setActionProcessing(false);
        }
    };

    // Process User Account Deletion Permanent Destruction
    const handleDeleteUser = async () => {
        if (!deleteModal.targetUser) return;
        try {
            setActionProcessing(true);
            const response = await fetch(`${BASE_URL}/api/users/${deleteModal.targetUser._id}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Account destruction sequence failed.");

            toast.success("Account permanently removed from platform records.");
            setDeleteModal({ isOpen: false, targetUser: null });
            fetchUsersData();
        } catch (error) {
            toast.error(error.message || "Failed to destroy target user record.");
        } finally {
            setActionProcessing(false);
        }
    };

    // FIXED SEARCH ENGINE QUERY EVALUATION FUNCTION
    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;

        const cleanQuery = searchQuery.toLowerCase().trim();
        return users.filter((user) => {
            const nameMatch = user.name ? user.name.toLowerCase().includes(cleanQuery) : false;
            const emailMatch = user.email ? user.email.toLowerCase().includes(cleanQuery) : false;
            return nameMatch || emailMatch;
        });
    }, [users, searchQuery]);

    // Paginated user computation slice
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

    if (!isMounted || isPending || !session || session.user.role !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background text-foreground">
                <LoadingData text="Validating administrative clearances..." />
            </div>
        );
    }

    return (
        <main>
            {/* SECTION HEADER AREA */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <FiShield className="text-primary shrink-0" /> Manage Accounts
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        Audit system access levels, promote administrative configurations, and manage user profile records.
                    </p>
                </div>
                <div className="bg-card px-4 py-2 rounded-xl border border-border shadow-sm text-center md:text-right">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Total Users Active</span>
                    <span className="text-2xl font-bold text-foreground">{users.length}</span>
                </div>
            </div>

            {/* SEARCH AND FILTERING PANEL ACTION BAR */}
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search accounts by name or email address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-secondary transition-colors"
                        aria-label="Search user accounts"
                    />
                </div>
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 self-start md:self-auto"
                    >
                        Clear Filters
                    </button>
                )}
                <div className="text-xs text-muted md:ml-auto w-full md:w-auto text-left md:text-right">
                    Showing {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} records found
                </div>
            </div>

            {/* MAIN DATA LEDGER TABLE CONTAINER */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <LoadingData text="Compiling real-time table configurations..." />
                    </div>
                ) : paginatedUsers.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <FiSearch className="w-12 h-12 text-muted mx-auto mb-3" />
                        <h3 className="text-base font-bold text-foreground">No corresponding accounts match your query</h3>
                        <p className="text-muted text-xs mt-1 max-w-sm mx-auto">
                            Verify your structural spellings or character spacing bounds and attempt filter testing again.
                        </p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface border-b border-border text-foreground text-xs font-bold uppercase tracking-wider">
                                    <th className="py-4 px-6">Identified Profile</th>
                                    <th className="py-4 px-6">Email Coordinate</th>
                                    <th className="py-4 px-6">Current Designation</th>
                                    <th className="py-4 px-6 text-center">Lessons Published</th>
                                    <th className="py-4 px-6 text-right">Moderation Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-sm text-foreground">
                                <AnimatePresence mode="popLayout">
                                    {paginatedUsers.map((user) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -4 }}
                                            transition={{ duration: 0.18 }}
                                            className="hover:bg-surface transition-colors"
                                        >
                                            {/* PROFILE DATA IDENTIFICATION COL */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    {user.image ? (
                                                        <div className="relative w-9 h-9 shrink-0">
                                                            <Image
                                                                src={user.image}
                                                                alt={`${user.name || "User"}'s profile avatar`}
                                                                width={36}
                                                                height={36}
                                                                className="rounded-full object-cover border border-border"
                                                                unoptimized
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center shrink-0 text-xs">
                                                            {user.name ? user.name.substring(0, 2).toUpperCase() : "US"}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-semibold text-nowrap text-foreground flex items-center gap-2">
                                                            {user.name || "Anonymous Platform User"}
                                                            {user.isPremium && (
                                                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-bold tracking-wide uppercase">
                                                                    Premium ⭐
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted font-mono max-w-35 truncate">
                                                            ID: {user._id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* EMAIL COORDINATE COL */}
                                            <td className="text-sm text-muted">
                                                {user.email}
                                            </td>

                                            {/* ROLE DESIGNATION LEVEL COL */}
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex text-nowrap items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${user.role === "admin"
                                                    ? "bg-secondary/10 text-secondary"
                                                    : "bg-muted/10 text-muted"
                                                    }`}>
                                                    <FiShield className="w-3 h-3" />
                                                    {user.role === "admin" ? "Administrator" : "Standard User"}
                                                </span>
                                            </td>

                                            {/* TOTAL LESSON COUNTS INDEX COL */}
                                            <td className="py-4 px-6 text-center font-semibold text-foreground">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <FiBookOpen className="text-muted w-3.5 h-3.5" />
                                                    {user.totalLessons || 0}
                                                </div>
                                            </td>

                                            {/* ACTION PANEL MUTATION TRIGGERS */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {user.role !== "admin" ? (
                                                        <button
                                                            onClick={() => setRoleModal({ isOpen: true, targetUser: user, newRole: "admin" })}
                                                            className="p-2 bg-surface text-foreground hover:bg-border-hover border border-border rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                                                            aria-label={`Promote ${user.name || 'user'} to admin.`}
                                                        >
                                                            <FiUserCheck className="w-3.5 h-3.5 text-success" /> Promote
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setRoleModal({ isOpen: true, targetUser: user, newRole: "user" })}
                                                            disabled={user._id === session.user.id}
                                                            className={`p-2 bg-surface border border-border rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${user._id === session.user.id
                                                                ? "opacity-40 cursor-not-allowed text-muted"
                                                                : "hover:bg-border-hover text-foreground"
                                                                }`}
                                                            aria-label={`Demote ${user.name || 'user'}`}
                                                        >
                                                            <FiLock className="w-3.5 h-3.5" /> Demote
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setDeleteModal({ isOpen: true, targetUser: user })}
                                                        disabled={user._id === session.user.id}
                                                        className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${user._id === session.user.id
                                                            ? "opacity-40 cursor-not-allowed bg-surface text-muted border-border"
                                                            : "bg-red-50/40 dark:bg-red-950/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/30"
                                                            }`}
                                                        aria-label={`Delete account ${user.name || ''}`}
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
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

                {/* COMPONENT PAGINATION FOOTER CONTROL BAR */}
                {!loading && filteredUsers.length > itemsPerPage && (
                    <div className="p-4 bg-surface border-t border-border flex items-center justify-between gap-4">
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
            </div>

            {/* 1. ROLE MODERATION CONFIRMATION DIALOG MODAL FRAME */}
            <AnimatePresence>
                {roleModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-card w-full max-w-md border border-border p-6 rounded-2xl shadow-xl text-foreground"
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                                <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
                                    <FiAlertTriangle className="text-secondary w-5 h-5" /> Alter Account Authorisation
                                </h3>
                                <button
                                    onClick={() => setRoleModal({ isOpen: false, targetUser: null, newRole: "" })}
                                    className="p-1.5 hover:bg-surface rounded-lg text-muted transition-colors"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-sm text-muted leading-relaxed">
                                Are you absolutely sure you want to alter permissions for{" "}
                                <span className="font-bold text-foreground">
                                    {roleModal.targetUser?.name || "this account profile"}
                                </span>{" "}
                                to status level <span className="text-secondary font-bold uppercase">[{roleModal.newRole}]</span>?
                            </p>
                            <div className="flex items-center justify-end gap-3 mt-6 border-t border-border pt-4">
                                <button
                                    onClick={() => setRoleModal({ isOpen: false, targetUser: null, newRole: "" })}
                                    disabled={actionProcessing}
                                    className="px-4 py-2 bg-surface hover:bg-border-hover text-foreground font-medium text-xs rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRoleUpdate}
                                    disabled={actionProcessing}
                                    className="px-4 py-2 bg-secondary text-white font-semibold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5"
                                >
                                    {actionProcessing ? "Updating..." : "Confirm Elevation"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 2. ACCOUNT DELETION PERMANENT DESTRUCTION MODAL FRAME */}
            <AnimatePresence>
                {deleteModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-card w-full max-w-md border border-red-100 dark:border-red-900/30 p-6 rounded-2xl shadow-xl text-foreground"
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                                <h3 className="text-base font-bold flex items-center gap-2 text-red-500">
                                    <FiAlertTriangle className="w-5 h-5" /> Permanent Account Purge
                                </h3>
                                <button
                                    onClick={() => setDeleteModal({ isOpen: false, targetUser: null })}
                                    className="p-1.5 hover:bg-surface rounded-lg text-muted transition-colors"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-sm text-muted leading-relaxed">
                                You are about to delete the user account belonging to{" "}
                                <span className="font-bold text-foreground">
                                    {deleteModal.targetUser?.name || deleteModal.targetUser?.email}
                                </span>. This action cannot be undone.
                            </p>
                            <div className="flex items-center justify-end gap-3 mt-6 border-t border-border pt-4">
                                <button
                                    onClick={() => setDeleteModal({ isOpen: false, targetUser: null })}
                                    disabled={actionProcessing}
                                    className="px-4 py-2 bg-surface hover:bg-border-hover text-foreground font-medium text-xs rounded-xl transition-colors"
                                >
                                    Abort Action
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    disabled={actionProcessing}
                                    className="px-4 py-2 bg-red-500 text-white font-semibold text-xs rounded-xl hover:bg-red-600 transition-colors"
                                >
                                    {actionProcessing ? "Destroying..." : "Permanently Purge Account"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}