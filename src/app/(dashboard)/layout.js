"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// 1. Navigation Schema Matrices
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

export default function DashboardLayout({ children, userSession = null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fallback state configuration if framework context is absent
  const activeUser = userSession || {
    name: "Shakil Ahmed",
    email: "shakil@creativework.com",
    role: "admin", // Toggle 'user' or 'admin' to dynamically re-map layout parameters
    isPremium: true,
    photoURL: ""
  };

  const isAdmin = activeUser.role === "admin";
  const targetNavigationList = isAdmin ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  const handleLogout = () => {
    console.log("Terminating user active session mapping tokens...");
    router.push("/login");
  };

  // ✅ CHANGED: Turned into a standard function returning JSX instead of a nested React component
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border text-foreground transition-colors duration-300">
      
      {/* Platform Identity Branding */}
      <div className="p-6 border-b border-border flex items-center justify-between transition-colors duration-300">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
            DIGITAL LIFE LESSONS
          </span>
        </Link>
      </div>

      {/* Primary Dynamic Navigation Anchors List */}
      <nav className="flex-1 py-6 px-4 space-y-1.5" aria-label="Dashboard Navigation">
        <div className="text-xs font-bold uppercase tracking-widest text-muted px-3 mb-3 block">
          {isAdmin ? "Admin Controls" : "User Workspace"}
        </div>
        
        {targetNavigationList.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 group relative ${
                isActive
                  ? "bg-surface text-primary border border-border"
                  : "text-muted hover:bg-surface/50 hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-2 w-1 h-5 rounded-full bg-secondary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="text-base" aria-hidden="true">{item.icon}</span>
              <span className="flex-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Authenticated Identity Banner Block */}
      <div className="p-4 border-t border-border bg-surface/40 space-y-3 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden shrink-0 transition-colors duration-300">
            {activeUser.photoURL ? (
              <Image width={100} height={100} priority src={activeUser.photoURL} alt={activeUser.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-muted">{activeUser.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-foreground truncate">{activeUser.name}</p>
              {activeUser.isPremium && (
                <span className="text-[10px] px-1.5 py-0.5 font-extrabold tracking-wide uppercase rounded bg-secondary/10 text-secondary border border-secondary/20 shrink-0">
                  ⭐ Premium
                </span>
              )}
            </div>
            <p className="text-xs text-muted truncate">{activeUser.email}</p>
          </div>
        </div>

        {/* Global Exit Integration Endpoint Trigger */}
        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:text-primary font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M19.5 12l-3-3m3 3-3 3m3-3H9" />
          </svg>
          Sign Out Channel
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row transition-colors duration-300">
      
      {/* 🚨 MOBILE VIEW HEADER CORE */}
      <header className="lg:hidden w-full h-16 bg-card border-b border-border px-4 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
        <Link href="/" className="font-black text-sm tracking-tight bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          DIGITAL LIFE LESSONS
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 border border-border rounded-lg bg-surface text-foreground hover:text-primary transition-colors cursor-pointer"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation interface drawer menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </header>

      {/* 📱 MOBILE DRAWERS SLIDE-OUT PANEL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden shadow-2xl"
            >
              {/* ✅ CHANGED: Called as a normal functional evaluation execution */}
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 🖥️ PERMANENT DESKTOP NAVIGATION PANEL ASIDE */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {/* ✅ CHANGED: Called as a normal functional evaluation execution */}
        {renderSidebarContent()}
      </aside>

      {/* 🎨 MAIN DISPLAY VIEW CANVAS AREA CONTAINER */}
      <main className="flex-1 w-full min-w-0 bg-background overflow-x-hidden min-h-[calc(100vh-64px)] lg:min-h-screen transition-colors duration-300">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full"
        >
          {children}
        </motion.div>
      </main>

    </div>
  );
}