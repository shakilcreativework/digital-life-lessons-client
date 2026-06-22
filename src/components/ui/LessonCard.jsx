"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { FiBookmark, FiLock, FiArrowRight, FiCalendar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import BaseButton from "./BaseButton";

const LessonCard = ({ lesson, onLikeToggle, onBookmarkToggle }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const { data: session } = authClient.useSession();

  // 1. Destructure core properties safely from the server payload
  const {
    _id = "",
    title = "Untitled Insight Log",
    description = "",
    authorName = "Anonymous",
    authorImg = "",
    image = "",
    likesCount = 0,
    CommentsCount = 0,
    category = "Unclassified",
    emotionalTone = "Neutral",
    accessLevel = "Free",
    createdAt = new Date().toISOString(),
  } = lesson || {};

  // 2. Validate security credentials and configuration states
  const isAdmin = session?.user?.role === "admin";
  const isPremiumUser = session?.user?.isPremium === true;
  const hasFullAccess = isAdmin || isPremiumUser;
  const isPremiumLesson = accessLevel === "Premium";
  
  // Guard visibility mechanics carefully across client builds
  const isLocked = isMounted && isPremiumLesson && !hasFullAccess;

  // 3. Optimized Local State Management (Fixes Synchronous Cascading Renders)
  const [isLiked, setIsLiked] = useState(false);
  const [likeOffset, setLikeOffset] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Derive final value on-the-fly during render pass to prevent sync cycle traps
  const currentLikesCount = likesCount + likeOffset;

  // Track parent changes during reconciliation instead of using useEffect loops
  const [prevLikesCount, setPrevLikesCount] = useState(likesCount);
  if (likesCount !== prevLikesCount) {
    setPrevLikesCount(likesCount);
    setLikeOffset(0); // Reset interactive local adjustments on upstream data refreshes
  }

  const handleLikeClick = (e) => {
    e.preventDefault();
    if (isLocked) return;
    
    const nextLikedState = !isLiked;
    setIsLiked(nextLikedState);
    setLikeOffset((prev) => (nextLikedState ? prev + 1 : prev - 1));

    if (onLikeToggle) {
      onLikeToggle(_id, nextLikedState);
    }
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    if (isLocked) return;

    const nextBookmarkState = !isBookmarked;
    setIsBookmarked(nextBookmarkState);

    if (onBookmarkToggle) {
      onBookmarkToggle(_id, nextBookmarkState);
    }
  };

  // Safe formatting wrapper designed to prevent server-side string serialization mismatches
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
      
      {/* Dynamic Premium Access Shield Layer */}
      <AnimatePresence>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "linear" }}
            className="absolute inset-0 z-20 backdrop-blur-md bg-[#FAF8F3]/75 dark:bg-[#1E1E1E]/75 flex flex-col items-center justify-center p-6 text-center"
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
              <BaseButton
                as="link"
                href="/pricing"
                animated
                animatedSpanOne="animate-ping"
                className="mt-4 w-full text-xs font-bold px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                Unlock Lesson
              </BaseButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Component Core Content Layout Section */}
      <div 
        className="flex flex-col h-full justify-between"
        aria-hidden={isLocked ? "true" : "false"}
      >
        <div>
          {/* Layout Container for Graphic Assets */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface mb-4 border border-border/20">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority
                className="object-fit transition-transform duration-500 group-hover:scale-103"
              />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center text-xs text-muted font-medium">
                No Media Connected
              </div>
            )}
            
            {/* Context Badge Overlays */}
            <div className="absolute top-3 right-3 z-10 select-none">
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md shadow-xs block border ${
                isPremiumLesson 
                  ? "bg-primary text-white border-transparent" 
                  : "bg-card border-border text-foreground"
              }`}>
                {accessLevel}
              </span>
            </div>
          </div>

          {/* Dynamic Badges Block */}
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

          {/* Core Text & Metadata Elements */}
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

        {/* Action Controls Alignment Row */}
        <div className="space-y-4 pt-3 border-t border-border/60">
          
          {/* Identity/Author Branding Frame */}
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

          {/* Metrics & Interaction Matrix Elements */}
          <div className="flex items-center justify-between gap-2 text-muted text-xs font-medium pt-1">
            <div className="flex items-center gap-2.5">
              
              {/* Dynamic Action Trigger: Upvote / Like Toggle */}
              <button
                onClick={handleLikeClick}
                disabled={isLocked}
                tabIndex={isLocked ? -1 : 0}
                aria-label={`Like this entry. Core current evaluation aggregate is ${currentLikesCount}`}
                className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors focus:outline-hidden ${
                  isLiked 
                    ? "text-primary bg-primary/5 font-bold" 
                    : "hover:text-primary hover:bg-surface font-semibold"
                }`}
              >
                {isLiked ? (
                  <AiFillHeart className="w-4 h-4 text-primary" aria-hidden="true" />
                ) : (
                  <AiOutlineHeart className="w-4 h-4" aria-hidden="true" />
                )}
                <span className="text-[11px] tabular-nums">{currentLikesCount}</span>
              </button>

              {/* Reflection Indicator Metrics Counter */}
              <div 
                className="flex items-center gap-1.5 py-1 px-1.5 font-semibold text-muted/90 select-none"
                aria-label={`This entry has collected ${CommentsCount} comments`}
              >
                <BiCommentDetail className="w-4 h-4" aria-hidden="true" />
                <span className="text-[11px] tabular-nums">{CommentsCount}</span>
              </div>
            </div>

            {/* Path Links and Secondary Tools Matrix */}
            <div className="flex items-center gap-2">
              
              {/* Interactive Tooling Badge: Bookmark Trigger */}
              <button
                onClick={handleBookmarkClick}
                disabled={isLocked}
                tabIndex={isLocked ? -1 : 0}
                aria-label={isBookmarked ? "Remove this strategy log from saved index" : "Save this insight strategy item into your local library index"}
                className={`transition-colors p-1.5 rounded-lg border border-transparent focus:outline-hidden ${
                  isBookmarked 
                    ? "text-secondary bg-secondary/5" 
                    : "hover:text-secondary hover:bg-surface"
                }`}
              >
                <FiBookmark className={`w-4.5 h-4.5 ${isBookmarked ? "fill-secondary stroke-secondary" : ""}`} aria-hidden="true" />
              </button>

              {/* Primary Content Target Anchor Trigger */}
              <Link
                href={`/explore/${_id}`}
                disabled={isLocked}
                tabIndex={isLocked ? -1 : 0}
                aria-label={`Open interactive dashboard breakdown view for lesson titled: ${title}`}
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