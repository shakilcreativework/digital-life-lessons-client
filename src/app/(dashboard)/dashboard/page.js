"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { GiLaurelCrown } from "react-icons/gi";
import { FaPenFancy } from "react-icons/fa";
import { fetchUserFavorites } from "@/lib/actions/favorites";
import { getLessonByUserId } from "@/lib/actions/userLessons";
import { FiLoader } from "react-icons/fi";
import RecentLessons from "@/components/ui/RecentLessons";
import toast from "react-hot-toast";

// Helper: Generate last 7 days lesson contribution data
const generateWeeklyData = (lessons) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const weekly = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));

    return {
      day: days[date.getDay()],
      date: date.toISOString().split('T')[0],
      metrics: 0,
    };
  });

  lessons.forEach((lesson) => {
    if (!lesson?.createdAt) return;
    const lessonDate = new Date(lesson.createdAt).toISOString().split('T')[0];
    const dayEntry = weekly.find((item) => item.date === lessonDate);
    if (dayEntry) dayEntry.metrics += 1;
  });

  return weekly;
};

/**
 * Calculates SVG coordinates and paths for smooth spline graph
 */
function computeLinearSplineCoordinates(data, width, height, padding) {
  if (!data || data.length === 0) return { pathD: "", points: [], fillD: "" };

  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const values = data.map((d) => d.metrics);
  const maxVal = Math.max(...values, 10);
  const minVal = Math.min(...values, 0);
  const valueRange = maxVal - minVal;

  const points = data.map((item, idx) => {
    const x = padding + (idx / (data.length - 1)) * usableWidth;
    const y =
      padding +
      usableHeight -
      ((item.metrics - minVal) / valueRange) * usableHeight;
    return { x, y, label: item.day, value: item.metrics };
  });

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

  const fillD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return { pathD, points, fillD };
}

export default function UserDashboardLanding() {
  const { data: session, isPending } = authClient.useSession();

  const [lesson, setLesson] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const id = session?.user?.id;

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [lessonData, favData] = await Promise.all([
          getLessonByUserId(id),
          fetchUserFavorites(id),
        ]);

        setLesson(lessonData);
        setFavorites(favData || []);

        // Generate real weekly graph data
        const realWeekly = generateWeeklyData(lessonData || []);
        setWeeklyData(realWeekly);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const viewBoxWidth = 700;
  const viewBoxHeight = 180;
  const edgePadding = 20;

  const { pathD, points, fillD } = useMemo(() => {
    return computeLinearSplineCoordinates(
      weeklyData,
      viewBoxWidth,
      viewBoxHeight,
      edgePadding
    );
  }, [weeklyData]);

  if (isPending || loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-background">
        <FiLoader className="animate-spin text-primary text-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2 flex-wrap">
            Hello,{" "}
            <span className="uppercase">
              {session?.user?.name || "Administrator"}
            </span>
            {session?.user?.isPremium && (
              <span className="flex items-center gap-2 text-purple-400 font-bold text-[10px] border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Pro{" "}
                <GiLaurelCrown className="text-amber-500 dark:text-yellow-500 drop-shadow-[0_2px_8px_rgba(234,179,8,0.2)] dark:drop-shadow-[0_4px_12px_rgba(234,179,8,0.4)] transition-all duration-300" />
              </span>
            )}
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Capture insights, review milestones, and manage your logic repository workspace.
          </p>
        </div>

        <Link
          href="/dashboard/add-lesson"
          className="inline-flex items-center justify-center px-4 gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Write New Lesson <FaPenFancy />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            Total Lessons Created
          </span>
          <div className="text-2xl font-black text-foreground mt-1">
            {lesson?.length || 0}
          </div>
          <p className="text-[10px] text-muted/80 mt-1">
            Your custom insight logs.
          </p>
        </div>

        <div className="p-5 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            Total Saved Favorites
          </span>
          <div className="text-2xl font-black text-foreground mt-1">
            {favorites?.length || 0}
          </div>
          <p className="text-[10px] text-muted/80 mt-1">
            Bookmarked platform shared items.
          </p>
        </div>
      </div>

      {/* Graph + Recent Lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Graph */}
        <div className="lg:col-span-2 p-6 bg-card border border-border/60 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-foreground">
              Weekly Contribution Reflections
            </h3>
            <p className="text-[10px] text-muted mb-6">
              Automated continuous spline chart calculation arrays.
            </p>
          </div>

          <div className="relative w-full mt-2">
            <svg
              className="w-full h-auto overflow-visible"
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="brandGraphAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              <path d={fillD} fill="url(#brandGraphAreaGradient)" />
              <path
                d={pathD}
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map((pt, index) => (
                <g key={index} className="group/node cursor-pointer">
                  <circle cx={pt.x} cy={pt.y} r="10" fill="transparent" />
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

            <div className="flex justify-between px-1.5 pt-4 text-[10px] font-bold text-muted/60 tracking-wide">
              {points.map((pt, index) => (
                <span key={index} className="w-8 text-center">
                  {pt.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Lessons */}
        <RecentLessons />
      </div>
    </div>
  );
}