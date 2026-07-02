"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { FaCrown } from "react-icons/fa";
import { HiDatabase } from "react-icons/hi";
import { getAllUsers } from "@/lib/actions/users";
import toast from "react-hot-toast";
import { getAllLessons } from "@/lib/actions/lessons";
import { getAllLessonsReports } from "@/lib/actions/lessonsReports";
import RecentLessons from "@/components/ui/RecentLessons";

// Pro Production Data Stream Matrix
const ANALYTICS_DATASET = [
  { day: "Mon", metrics: 12 },
  { day: "Tue", metrics: 28 },
  { day: "Wed", metrics: 22 },
  { day: "Thu", metrics: 55 },
  { day: "Fri", metrics: 42 },
  { day: "Sat", metrics: 68 },
  { day: "Sun", metrics: 78 },
];

/**
 * Generates a mathematically sound Monotone Spline Curve Path string (SVG Path)
 * ensuring the line locks directly to the center of every data point.
 */
function computeLinearSplineCoordinates(data, width, height, padding) {
  if (!data || data.length === 0) return { pathD: "", points: [], fillD: "" };

  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const values = data.map(d => d.metrics);
  const maxVal = Math.max(...values, 10);
  const minVal = Math.min(...values, 0);
  const valueRange = maxVal - minVal;

  // Step 1: Map raw system arrays to strict coordinate points inside the SVG view box
  const points = data.map((item, idx) => {
    const x = padding + (idx / (data.length - 1)) * usableWidth;
    // Invert Y axis coordinates because SVG position 0 sits at the top margin
    const y = padding + usableHeight - ((item.metrics - minVal) / valueRange) * usableHeight;
    return { x, y, label: item.day, value: item.metrics };
  });

  // Step 2: Build the smooth path command stream using algorithmic vector tension controls
  let pathD = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];

    // Tension control anchors for generating mathematically smooth lines
    const controlX1 = current.x + (next.x - current.x) / 2;
    const controlY1 = current.y;
    const controlX2 = current.x + (next.x - current.x) / 2;
    const controlY2 = next.y;

    pathD += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
  }

  // Step 3: Close the loop down to the bottom coordinates to create a valid fill vector area
  const fillD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return { pathD, points, fillD };
}

