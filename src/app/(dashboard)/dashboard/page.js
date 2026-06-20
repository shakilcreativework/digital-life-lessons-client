"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardHomePage({ sessionData = null }) {
  // 1. Fallback Session Data Structure if context provider layer is absent
  const activeUser = sessionData || {
    name: "Shakil Ahmed",
    email: "shakil@creativework.com",
    role: "admin", // Change between 'user' and 'admin' to toggle live dashboard layouts instantly
    isPremium: true,
    stats: {
      user: { created: 14, saved: 32, weeklyReflections: [4, 2, 7, 5, 9, 6, 8] },
      admin: { totalUsers: 1240, publicLessons: 3840, reportedLessons: 12, newToday: 45 }
    }
  };

  const isAdmin = activeUser.role === "admin";

  // Mock array mapping recent activity items
  const recentLessonsSample = [
    { id: "1", title: "Embracing Mistakes in Production Code", category: "Mistakes Learned", date: "2 hours ago", status: "Public" },
    { id: "2", title: "Designing the Perfect Architecture with Pure CSS", category: "Career", date: "Yesterday", status: "Premium" },
    { id: "3", title: "The Fine Line Between Hustle and Burnout", category: "Mindset", date: "3 days ago", status: "Private" }
  ];

  return (
    <div className="space-y-8 text-foreground transition-colors duration-300">
      
      {/* ─── REGION A: DYNAMIC GREETING & ROLE IDENTIFIER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6 transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Hello, {activeUser.name}
            </h1>
            {activeUser.isPremium && !isAdmin && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                Premium Author ⭐
              </span>
            )}
            {isAdmin && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Platform Administrator 👑
              </span>
            )}
          </div>
          <p className="text-sm text-muted mt-1">
            {isAdmin 
              ? "Platform engine diagnostics and community moderation tracking node dashboard."
              : "Capture your thoughts, review your milestones, and manage your digital life lessons repository."}
          </p>
        </div>

        {/* Quick Action Trigger Button Shortcuts */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={isAdmin ? "/dashboard/admin/manage-lessons" : "/dashboard/add-lesson"}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide text-white transition-all duration-200 shadow-sm active:scale-[0.98] ${
              isAdmin ? "bg-secondary hover:bg-secondary/90" : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isAdmin ? "Moderate Lessons 📝" : "Write New Lesson ✍️"}
          </Link>
        </div>
      </div>

      {/* ─── REGION B: CORE METRICS MATRIX ─── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" aria-label="Statistical Indicators Overview">
        {isAdmin ? (
          <>
            {/* Admin Metric 1 */}
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm transition-colors duration-300">
              <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Total Platform Users</div>
              <div className="text-3xl font-black text-foreground">{activeUser.stats.admin.totalUsers}</div>
              <div className="text-xs font-medium text-success mt-2">↑ 12% growth this cycle</div>
            </div>
            {/* Admin Metric 2 */}
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm transition-colors duration-300">
              <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Public Lessons Live</div>
              <div className="text-3xl font-black text-foreground">{activeUser.stats.admin.publicLessons}</div>
              <div className="text-xs font-medium text-muted mt-2">Active shared chapters</div>
            </div>
            {/* Admin Metric 3 */}
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm transition-colors duration-300">
              <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Flagged Report Incidents</div>
              <div className="text-3xl font-black text-secondary">{activeUser.stats.admin.reportedLessons}</div>
              <div className="text-xs font-medium text-secondary mt-2">Requires prompt moderation reviews</div>
            </div>
            {/* Admin Metric 4 */}
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm transition-colors duration-300">
              <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Published Today</div>
              <div className="text-3xl font-black text-foreground">{activeUser.stats.admin.newToday}</div>
              <div className="text-xs font-medium text-success mt-2">New additions incoming</div>
            </div>
          </>
        ) : (
          <>
            {/* User Metric 1 */}
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm lg:col-span-2 transition-colors duration-300">
              <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Total Lessons Penned</div>
              <div className="text-4xl font-black text-primary">{activeUser.stats.user.created}</div>
              <p className="text-xs text-muted mt-2">Your recorded insights and personal learning benchmarks.</p>
            </div>
            {/* User Metric 2 */}
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm lg:col-span-2 transition-colors duration-300">
              <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Saved Favorites Chapter Index</div>
              <div className="text-4xl font-black text-foreground">{activeUser.stats.user.saved}</div>
              <p className="text-xs text-muted mt-2">Bookmarked wisdom pieces compiled from other platform creators.</p>
            </div>
          </>
        )}
      </section>

      {/* ─── REGION C: DATA VISUALIZATION SPLIT CANVAS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Native CSS High-Performance Vector Analytics Chart */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm lg:col-span-2 flex flex-col justify-between transition-colors duration-300">
          <div>
            <h3 className="text-base font-bold text-foreground">
              {isAdmin ? "Platform Activity Trajectory" : "Weekly Contribution Reflections"}
            </h3>
            <p className="text-xs text-muted mt-0.5">Calculated operational activity metrics across current tracking nodes.</p>
          </div>

          {/* Core SVG Performance Chart Vector Interface Layout */}
          <div className="h-48 w-full mt-6 flex items-end gap-3 px-2 border-b border-l border-border/60 pb-1">
            {(isAdmin ? [35, 55, 42, 70, 64, 85, 92] : activeUser.stats.user.weeklyReflections).map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                {/* Pop-over data visual layout tooltip box */}
                <span className="text-[10px] font-mono bg-surface border border-border px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute transform -translate-y-12 shadow-sm text-foreground">
                  {val}
                </span>
                {/* Data Column Bar Graph Item */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
                  className={`w-full rounded-t-md transition-colors duration-200 group-hover:brightness-110 ${
                    isAdmin ? "bg-secondary/70" : "bg-primary/70"
                  }`}
                />
                <span className="text-[10px] font-medium text-muted tracking-wide">M{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Lists Dashboard Context Activity Panel */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col justify-between transition-colors duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">
                {isAdmin ? "System Security Flags" : "Your Recent Chapters"}
              </h3>
              <Link 
                href={isAdmin ? "/dashboard/admin/reported-lessons" : "/dashboard/my-lessons"} 
                className={`text-xs font-bold hover:underline ${isAdmin ? "text-secondary" : "text-primary"}`}
              >
                View All
              </Link>
            </div>

            {/* List Row Output Context Frame */}
            <div className="space-y-3">
              {recentLessonsSample.map((lesson) => (
                <div 
                  key={lesson.id} 
                  className="p-3 border border-border/50 bg-surface/40 hover:bg-surface/80 rounded-xl transition-colors duration-150 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{lesson.title}</p>
                    <span className="text-muted text-[11px] block mt-0.5">{lesson.category} • {lesson.date}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md font-semibold tracking-wide text-[10px] uppercase border ${
                    lesson.status === "Premium" 
                      ? "bg-secondary/10 text-secondary border-secondary/20" 
                      : lesson.status === "Public"
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-muted/10 text-muted border-border"
                  }`}>
                    {lesson.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 text-[11px] text-muted text-center transition-colors duration-300">
            System status operational: Sync complete with cluster node databases.
          </div>
        </div>

      </div>

    </div>
  );
}