"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const USER_NAV_ITEMS = [
  { name: "Overview", path: "/dashboard", icon: "📊" },
  { name: "Add Lesson", path: "/dashboard/add-lesson", icon: "✍️" },
  { name: "My Lessons", path: "/dashboard/my-lessons", icon: "📚" },
  { name: "My Favorites", path: "/dashboard/my-favorites", icon: "🔖" },
  { name: "My Profile", path: "/dashboard/profile", icon: "👤" },
];

const ADMIN_NAV_ITEMS = [
  { name: "Admin Home", path: "/dashboard/admin", icon: "👑" },
  { name: "Manage Users", path: "/dashboard/admin/manage-users", icon: "👥" },
  { name: "Manage Lessons", path: "/dashboard/admin/manage-lessons", icon: "📝" },
  { name: "Reported Content", path: "/dashboard/admin/reported-lessons", icon: "🚩" },
  { name: "Admin Profile", path: "/dashboard/admin/profile", icon: "⚙️" },
];

export default function DashboardLayout({ children }) {
  // 1. EXTRACT isPending TO IDENTIFY ASYNC FETCHING WINDOWS
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeUser = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        role: session.user.role, 
        isPremium: session.user.isPremium, 
        photoURL: session.user.image, 
      }
    : null;

  const isAdmin = activeUser?.role === "admin";
  const targetNavigationList = isAdmin ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  const isTargetingAdminRoute = pathname.startsWith("/dashboard/admin");
  const isAccessDenied = isTargetingAdminRoute && !isAdmin;

  // 2. CRITICAL FIX: IF THE AUTH IS STILL LOADING, RETURN A LOADING STATE 
  // This prevents the security guard below from checking empty data prematurely!
  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-xs text-muted/60 animate-pulse font-medium tracking-widest uppercase">
          Verifying Workspace Security Core...
        </div>
      </div>
    );
  }

  // 3. SECURE BLOCKER (Only evaluates after session loading is complete)
  if (isAccessDenied) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 text-center">
        <div className="max-w-md w-full space-y-4 p-6 bg-card border border-border/60 rounded-2xl shadow-xs">
          <div className="text-2xl">🚨</div>
          <h2 className="text-base font-bold text-foreground">Access Level Violation</h2>
          <p className="text-xs text-muted">
            This workspace module is restricted to administrators. Your current account privileges do not allow entry.
          </p>
          <Link href="/dashboard" className="inline-block text-xs font-bold px-4 py-2 bg-primary text-white rounded-xl">
            Return to Workspace Home
          </Link>
        </div>
      </div>
    );
  }

  const renderSidebarContent = () => (
    <div
      suppressHydrationWarning
      className="flex flex-col h-full bg-card/95 backdrop-blur-md border-r border-border/60 text-foreground transition-all duration-300"
    >
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-lg font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent tracking-wider">
            DIGITAL LIFE
          </span>
        </Link>
      </div>

      <nav
        className="flex-1 py-6 px-4 space-y-1 overflow-y-auto scrollbar-none"
        aria-label="Dashboard Layout Main Sub-navigation"
      >
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted/80 px-3 mb-3 block">
          {isAdmin ? "Admin Controls" : "User Workspace"}
        </div>

        {targetNavigationList.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs tracking-wide transition-all duration-200 group relative ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted hover:bg-surface/60 hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSideNavFrameStroke"
                  className="absolute left-0 w-1 h-5 rounded-r-md bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="text-base shrink-0" aria-hidden="true">
                {item.icon}
              </span>
              <span className="flex-1 truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50 bg-surface/30 space-y-3 mt-auto">
        <div className="flex items-center gap-3 p-1">
          <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            {activeUser?.photoURL ? (
              <Image
                width={36}
                height={36}
                priority
                src={activeUser.photoURL}
                alt={activeUser.name || "User Photo"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-muted">
                {activeUser?.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-medium text-foreground truncate">
                {activeUser?.name || "Anonymous Workspace"}
              </p>
              {activeUser?.isPremium && !isAdmin && (
                <span className="text-[9px] px-1.5 py-0.2 font-black tracking-wide rounded-md bg-secondary/10 text-secondary border border-secondary/20 shrink-0">
                  PRO
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted truncate">
              {activeUser?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row antialiased selection:bg-primary/20">
      <header className="lg:hidden w-full h-14 bg-card/80 backdrop-blur-md border-b border-border/50 px-4 flex items-center justify-between sticky top-0 z-40">
        <Link
          href="/"
          className="font-black text-xs tracking-wider bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          DIGITAL LIFE
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 border border-border/60 rounded-xl bg-surface text-foreground transition-all duration-200 active:scale-95 cursor-pointer"
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden shadow-2xl h-full"
            >
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* FIXED HERE: Removed 'sticky top-0 h-screen' and made it self-stretch inside the flex row container */}
      <aside className="hidden lg:block w-60 shrink-0 self-stretch z-30">
        {renderSidebarContent()}
      </aside>

      <main className="flex-1 w-full min-w-0 bg-background overflow-x-hidden min-h-[calc(100vh-56px)] lg:min-h-screen">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="px-4 sm:px-6 lg:px-8 py-14 md:py-16 lg:py-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}