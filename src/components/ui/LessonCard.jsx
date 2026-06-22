
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { FiBookmark, FiLock } from "react-icons/fi"; 
import { authClient } from "@/lib/auth-client"; 
import BaseButton from "./BaseButton";

const LessonCard = ({ lesson }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const { data: session } = authClient.useSession();

  // 1. Destructure fields using your actual database keys
  const {
    category = "Unclassified",
    title = "Untitled Insight Log",
    description = "",
    authorName = "Anonymous",
    authorImg = "",
    image = "",
    likesCount = 0,
    CommentsCount = 0,
    accessLevel = "Free", 
  } = lesson || {};

  // 2. Validate user tiers against content locks
  const isAdmin = session?.user?.role === "admin";
  const isPremiumUser = session?.user?.isPremium === true;
  const hasFullAccess = isAdmin || isPremiumUser;

  const isPremiumLesson = accessLevel === "Premium";

  // Lock evaluation logic remains perfectly guarded
  const isLocked = isMounted && isPremiumLesson && !hasFullAccess;

  // 3. Local state trackers for instant UI micro-interactions
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(likesCount);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLikeToggle = (e) => {
    e.preventDefault();
    if (isLocked) return; 
    setIsLiked(!isLiked);
    setLocalLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div
      className="relative bg-card border border-border hover:border-border-hover rounded-2xl p-4 flex flex-col justify-between h-full shadow-sm transition-all duration-300 group hover:-translate-y-1 overflow-hidden"
    >
      {/* Premium Blur Shield Overlay */}
      {isLocked && (
        <div
          className="absolute inset-0 z-20 backdrop-blur-[6px] bg-background/60 flex flex-col items-center justify-center p-4 text-center transition-all duration-300"
        >
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-full text-primary mb-3 shadow-sm animate-pulse">
            <FiLock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-foreground tracking-tight">Premium Insight</h4>
          <p className="text-[11px] text-muted-foreground max-w-45 mt-1 leading-normal">
            Upgrade your membership to unlock this strategy log.
          </p>
          <BaseButton
            as="link"
            href={'/pricing'}
            animated
            animatedSpanOne={'animate-ping'}
            className="mt-4 text-xs font-semibold px-4 py-1.5 bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg shadow-xs transition-colors"
          >
            Unlock Lesson
          </BaseButton>
        </div>
      )}

      {/* Main Lesson Card Body Wrapper */}
      <div className={isLocked ? "select-none pointer-events-none opacity-40 blur-[1px]" : ""}>
        {/* Card Artwork Wrapper */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface mb-4">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              unoptimized 
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority
              className="object-fit transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
              No Media Asset Connected
            </div>
          )}
        </div>

        {/* Dynamic Category Tag */}
        <span className="inline-block text-xs px-2.5 py-0.5 shadow-sm rounded-full mb-3 tracking-wide text-secondary bg-background font-medium">
          {category}
        </span>

        {/* Title & Optional Description Snippet */}
        <h3 className="text-base font-semibold text-foreground line-clamp-1 leading-snug tracking-tight group-hover:text-secondary transition-colors duration-200">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Footer Area: Author and Performance Metrics */}
      <div className={`space-y-4 pt-4 ${isLocked ? "select-none pointer-events-none opacity-40 blur-[1px]" : ""}`}>
        {/* Author Avatar Group */}
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center">
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
              <span className="text-[10px] font-black text-primary uppercase">
                {authorName.charAt(0)}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{authorName}</span>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center justify-between text-muted-foreground text-xs font-medium pt-2 border-t border-border/40">
          <div className="flex items-center gap-4">
            {/* Likes Trigger Field */}
            <button
              onClick={handleLikeToggle}
              disabled={isLocked}
              className={`flex items-center gap-1.5 transition-colors focus:outline-none ${isLiked ? "text-red-500" : "hover:text-red-500"}`}
            >
              {isLiked ? <AiFillHeart className="w-4 h-4 text-red-500" /> : <AiOutlineHeart className="w-4 h-4" />}
              <span>{localLikes}</span>
            </button>

            {/* Comments Counter Display */}
            <button disabled={isLocked} className="flex items-center gap-1.5 hover:text-success transition-colors focus:outline-none">
              <BiCommentDetail className="w-4 h-4" />
              <span>{CommentsCount}</span>
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => !isLocked && setIsBookmarked(!isBookmarked)}
            disabled={isLocked}
            className={`transition-colors p-1 rounded-md hover:bg-surface focus:outline-none ${isBookmarked ? "text-amber-500" : "hover:text-amber-500"}`}
          >
            <FiBookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-500 stroke-amber-500" : ""}`} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default LessonCard;