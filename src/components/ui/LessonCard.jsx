'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { FiBookmark, FiLock, FiArrowRight, FiCalendar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const LessonCard = ({ lesson, onLikeToggle, onBookmarkToggle }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const { data: session } = authClient.useSession();

  const {
    _id = "",
    title = "Untitled Insight Log",
    description = "",
    authorName = "Anonymous",
    authorImg = "",
    image = "",
    likesCount = 0,
    CommentsCount = 0,
    bookmarkedByCount = 0,
    category = "Unclassified",
    emotionalTone = "Neutral",
    accessLevel = "Free",
    createdAt = new Date().toISOString(),
  } = lesson || {};

  const isAdmin = session?.user?.role === "admin";
  const isPremiumUser = session?.user?.isPremium === true;
  const hasFullAccess = isAdmin || isPremiumUser;
  const isPremiumLesson = accessLevel === "Premium";

  const isLocked = isMounted && isPremiumLesson && !hasFullAccess;

  const [isLiked, setIsLiked] = useState(false);
  const [likeOffset, setLikeOffset] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [FavoriteOffset, setFavoriteOffset] = useState(0);

  const currentLikesCount = likesCount + likeOffset;
  const currentFavoritesCount = bookmarkedByCount + FavoriteOffset;

  const [prevLikesCount, setPrevLikesCount] = useState(likesCount);
  if (likesCount !== prevLikesCount) {
    setPrevLikesCount(likesCount);
    setLikeOffset(0);
  }

  // ❤️ Like Button Logic (Real-time atomic array toggle)
  const handleLikeClick = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    if (!session?.user) {
      toast.error("Please log in to like");
      return;
    }

    // 1. Optimistic UI update (Instant execution)
    const nextLikedState = !isLiked;
    setIsLiked(nextLikedState);
    setLikeOffset((prev) => (nextLikedState ? prev + 1 : prev - 1));

    try {
      // 2. Dispatch data update to MongoDB via server routing
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${_id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user.id || session?.user._id }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error();

      {
        nextLikedState ? toast.success("Lesson liked ❤️") : toast.success("Like removed");
      }
    } catch (error) {
      // 3. Fallback rollback state if network streaming breaks
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

    // 1. Optimistic UI update (Instant execution)
    const nextFavoriteState = !isBookmarked;
    setIsBookmarked(nextFavoriteState);
    setFavoriteOffset((prev) => (nextFavoriteState ? prev + 1 : prev - 1));

    try {
      // 2. Dispatch data update to MongoDB via server routing
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${_id}/favorite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user.id || session?.user._id }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error();

      {
        nextFavoriteState ? toast.success("Lesson Favorites bookmark") : toast.error("Favorites bookmark removed")
      }
    } catch (error) {
      // 3. Fallback rollback state if network streaming breaks
      setIsLiked(!nextFavoriteState);
      setLikeOffset((prev) => (nextFavoriteState ? prev - 1 : prev + 1));
      toast.error("Network sync error. Could not process like action.");
    }
  };

  const getFormattedDate = () => {
    try {
      return new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      return "";
    }
  };

  return (
    <div className="relative bg-card border border-border hover:border-border-hover rounded-2xl p-4 flex flex-col justify-between h-full shadow-xs transition-all duration-300 group hover:-translate-y-1 overflow-hidden">

      {/* Premium Lock Overlay */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "linear" }}
            className="absolute inset-0 z-20 backdrop-blur-md bg-background/90 dark:bg-[#1E1E1E]/90 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.02 }}
              className="p-3 bg-primary/10 border border-primary/20 rounded-full text-primary mb-3 shadow-xs animate-pulse"
            >
              <FiLock className="w-6 h-6" aria-hidden="true" />
            </motion.div>

            <motion.h4
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.08 }}
              className="text-base font-bold text-foreground tracking-tight"
            >
              Premium Insight
            </motion.h4>

            <motion.p
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.12 }}
              className="text-xs text-muted max-w-52.5 mt-1.5 leading-normal font-medium"
            >
              Upgrade your membership to unlock this strategy log.
            </motion.p>

            <motion.div
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.16 }}
              className="w-full max-w-40"
            >
              <Link
                href="/pricing"
                className="mt-4 w-full inline-block text-center text-xs font-bold px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-xl shadow-xs transition-colors"
              >
                Unlock Lesson
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col h-full justify-between" aria-hidden={isLocked ? "true" : "false"}>
        <div>
          {/* Image Area */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface mb-4 border border-border/20">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center text-xs text-muted font-medium">
                No Media Connected
              </div>
            )}

            <div className="absolute top-3 right-3 z-10 select-none">
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md shadow-xs block border ${isPremiumLesson
                  ? "bg-primary text-white border-transparent"
                  : "bg-card border-border text-foreground"
                }`}>
                {accessLevel}
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3 select-none">
            <span className="inline-block text-[11px] px-2.5 py-0.5 rounded-full tracking-wide text-secondary bg-secondary/10 font-bold border border-secondary/5">
              {category}
            </span>
            {emotionalTone && (
              <span className="inline-block text-[11px] px-2.5 py-0.5 rounded-full tracking-wide text-muted bg-surface border border-border font-semibold">
                {emotionalTone}
              </span>
            )}
          </div>

          {/* Title & Description */}
          <h3 className="text-base font-bold text-foreground line-clamp-1 leading-snug tracking-tight group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>

          {description && (
            <p className="text-xs text-muted line-clamp-2 mt-2 leading-relaxed font-medium">
              {description}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-muted mt-3 mb-4 select-none">
            <FiCalendar className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
            <time className="text-[11px] font-bold tracking-wide" dateTime={createdAt}>
              {getFormattedDate()}
            </time>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-4 pt-3 border-t border-border/60">
          {/* Author */}
          <div className="flex items-center gap-2.5 select-none">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border bg-surface flex items-center justify-center shrink-0">
              {authorImg ? (
                <Image
                  src={authorImg}
                  alt={authorName}
                  fill
                  unoptimized
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                  {authorName.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-foreground truncate">{authorName}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 text-muted text-xs font-medium pt-1">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleLikeClick}
                disabled={isLocked}
                tabIndex={isLocked ? -1 : 0}
                aria-label={`Like this entry. Current count is ${currentLikesCount}`}
                className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors focus:outline-hidden ${isLiked
                    ? "text-primary bg-primary/5 font-bold"
                    : "hover:text-primary hover:bg-surface font-semibold"
                  }`}
              >
                <AiFillHeart className={`w-4 h-4 ${currentLikesCount ? "fill-primary stroke-primary" : ""}`}  aria-hidden="true" />
                <span className="text-[11px] tabular-nums">{currentLikesCount}</span>
              </button>

              <div className="flex items-center gap-1.5 py-1 px-1.5 font-semibold text-muted/90 select-none">
                <BiCommentDetail className="w-4 h-4" aria-hidden="true" />
                <span className="text-[11px] tabular-nums">{CommentsCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmarkClick}
                disabled={isLocked}
                tabIndex={isLocked ? -1 : 0}
                aria-label={isBookmarked ? "Remove from saved" : "Save to favorites"}
                className={`transition-colors p-1.5 rounded-lg border border-transparent focus:outline-hidden ${currentFavoritesCount
                    ? "text-secondary bg-secondary/5"
                    : "hover:text-secondary hover:bg-surface"
                  }`}
              >
                <FiBookmark className={`w-4.5 h-4.5 ${currentFavoritesCount ? "fill-secondary stroke-secondary" : ""}`} aria-hidden="true" />
              </button>

              <Link
                href={`/lessons/${_id}`}
                disabled={isLocked}
                tabIndex={isLocked ? -1 : 0}
                className="inline-flex items-center gap-1 text-[11px] font-bold bg-surface hover:bg-border/40 text-foreground border border-border px-3 py-1.5 rounded-lg transition-all focus:outline-hidden select-none"
              >
                <span>Details</span>
                <FiArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;