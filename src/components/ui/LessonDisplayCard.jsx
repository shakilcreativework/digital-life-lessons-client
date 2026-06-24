'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiBookOpen, FiHeart, FiTag, FiUser, FiCalendar,
  FiRefreshCw, FiEye, FiBookmark, FiAlertTriangle,
  FiShare2, FiSend, FiMessageSquare, FiLock, FiArrowRight
} from "react-icons/fi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";
import { BiLike, BiSolidLike } from "react-icons/bi";
import LessonCard from "./LessonCard";
import Container from "../shared/Container";

export default function LessonDisplayCard({ lessonData = {} }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const { data: session } = authClient.useSession();
  const userId = session?.user?.id || session?.user?._id;

  // Fully Destructured Data matching your exact schema layout
  const {
    _id = "",
    title = "Untitled Lesson",
    description = "",
    category = "General",
    emotionalTone = "Realization",
    visibility,
    accessLevel,
    image = null,
    authorName = "Anonymous",
    authorImg = null,
    likes = [],
    likesCount = 0,
    comments = [],
    CommentsCount = 0,
    bookmarkedBy = [],
    bookmarkedByCount = 0,
    creatorId = "",
    createdAt,
    updatedAt,
  } = lessonData?.lesson || {};
  const {
    totalLessonsCreated,
  } = lessonData?.authorStats;

  // similar lessons
  const similarLessons = lessonData?.recommendedLessons || [];

  // LOCK EVALUATION PATTERN
  const isAdmin = session?.user?.role === "admin";
  const isPremiumUser = session?.user?.isPremium === true;
  const hasFullAccess = isAdmin || isPremiumUser;
  const isPremiumLesson = accessLevel === "Premium";

  const isLocked = isMounted && isPremiumLesson && !hasFullAccess;

  // Interactive UI Reactive States (Lazy initialization prevents cascading render errors)
  const [isLiked, setIsLiked] = useState(() => {
    return userId ? likes.includes(userId) : false;
  });
  const [isBookmarked, setIsBookmarked] = useState(() => {
    return userId ? bookmarkedBy.includes(userId) : false;
  });

  const [likeOffset, setLikeOffset] = useState(0);
  const [FavoriteOffset, setFavoriteOffset] = useState(0);
  const [viewsCount] = useState(() => Math.floor(Math.random() * 10000));

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(comments || []);

  const currentLikesCount = likesCount + likeOffset;
  const currentFavoritesCount = bookmarkedByCount + FavoriteOffset;

  // Sync state cleanly if likesCount changes from an external prop update
  const [prevLikesCount, setPrevLikesCount] = useState(likesCount);
  if (likesCount !== prevLikesCount) {
    setPrevLikesCount(likesCount);
    setLikeOffset(0);
    setIsLiked(userId ? likes.includes(userId) : false);
  }

  // Sync state cleanly if bookmarkedByCount changes from an external prop update
  const [prevBookmarkedCount, setPrevBookmarkedCount] = useState(bookmarkedByCount);
  if (bookmarkedByCount !== prevBookmarkedCount) {
    setPrevBookmarkedCount(bookmarkedByCount);
    setFavoriteOffset(0);
    setIsBookmarked(userId ? bookmarkedBy.includes(userId) : false);
  }

  // Handle the edge-case where the auth session initializes safely after mount
  const [prevUserId, setPrevUserId] = useState(userId);
  if (userId !== prevUserId) {
    setPrevUserId(userId);
    setIsLiked(userId ? likes.includes(userId) : false);
    setIsBookmarked(userId ? bookmarkedBy.includes(userId) : false);
  }

  // Dynamic reading time counter
  const readingTime = Math.max(1, Math.ceil((description?.split(/\s+/).length || 0) / 225));

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "Recently";
    }
  };

  const getToneStyles = (tone) => {
    if (!tone) return "bg-surface text-muted border-border";
    const standardizedTone = tone.toLowerCase();
    if (standardizedTone.includes("motivational") || standardizedTone.includes("gratitude")) {
      return "bg-primary/10 dark:bg-primary/20 text-primary border-primary/20";
    }
    if (standardizedTone.includes("sad") || standardizedTone.includes("mistake") || standardizedTone.includes("realization")) {
      return "bg-secondary/10 dark:bg-secondary/20 text-secondary border-secondary/20";
    }
    return "bg-surface text-muted border-border";
  };

  // ❤️ Like Button Logic
  const handleLikeClick = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    if (!session?.user) {
      toast.error("Please log in to like");
      return;
    }

    const nextLikedState = !isLiked;
    setIsLiked(nextLikedState);
    setLikeOffset((prev) => (nextLikedState ? prev + 1 : prev - 1));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${_id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error();

      toast.success(nextLikedState ? "Lesson liked ❤️" : "Like removed");
    } catch (error) {
      setIsLiked(!nextLikedState);
      setLikeOffset((prev) => (nextLikedState ? prev - 1 : prev + 1));
      toast.error("Network sync error. Could not process like action.");
    }
  };

  // 🔖 Save to Favorites Toggle Logic
  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    if (!session?.user) {
      toast.error("Please log in to Favorites Bookmark");
      return;
    }

    const nextFavoriteState = !isBookmarked;
    setIsBookmarked(nextFavoriteState);
    setFavoriteOffset((prev) => (nextFavoriteState ? prev + 1 : prev - 1));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${_id}/favorite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error();

      toast.success(nextFavoriteState ? "Lesson added to Favorites 🔖" : "Favorites bookmark removed");
    } catch (error) {
      setIsBookmarked(!nextFavoriteState);
      setFavoriteOffset((prev) => (nextFavoriteState ? prev - 1 : prev + 1));
      toast.error("Network sync error. Could not process bookmark action.");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: `Read ${authorName}'s lesson log`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      toast.error("Could not complete sharing execution pattern");
    }
  };

  // 💬 Post Comment Submission Form Controller
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    if (!session?.user) {
      toast.error("Please log in to post comments.");
      return;
    }
    if (!commentText.trim()) return;

    const initialTextValue = commentText.trim();
    setCommentText("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${_id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          authorName: session.user.name || "Authenticated User",
          authorImg: session.user.image || session.user.photoURL || null,
          text: initialTextValue,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error();

      setLocalComments((prev) => [data.comment, ...prev]);
      toast.success("Comment posted successfully!");
    } catch (error) {
      setCommentText(initialTextValue);
      toast.error("Failed to post comment. Verify host connectivity status.");
    }
  };

  // 🚩 Report / Flag Lesson Content Submission Modal
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason) {
      toast.error("Please choose a reason category.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${_id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterUserId: userId,
          reportedUserEmail: session?.user?.email || "anonymous-reporter@domain.com",
          reason: reportReason,
          details: reportDetails.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error();

      toast.success("Report entered into lessonsReports database.");
      setIsReportOpen(false);
      setReportReason("");
      setReportDetails("");
    } catch (error) {
      toast.error("Could not upload report telemetry data.");
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-background animate-pulse" />;

  return (
    <div className="w-full space-y-10 text-foreground pb-12">
      <Container>
        <Toaster position="top-right" />

        {/* Primary Layout Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Main Content Pane */}
          <div className="lg:col-span-2 space-y-8">

            <article className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs relative">

              {/* 1. Featured Image Block */}
              {image && (
                <div className="w-full aspect-video bg-surface relative overflow-hidden select-none">
                  <Image
                    src={image}
                    alt={`Visual presenting: ${title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className={`object-cover object-center transition-all duration-700 ${isLocked ? "blur-lg scale-105 opacity-40 select-none pointer-events-none" : ""}`}
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {isPremiumLesson && (
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-md z-10">
                      <FiLock className="w-3 h-3" />
                      <span>Premium Content</span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6 sm:p-8 md:p-10 space-y-6">
                {/* Badges Layout row alignment */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-surface border border-border text-muted">
                    <FiTag className="w-3 h-3 text-secondary" />
                    {category}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border tracking-wide uppercase ${getToneStyles(emotionalTone)}`}>
                    <FiHeart className="w-3 h-3 fill-current" />
                    {emotionalTone}
                  </span>
                  <span className="text-xs text-muted font-medium ml-auto flex items-center gap-1">
                    <FiBookOpen /> {readingTime} min read
                  </span>
                </div>

                {/* Title Header Section */}
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                    {title}
                  </h1>
                </div>

                <hr className="border-border/60" />

                {/* Description Content Section with Paywall & Blur Protection */}
                <div className="relative min-h-62.5">
                  <AnimatePresence mode="wait">
                    {isLocked ? (
                      <motion.div
                        key="locked"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative w-full h-75 overflow-hidden rounded-2xl border border-border/40 bg-surface/10"
                      >
                        {/* Generates realistic structured blur layout underneath the block */}
                        <div className="absolute inset-0 p-6 space-y-4 filter blur-xl select-none pointer-events-none opacity-25">
                          <div className="h-4 bg-foreground rounded-sm w-11/12" />
                          <div className="h-4 bg-foreground rounded-sm w-full" />
                          <div className="h-4 bg-foreground rounded-sm w-10/12" />
                          <div className="h-4 bg-foreground rounded-sm w-4/5" />
                          <div className="h-4 bg-foreground rounded-sm w-9/12" />
                        </div>

                        {/* Paywall Container card overlay */}
                        <div className="absolute inset-0 flex items-center justify-center p-6 bg-linear-to-b from-transparent via-background/40 to-background/70 backdrop-blur-md">
                          <div className="text-center p-6 sm:p-8 bg-card/90 border border-border rounded-2xl max-w-md shadow-2xl relative z-10">
                            <div className="p-3 bg-primary/10 border border-primary/20 rounded-full text-primary mx-auto mb-4 w-12 h-12 flex items-center justify-center">
                              <FiLock className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold tracking-tight mb-2 text-foreground">Premium Strategy Log</h3>
                            <p className="text-xs sm:text-sm text-muted mb-6 max-w-xs mx-auto leading-relaxed">
                              Upgrade your membership plan to unlock full study layout access to this intelligence strategy report.
                            </p>
                            <Link
                              href="/pricing"
                              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl transition-colors shadow-xs"
                            >
                              <span>Upgrade Plan</span>
                              <FiArrowRight className="ml-2 w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="unlocked"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="prose prose-stone dark:prose-invert max-w-none"
                      >
                        <p className="text-foreground/90 text-base sm:text-lg leading-relaxed whitespace-pre-wrap tracking-wide">
                          {description || "No content summary is currently available for this entry."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 5. Interaction Buttons Segment Row Block */}
                <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLikeClick}
                      disabled={isLocked}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${isLiked
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-surface hover:bg-border/30 text-foreground border-border disabled:opacity-40 disabled:cursor-not-allowed"
                        }`}
                    >
                      {isLiked ? <AiFillHeart className="w-4 h-4 text-primary" /> : <AiOutlineHeart className="w-4 h-4" />}
                      <span>{currentLikesCount.toLocaleString()} Likes</span>
                    </button>

                    <button
                      onClick={handleBookmarkClick}
                      disabled={isLocked}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${isBookmarked
                        ? "bg-secondary/10 text-secondary border-secondary/20"
                        : "bg-surface hover:bg-border/30 text-foreground border-border disabled:opacity-40 disabled:cursor-not-allowed"
                        }`}
                    >
                      {isBookmarked ? <BiSolidLike className="w-4 h-4 text-secondary" /> : <BiLike className="w-4 h-4" />}
                      <span>{currentFavoritesCount.toLocaleString()} Favorites</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2.5 rounded-xl bg-surface hover:bg-border/40 border border-border text-muted hover:text-foreground transition-all"
                      title="Share Lesson"
                    >
                      <FiShare2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsReportOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-500 text-xs font-semibold border border-transparent hover:border-red-500/10 transition-all"
                    >
                      <FiAlertTriangle className="w-3.5 h-3.5" />
                      <span>Report Lesson</span>
                    </button>
                  </div>
                </div>

              </div>
            </article>

            {/* 6. Comment Feed Interactive Section (Protected via Premium Evaluation) */}
            <section className="bg-card border border-border rounded-3xl p-6 sm:p-8 relative overflow-hidden min-h-50">
              <div className="flex items-center gap-2 mb-6">
                <FiMessageSquare className="w-5 h-5 text-secondary" />
                <h2 className="text-xl font-bold tracking-tight">Discussion ({isLocked ? "?" : localComments.length})</h2>
              </div>

              {isLocked ? (
                <div className="absolute inset-x-0 bottom-0 top-15 flex flex-col items-center justify-center p-6 bg-linear-to-b from-transparent via-card/80 to-card backdrop-blur-xs text-center z-10">
                  <FiLock className="w-8 h-8 text-muted mb-2 animate-bounce" />
                  <h4 className="text-sm font-bold mb-1">Discussion Thread Locked</h4>
                  <p className="text-xs text-muted max-w-xs">
                    Premium membership is required to read community insights or share responses.
                  </p>
                </div>
              ) : (
                <>
                  <form onSubmit={handlePostComment} className="space-y-3">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={session?.user ? "Write a response or feedback view regarding this lesson..." : "Please log in to participate in the conversation."}
                      disabled={!session?.user}
                      rows={3}
                      className="w-full bg-background border border-border focus:border-primary rounded-2xl p-4 text-sm focus:outline-hidden resize-none transition-colors disabled:opacity-60 text-foreground"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!session?.user || !commentText.trim()}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-hover disabled:bg-muted/40 transition-colors"
                      >
                        <FiSend className="w-3.5 h-3.5" />
                        <span>Submit Comment</span>
                      </button>
                    </div>
                  </form>

                  <div className="divide-y divide-border pt-4 mt-2">
                    {localComments.map((commentItem, index) => (
                      <div key={commentItem._id || index} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start">
                        {commentItem?.authorImg && commentItem.authorImg !== "undefined" && commentItem.authorImg !== "" ? (
                          <div className="relative w-9 h-9 overflow-hidden rounded-full shrink-0 border border-border">
                            <Image loading="eager" src={commentItem.authorImg} alt="" fill sizes="36px" className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center shrink-0 border border-border text-muted">
                            <FiUser className="w-4 h-4" />
                          </div>
                        )}
                        <div className="bg-surface/40 p-3 rounded-2xl flex-1 border border-border/40 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold">{commentItem.authorName || "Anonymous User"}</h4>
                            <span className="text-[10px] text-muted">{formatDate(commentItem.createdAt)}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                            {commentItem.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>

          </div>

          {/* Sidebar Space */}
          <aside className="space-y-6 lg:sticky lg:top-6">

            {/* 3. Author Section Details Card */}
            <div className="bg-card border border-border rounded-3xl p-6 text-center space-y-4 shadow-xs">
              <span className="text-[10px] uppercase font-black tracking-widest text-muted block">Author Profile</span>
              <div className="flex justify-center">
                {authorImg ? (
                  <div className="relative w-20 h-20 overflow-hidden rounded-full shadow-xs">
                    <Image src={authorImg} alt={authorName} fill sizes="80px" className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center text-muted font-bold text-xl">
                    {authorName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">{authorName}</h3>
                <p className="text-[11px] text-muted font-mono mt-0.5">ID: {creatorId}</p>
              </div>
              <div className="bg-surface/50 rounded-xl p-2.5 border border-border/40">
                <span className="text-xs font-bold text-foreground">Total Lessons Created:</span>
                <span className="text-xs font-black text-primary font-mono"> {totalLessonsCreated} lessons</span>
              </div>
              <Link
                href={`/profile/${creatorId}`}
                className="inline-flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-surface border border-border hover:border-border-hover hover:bg-border/30 transition-all text-foreground"
              >
                <span>View Creator Space</span>
              </Link>
            </div>

            {/* 2 & 4. Lesson Metadata & Engagement Stats */}
            <div className="bg-card border border-border rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider">Lesson Information</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted flex items-center gap-1.5"><FiCalendar /> Created Date</span>
                  <span className="font-semibold font-mono">{formatDate(createdAt)}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted flex items-center gap-1.5"><FiRefreshCw /> Last Updated</span>
                  <span className="font-semibold font-mono">{formatDate(updatedAt)}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted flex items-center gap-1.5"><FiEye /> Views Count</span>
                  <span className="font-bold font-mono text-secondary">{viewsCount.toLocaleString()} Views</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted flex items-center gap-1.5"><FiLock /> Visibility</span>
                  <span className="px-2.5 py-0.5 rounded-sm font-bold bg-green-500/10 text-green-600 dark:text-green-400 uppercase text-[9px] tracking-widest border border-green-500/10">
                    {visibility}
                  </span>
                </div>
              </div>
            </div>

          </aside>

        </div>

        {/* similar lessons */}
        <div className="space-y-5 pt-10">
          <h1 className="text-xl font-bold">Similar Lessons: {similarLessons.length}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {similarLessons.length > 0 && similarLessons.map((similarLessonData, index) => (
              <LessonCard key={index} lesson={similarLessonData} />
            ))}
          </div>
        </div>

        {/* Flag Report Confirmation Popup Modal */}
        <AnimatePresence>
          {isReportOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsReportOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              />
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl z-10 text-foreground"
                role="dialog"
              >
                <div className="flex items-center gap-2 text-red-500 mb-4">
                  <FiAlertTriangle className="w-5 h-5" />
                  <h3 className="text-lg font-bold tracking-tight">Report Lesson Content</h3>
                </div>

                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="reason" className="text-xs font-bold text-muted block">Select Reason</label>
                    <select
                      id="reason"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full bg-background border border-border focus:border-red-500 rounded-xl p-2.5 text-sm focus:outline-hidden text-foreground"
                      required
                    >
                      <option value="">-- Choose Reason --</option>
                      <option value="copyright">Plagiarism / Intellectual Property Issue</option>
                      <option value="harassment">Hate Speech / Inappropriate language</option>
                      <option value="spam">Spam or Misleading Information</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="details" className="text-xs font-bold text-muted block">Additional Context (Optional)</label>
                    <textarea
                      id="details"
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      rows={3}
                      placeholder="Provide context explaining the issue with this entry..."
                      className="w-full bg-background border border-border focus:border-red-500 rounded-xl p-3 text-xs focus:outline-hidden resize-none text-foreground"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReportOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-border transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-xs"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}