export default function AdminDashboardLanding() {
  const { data: session, isPending } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [lessonsReports, setLessonsReports] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // 🚀 Parallel Execution: All 3 network requests fire simultaneously
        const [usersData, lessonsData, reportsData] = await Promise.all([
          getAllUsers(),
          getAllLessons(),
          getAllLessonsReports(),
        ]);

        // ✅ Batched Updates: React groups these state updates into a single re-render
        setUsers(usersData);
        setLessons(lessonsData);
        setLessonsReports(reportsData);
      } catch (error) {
        console.error("Dashboard asset sync disruption:", error);
        toast.error("Critical failure updating global data arrays.");
      }
    };

    loadDashboardData();
  }, []);

  // console.log(users);

  // Immutable view boundary configurations
  const viewBoxWidth = 700;
  const viewBoxHeight = 180;
  const edgePadding = 20;

  // Compute layout structures with complete memoization to save system compute cycles
  const { pathD, points, fillD } = useMemo(() => {
    return computeLinearSplineCoordinates(ANALYTICS_DATASET, viewBoxWidth, viewBoxHeight, edgePadding);
  }, []);

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xs text-muted/60 animate-pulse font-medium tracking-widest uppercase">
          Calling platform data telemetry streams...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2 flex-wrap">
            Hello, <span className="uppercase">{session?.user?.name || "Administrator"}</span>
            <span className="flex items-center gap-2 text-purple-400 font-bold text-[10px] border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
              Admin <FaCrown className="text-amber-500 dark:text-yellow-500 drop-shadow-[0_2px_8px_rgba(234,179,8,0.2)] dark:drop-shadow-[0_4px_12px_rgba(234,179,8,0.4)] transition-all duration-300" />
            </span>
          </h1>
          <p className="text-xs text-muted mt-0.5">Platform diagnostic nodes & platform-wide analytics monitoring dashboard.</p>
        </div>
        <Link
          href="/dashboard/admin/reported-lessons"
          className="inline-flex items-center justify-center px-4 gap-2 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Moderate Content <HiDatabase />
        </Link>
      </div>

      {/* Admin Operations Core Data Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Total Users</span>
          <div className="text-2xl font-black text-foreground mt-1">{users?.length || 0}</div>
          <p className="text-[10px] text-emerald-500 font-medium mt-1">↑ 12% cycle delta</p>
        </div>
        <div className="p-5 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Total Public Lessons</span>
          <div className="text-2xl font-black text-foreground mt-1">{lessons?.length}</div>
          <p className="text-[10px] text-muted/80 mt-1">Active catalog entries</p>
        </div>
        <div className="p-5 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Reported Content</span>
          <div className="text-2xl font-black text-purple-400 mt-1">{lessonsReports?.length}</div>
          <p className="text-[10px] text-purple-400/70 mt-1">Flagged review items</p>
        </div>
        <div className="p-5 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Today&apos;s New Lessons</span>
          <div className="text-2xl font-black text-foreground mt-1">45</div>
          <p className="text-[10px] text-emerald-500 font-medium mt-1">Incoming user streams</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Vector Spline Graph Wrapper Card */}
        <div className="lg:col-span-2 p-6 bg-card border border-border/60 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-foreground">Platform Growth Trajectory</h3>
            <p className="text-[10px] text-muted mb-6">Automated continuous spline chart calculation arrays.</p>
          </div>

          {/* Main Visual Display Frame */}
          <div className="relative w-full mt-2">
            <svg
              className="w-full h-auto overflow-visible"
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Linear Falloff Fill Color Mask */}
                <linearGradient id="purpleGraphAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Render Smooth Area Mask Background */}
              <path d={fillD} fill="url(#purpleGraphAreaGradient)" />

              {/* Render Smooth Interpolated Vector Outline */}
              <path
                d={pathD}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dynamic Interactive Node Anchor Points (Perfect Center Align) */}
              {points.map((pt, index) => (
                <g key={index} className="group/node cursor-pointer">
                  {/* Invisible structural hover canvas expander to make touch targets easier to hit */}
                  <circle cx={pt.x} cy={pt.y} r="10" fill="transparent" />
                  {/* Core Outer Dark Stroke Ring */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#a855f7"
                    stroke="#16161a"
                    strokeWidth="1.5"
                    className="transition-transform duration-200 group-hover/node:scale-125"
                  />
                  {/* Tooltip text array triggered cleanly on data node mouse overs */}
                  <title>{`Value: ${pt.value} updates`}</title>
                </g>
              ))}
            </svg>

            {/* X-Axis Structural Alignment Labels */}
            <div className="flex justify-between px-1.5 pt-4 text-[10px] font-bold text-muted/60 tracking-wide">
              {points.map((pt, index) => (
                <span key={index} className="w-8 text-center">{pt.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Global Overview Feed Mod */}
        {/* <div className="p-6 bg-card border border-border/60 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-foreground">Recently Added Lessons</h3>
              <Link href="/dashboard/admin/manage-lessons" className="text-[10px] font-bold text-purple-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-surface/40 border border-border/40 rounded-xl flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-foreground truncate">Embracing Mistakes in Production Code</p>
                  <span className="text-[10px] text-muted block mt-0.5">Mistakes Learned • 2 hours ago</span>
                </div>
                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded-md uppercase shrink-0">
                  Public
                </span>
              </div>

              <div className="p-3.5 bg-surface/40 border border-border/40 rounded-xl flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-foreground truncate">Designing the Perfect Architecture with...</p>
                  <span className="text-[10px] text-muted block mt-0.5">Career • Yesterday</span>
                </div>
                <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold rounded-md uppercase shrink-0">
                  Premium
                </span>
              </div>

              <div className="p-3.5 bg-surface/40 border border-border/40 rounded-xl flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-foreground truncate">The Fine Line Between Hustle and Burnout</p>
                  <span className="text-[10px] text-muted block mt-0.5">Mindset • 3 days ago</span>
                </div>
                <span className="px-1.5 py-0.5 bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 text-[9px] font-bold rounded-md uppercase shrink-0">
                  Private
                </span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-border/40 text-[10px] text-muted/60 font-medium">
            Platform diagnostics synchronized.
          </div>
        </div> */}

        <RecentLessons />
      </div>
    </div>
  );
}