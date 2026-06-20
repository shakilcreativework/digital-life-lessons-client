"use client";

import React from "react";
import Link from "next/link";
import { MdStar } from "react-icons/md";
import { FaCrown } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export default function DashboardHomePage() {
  const { data: session, isPending } = authClient.useSession();

  // Handle baseline fallback securely while the data hydration tree resolves
  if (isPending) {
    return <div className="w-full h-48 bg-card/40 animate-pulse rounded-2xl" />;
  }

  // Construct a safe active user dataset with absolute data values matching the requirements specifications
  const activeUser = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        isPremium: session.user.isPremium,
        stats: {
          user: {
            created: 14, // Total lessons created placeholder
            saved: 32,   // Total saved favorites placeholder
            weeklyReflections: [24, 45, 32, 76, 52, 84, 95],
          },
          admin: {
            totalUsers: 1240,
            publicLessons: 3840,
            reportedLessons: 12,
            newToday: 45,
          },
        },
      }
    : {
        name: "Guest Explorer",
        email: "",
        role: "user",
        isPremium: false,
        stats: {
          user: { created: 0, saved: 0, weeklyReflections: [0, 0, 0, 0, 0, 0, 0] },
          admin: { totalUsers: 0, publicLessons: 0, reportedLessons: 0, newToday: 0 },
        },
      };

  // Explicit type check to confirm strict authorization privileges
  const isAdmin = activeUser.role === "admin";
  
  const points = isAdmin
    ? [30, 45, 38, 70, 58, 88, 94] // Admin Platform Growth Trajectory Graph Array
    : activeUser.stats.user.weeklyReflections; // User Personal Reflections Graph Array

  // Generate smooth cubic bezier SVG continuous vector string path coordinates
  const width = 600;
  const height = 160;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxVal = Math.max(...points, 100);
  const coordinates = points.map((val, idx) => {
    const x = padding + (idx / (points.length - 1)) * chartWidth;
    const y = padding + chartHeight - (val / maxVal) * chartHeight;
    return { x, y, value: val };
  });

  let linePathString = "";
  if (coordinates.length > 0) {
    linePathString = `M ${coordinates[0].x} ${coordinates[0].y}`;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const curr = coordinates[i];
      const next = coordinates[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 3;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (2 * (next.x - curr.x)) / 3;
      const cpY2 = next.y;
      linePathString += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
  }

  const areaPathString = linePathString
    ? `${linePathString} L ${coordinates[coordinates.length - 1].x} ${height - padding} L ${coordinates[0].x} ${height - padding} Z`
    : "";

  const recentLessonsSample = [
    {
      id: "1",
      title: "Embracing Mistakes in Production Code",
      category: "Mistakes Learned",
      date: "2 hours ago",
      status: "Public",
    },
    {
      id: "2",
      title: "Designing the Perfect Architecture with Pure CSS",
      category: "Career",
      date: "Yesterday",
      status: "Premium",
    },
    {
      id: "3",
      title: "The Fine Line Between Hustle and Burnout",
      category: "Mindset",
      date: "3 days ago",
      status: "Private",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 text-foreground transition-all duration-300">
      {/* ─── REGION A: GREETING & SHORTCUT HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
              Hello, {activeUser.name}
            </h1>
            {activeUser?.isPremium && !isAdmin && (
              <span className="flex gap-2 items-center text-xs font-medium px-2 py-0.5 rounded-md bg-card text-primary shadow-xs uppercase tracking-wider shrink-0">
                PRO{" "}
                <MdStar className="text-amber-500 dark:text-yellow-500 drop-shadow-[0_2px_8px_rgba(234,179,8,0.2)] dark:drop-shadow-[0_4px_12px_rgba(234,179,8,0.4)] transition-all duration-300" />
              </span>
            )}
            {isAdmin && (
              <span className="flex gap-2 items-center text-xs font-medium px-2 py-0.5 rounded-md bg-card text-primary shadow-xs uppercase tracking-wider shrink-0">
                ADMIN{" "}
                <FaCrown className="text-amber-500 dark:text-yellow-500 drop-shadow-[0_2px_8px_rgba(234,179,8,0.2)] dark:drop-shadow-[0_4px_12px_rgba(234,179,8,0.4)] transition-all duration-300" />
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-1 max-w-xl truncate sm:overflow-visible sm:whitespace-normal">
            {isAdmin
              ? "Platform diagnostic nodes & platform-wide analytics monitoring dashboard."
              : "Capture insights, review milestones, and manage your logic repository workspace."}
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href={isAdmin ? "/dashboard/admin/manage-lessons" : "/dashboard/add-lesson"}
            className={`w-full sm:w-auto inline-flex items-center justify-center text-center px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide text-white transition-all duration-200 shadow-xs active:scale-[0.98] cursor-pointer ${
              isAdmin ? "bg-secondary hover:bg-secondary/90" : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isAdmin ? "Moderate Content 📝" : "Write New Lesson ✍️"}
          </Link>
        </div>
      </div>

      {/* ─── REGION B: METRICS OVERVIEW GRID ─── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5" aria-label="Statistical Metrics Overview Grid">
        {isAdmin ? (
          <>
            <div className="p-4 sm:p-5 bg-card border border-border/60 rounded-xl shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Total Users</div>
              <div className="text-xl sm:text-2xl font-black text-foreground">{activeUser.stats.admin.totalUsers}</div>
              <div className="text-[9px] font-bold text-success mt-1">↑ 12% cycle</div>
            </div>
            <div className="p-4 sm:p-5 bg-card border border-border/60 rounded-xl shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Total Public Lessons</div>
              <div className="text-xl sm:text-2xl font-black text-foreground">{activeUser.stats.admin.publicLessons}</div>
              <div className="text-[9px] font-medium text-muted mt-1">Active entries</div>
            </div>
            <div className="p-4 sm:p-5 bg-card border border-border/60 rounded-xl shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Reported Content</div>
              <div className="text-xl sm:text-2xl font-black text-secondary">{activeUser.stats.admin.reportedLessons}</div>
              <div className="text-[9px] font-bold text-secondary mt-1">Flagged logs</div>
            </div>
            <div className="p-4 sm:p-5 bg-card border border-border/60 rounded-xl shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Today's New Lessons</div>
              <div className="text-xl sm:text-2xl font-black text-foreground">{activeUser.stats.admin.newToday}</div>
              <div className="text-[9px] font-bold text-success mt-1">Incoming streams</div>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 sm:p-5 bg-card border border-border/60 rounded-xl shadow-xs col-span-1 sm:col-span-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Total Lessons Created</div>
              <div className="text-2xl sm:text-3xl font-black text-primary">{activeUser.stats.user.created}</div>
              <p className="text-[10px] text-muted mt-1 truncate">Your custom insight logs.</p>
            </div>
            <div className="p-4 sm:p-5 bg-card border border-border/60 rounded-xl shadow-xs col-span-1 sm:col-span-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Total Saved (Favorites)</div>
              <div className="text-2xl sm:text-3xl font-black text-foreground">{activeUser.stats.user.saved}</div>
              <p className="text-[10px] text-muted mt-1 truncate">Bookmarked platform shared items.</p>
            </div>
          </>
        )}
      </section>

      {/* ─── REGION C: SPLIT GRID (GRAPH & ACTIVITY PANELS) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Vector SVG Analytics Chart Block */}
        <div className="p-4 sm:p-6 bg-card border border-border/60 rounded-xl shadow-xs lg:col-span-2 flex flex-col justify-between overflow-hidden">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground">
              {isAdmin ? "Platform Growth Trajectory" : "Weekly Contribution Reflections"}
            </h3>
            <p className="text-[11px] text-muted mt-0.5">Automated continuous spline chart calculation arrays.</p>
          </div>

          <div className="w-full overflow-hidden relative pt-2">
            <div className="w-full min-w-[320px] aspect-16/7 lg:aspect-auto lg:h-44">
              <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGradientArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isAdmin ? "var(--color-secondary, #a855f7)" : "var(--color-primary, #3b82f6)"} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={isAdmin ? "var(--color-secondary, #a855f7)" : "var(--color-primary, #3b82f6)"} stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" className="text-border/20" strokeDasharray="3,3" />
                <line x1={padding} y1={padding + chartHeight / 2} x2={width - padding} y2={padding + chartHeight / 2} stroke="currentColor" className="text-border/20" strokeDasharray="3,3" />
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-border/40" />

                {areaPathString && <path d={areaPathString} fill="url(#chartGradientArea)" className="transition-all duration-500" />}
                {linePathString && <path d={linePathString} fill="none" stroke={isAdmin ? "var(--color-secondary, #a855f7)" : "var(--color-primary, #3b82f6)"} strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-500" />}

                {coordinates.map((dot, idx) => (
                  <g key={idx} className="group/dot cursor-pointer">
                    <circle cx={dot.x} cy={dot.y} r="4" fill="var(--bg-card, #121212)" stroke={isAdmin ? "var(--color-secondary, #a855f7)" : "var(--color-primary, #3b82f6)"} strokeWidth="2" />
                    <circle cx={dot.x} cy={dot.y} r="8" fill={isAdmin ? "var(--color-secondary, #a855f7)" : "var(--color-primary, #3b82f6)"} opacity="0" className="hover:opacity-20 transition-opacity duration-150" />
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center px-1 pt-3 border-t border-border/30 mt-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
              <span key={idx} className="text-[10px] font-semibold text-muted tracking-wide w-8 text-center">
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Recently Added Lessons Block */}
        <div className="p-4 sm:p-6 bg-card border border-border/60 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Recently Added Lessons</h3>
              <Link href="/dashboard/my-lessons" className={`text-xs font-bold hover:underline ${isAdmin ? "text-secondary" : "text-primary"}`}>
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentLessonsSample.map((lesson) => (
                <div key={lesson.id} className="p-3 border border-border/40 bg-surface/30 hover:bg-surface/70 rounded-xl transition-all duration-150 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground truncate text-[11px] sm:text-xs">{lesson.title}</p>
                    <span className="text-muted text-[10px] block mt-0.5 truncate">
                      {lesson.category} • {lesson.date}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold tracking-wide text-[9px] uppercase border shrink-0 ${
                      lesson.status === "Premium"
                        ? "bg-secondary/10 text-secondary border-secondary/20"
                        : lesson.status === "Public"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-muted/10 text-muted border-border"
                    }`}
                  >
                    {lesson.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border/40 mt-4 text-[10px] font-medium text-muted text-center">
            Platform diagnostics synchronized.
          </div>
        </div>
      </div>
    </div>
  );
}