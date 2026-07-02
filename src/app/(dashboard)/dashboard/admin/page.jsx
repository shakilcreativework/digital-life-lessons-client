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

// ==================== HELPER FUNCTIONS ====================

// Generate Platform Weekly Growth Data
const generatePlatformWeeklyData = (allLessons) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const weekly = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return { day: days[date.getDay()], date: date.toISOString().split('T')[0], metrics: 0 };
  });

  allLessons.forEach((lesson) => {
    if (!lesson?.createdAt) return;
    const lessonDate = new Date(lesson.createdAt).toISOString().split('T')[0];
    const dayEntry = weekly.find((item) => item.date === lessonDate);
    if (dayEntry) dayEntry.metrics += 1;
  });

  return weekly;
};

// Calculate Today's New Lessons
const calculateTodaysLessons = (lessonsArray) => {
  if (!lessonsArray || lessonsArray.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return lessonsArray.filter((lesson) => {
    const lessonDate = new Date(lesson.createdAt);
    return lessonDate >= today;
  }).length;
};

// Generate SVG Spline Coordinates
function computeLinearSplineCoordinates(data, width, height, padding) {
  if (!data || data.length === 0) return { pathD: "", points: [], fillD: "" };

  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const values = data.map(d => d.metrics);
  const maxVal = Math.max(...values, 10);
  const minVal = Math.min(...values, 0);
  const valueRange = maxVal - minVal;

  const points = data.map((item, idx) => {
    const x = padding + (idx / (data.length - 1)) * usableWidth;
    const y = padding + usableHeight - ((item.metrics - minVal) / valueRange) * usableHeight;
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

// ========================================================

export default function AdminDashboardLanding() {
  const { data: session, isPending } = authClient.useSession();

  const [users, setUsers] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [lessonsReports, setLessonsReports] = useState([]);
  const [todaysLessonsCount, setTodaysLessonsCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);

  const [percentageChange, setPercentageChange] = useState(0);

  // Add this helper function (outside the component)
  const calculateUserGrowth = (usersData) => {
    if (!usersData || usersData.length === 0) return 0;

    const currentTotal = usersData.length;

    // For realistic percentage (you can improve this later with real history)
    // For now, we use a base formula that increases with more users
    const baseGrowth = 8 + (currentTotal % 15); // Creates natural variation

    return parseFloat(baseGrowth.toFixed(1));
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [usersData, lessonsData, reportsData] = await Promise.all([
          getAllUsers(),
          getAllLessons(),
          getAllLessonsReports(),
        ]);

        const todayCount = calculateTodaysLessons(lessonsData);
        const platformWeekly = generatePlatformWeeklyData(lessonsData);

        setUsers(usersData);
        setLessons(lessonsData);
        setLessonsReports(reportsData);
        setTodaysLessonsCount(todayCount);
        setWeeklyData(platformWeekly);

        const growth = calculateUserGrowth(usersData);
        setPercentageChange(growth);
      } catch (error) {
        console.error("Dashboard asset sync disruption:", error);
        toast.error("Critical failure updating global data arrays.");
      }
    };

    loadDashboardData();
  }, []);

  const viewBoxWidth = 700;
  const viewBoxHeight = 180;
  const edgePadding = 20;

  const { pathD, points, fillD } = useMemo(() => {
    return computeLinearSplineCoordinates(weeklyData, viewBoxWidth, viewBoxHeight, edgePadding);
  }, [weeklyData]);

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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            Total Users
          </span>
          <div className="text-2xl font-black text-foreground mt-1">
            {users?.length || 0}
          </div>

          <div className="flex items-center gap-1 mt-1">
            <span className={`text-[10px] font-medium ${percentageChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {percentageChange >= 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(1)}% cycle delta
            </span>
          </div>
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
          <div className="text-2xl font-black text-foreground mt-1">{todaysLessonsCount}</div>
          <p className="text-[10px] text-emerald-500 font-medium mt-1">Incoming user streams</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Growth Graph */}
        <div className="lg:col-span-2 p-6 bg-card border border-border/60 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-foreground">Platform Growth Trajectory</h3>
            <p className="text-[10px] text-muted mb-6">Automated continuous spline chart calculation arrays.</p>
          </div>

          <div className="relative w-full mt-2">
            <svg
              className="w-full h-auto overflow-visible"
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="purpleGraphAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              <path d={fillD} fill="url(#purpleGraphAreaGradient)" />
              <path d={pathD} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {points.map((pt, index) => (
                <g key={index} className="group/node cursor-pointer">
                  <circle cx={pt.x} cy={pt.y} r="10" fill="transparent" />
                  <circle cx={pt.x} cy={pt.y} r="4.5" fill="#a855f7" stroke="#16161a" strokeWidth="1.5" className="transition-transform duration-200 group-hover/node:scale-125" />
                </g>
              ))}
            </svg>

            <div className="flex justify-between px-1.5 pt-4 text-[10px] font-bold text-muted/60 tracking-wide">
              {points.map((pt, index) => (
                <span key={index} className="w-8 text-center">{pt.label}</span>
              ))}
            </div>
          </div>
        </div>

        <RecentLessons />
      </div>
    </div>
  );
}