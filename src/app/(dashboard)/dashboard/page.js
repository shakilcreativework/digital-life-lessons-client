"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { GiLaurelCrown } from "react-icons/gi";
import { FaPenFancy } from "react-icons/fa";

// Pro Production User Contribution Dataset Matrix
const CONTRIBUTION_DATASET = [
  { day: "Mon", metrics: 15 },
  { day: "Tue", metrics: 32 },
  { day: "Wed", metrics: 24 },
  { day: "Thu", metrics: 58 },
  { day: "Fri", metrics: 40 },
  { day: "Sat", metrics: 72 },
  { day: "Sun", metrics: 88 },
];

/**
 * Calculates responsive geometric coordinates to map the data stream points
 * directly onto the center vertices of the generated SVG vector path.
 */
function computeLinearSplineCoordinates(data, width, height, padding) {
  if (!data || data.length === 0) return { pathD: "", points: [], fillD: "" };

  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const values = data.map((d) => d.metrics);
  const maxVal = Math.max(...values, 10);
  const minVal = Math.min(...values, 0);
  const valueRange = maxVal - minVal;

  // Step 1: Map raw values to precise viewBox coordinate markers
  const points = data.map((item, idx) => {
    const x = padding + (idx / (data.length - 1)) * usableWidth;
    const y =
      padding +
      usableHeight -
      ((item.metrics - minVal) / valueRange) * usableHeight;
    return { x, y, label: item.day, value: item.metrics };
  });

  // Step 2: Formulate smooth cubic bezier path configuration strings
  let pathD = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];

    const controlX1 = current.x + (next.x - current.x) / 2;
    const controlY1 = current.y;
    const controlX2 = current.x + (next.x - current.x) / 2;
    const controlY2 = next.y;

    pathD += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
  }

  // Step 3: Establish enclosed background surface coordinates for gradient paint masks
  const fillD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return { pathD, points, fillD };
}

export default function UserDashboardLanding() {
  const { data: session, isPending } = authClient.useSession();
  const [lesson, setLesson] = useState(null);

  const id = session?.user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creator/lessons/${id}`);
        const data = await res.json();
        setLesson(data);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    };

    fetchData();
  }, [id]);

  console.log(lesson);

  // Unified responsive Canvas layout bounds
  const viewBoxWidth = 700;
  const viewBoxHeight = 180;
  const edgePadding = 20;

  // Fully memoize path generation computations to protect engine performance metrics
  const { pathD, points, fillD } = useMemo(() => {
    return computeLinearSplineCoordinates(
      CONTRIBUTION_DATASET,
      viewBoxWidth,
      viewBoxHeight,
      edgePadding,
    );
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
      {/* Welcome Workspace Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2 flex-wrap">
            Hello, <span className="uppercase">{session?.user?.name || "Administrator"}</span>
            {session?.user?.isPremium && <span className="flex items-center gap-2 text-purple-400 font-bold text-[10px] border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
              Pro{" "}
              <GiLaurelCrown className="text-amber-500 dark:text-yellow-500 drop-shadow-[0_2px_8px_rgba(234,179,8,0.2)] dark:drop-shadow-[0_4px_12px_rgba(234,179,8,0.4)] transition-all duration-300" />
            </span>}
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Capture insights, review milestones, and manage your logic
            repository workspace.
          </p>
        </div>
        <Link
          href="/dashboard/add-lesson"
          className="inline-flex items-center justify-center px-4 gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Write New Lesson <FaPenFancy />
        </Link>
      </div>

      {/* Workspace Core Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            Total Lessons Created
          </span>
          <div className="text-2xl font-black text-foreground mt-1">{lesson?.length || 0}</div>
          <p className="text-[10px] text-muted/80 mt-1">
            Your custom insight logs.
          </p>
        </div>
        <div className="p-5 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            Total Saved Favorites
          </span>
          <div className="text-2xl font-black text-foreground mt-1">32</div>
          <p className="text-[10px] text-muted/80 mt-1">
            Bookmarked platform shared items.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Vector Brand Spline Graph Card Container */}
        <div className="lg:col-span-2 p-6 bg-card border border-border/60 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-foreground">
              Weekly Contribution Reflections
            </h3>
            <p className="text-[10px] text-muted mb-6">
              Automated continuous spline chart calculation arrays.
            </p>
          </div>

          {/* Main Visual Display Frame (Branded Primary Amber/Orange Tint) */}
          <div className="relative w-full mt-2">
            <svg
              className="w-full h-auto overflow-visible"
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Brand Primary Linear Falloff Gradient Fill Mask */}
                <linearGradient
                  id="brandGraphAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Render Smooth Area Mask Background */}
              <path d={fillD} fill="url(#brandGraphAreaGradient)" />

              {/* Render Smooth Interpolated Brand Vector Outline */}
              <path
                d={pathD}
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dynamic Coordinate Target Anchor Nodes */}
              {points.map((pt, index) => (
                <g key={index} className="group/node cursor-pointer">
                  {/* Expanded collision touch boundary padding */}
                  <circle cx={pt.x} cy={pt.y} r="10" fill="transparent" />
                  {/* Central Node Visual Core */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#f97316"
                    stroke="#16161a"
                    strokeWidth="1.5"
                    className="transition-transform duration-200 group-hover/node:scale-125"
                  />
                  <title>{`Value: ${pt.value} contributions`}</title>
                </g>
              ))}
            </svg>

            {/* X-Axis Structural Alignment Labels */}
            <div className="flex justify-between px-1.5 pt-4 text-[10px] font-bold text-muted/60 tracking-wide">
              {points.map((pt, index) => (
                <span key={index} className="w-8 text-center">
                  {pt.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Global Overview Feed Mod */}
        <div className="p-6 bg-card border border-border/60 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-foreground">
                Recently Added Lessons
              </h3>
              <Link
                href="/explore"
                className="text-[10px] font-bold text-orange-500 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-surface/40 border border-border/40 rounded-xl flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-foreground truncate">
                    Embracing Mistakes in Production Code
                  </p>
                  <span className="text-[10px] text-muted block mt-0.5">
                    Mistakes Learned • 2 hours ago
                  </span>
                </div>
                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded-md uppercase shrink-0">
                  Public
                </span>
              </div>

              <div className="p-3.5 bg-surface/40 border border-border/40 rounded-xl flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-foreground truncate">
                    Designing the Perfect Architecture with...
                  </p>
                  <span className="text-[10px] text-muted block mt-0.5">
                    Career • Yesterday
                  </span>
                </div>
                <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold rounded-md uppercase shrink-0">
                  Premium
                </span>
              </div>

              <div className="p-3.5 bg-surface/40 border border-border/40 rounded-xl flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-foreground truncate">
                    The Fine Line Between Hustle and Burnout
                  </p>
                  <span className="text-[10px] text-muted block mt-0.5">
                    Mindset • 3 days ago
                  </span>
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
        </div>
      </div>
    </div>
  );
}
