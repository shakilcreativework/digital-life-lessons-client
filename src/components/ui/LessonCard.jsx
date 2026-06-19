"use client";

import Image from "next/image";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { FiBookmark } from "react-icons/fi";

// Reusable card accepting static props mimicking the UI layout
const LessonCard = ({
  category,
  title,
  authorName,
  authorImg,
  ImageSrc,
  likes,
  comments,
  badgeColorClass = "text-muted font-medium bg-background py-1"
}) => {
  return (
    <div className="bg-card border border-border hover:border-border-hover rounded-2xl p-4 flex flex-col justify-between h-100 shadow-sm transition-all duration-300 group hover:-translate-y-1">

      <div>
        {/* Card Artwork Wrapper */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface mb-4">
          <Image
            src={ImageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Dynamic Category Tag */}
        <span className={`inline-block text-xs px-2.5 py-0.5 shadow-xs border border-border rounded-full mb-3 tracking-wide ${badgeColorClass}`}>
          {category}
        </span>

        {/* Title */}
        <h3 className="text-base font-medium text-foreground line-clamp-1 leading-snug tracking-tight group-hover:text-muted transition-colors">
          {title}
        </h3>
      </div>

      {/* Footer Area: Author and Performance Metrics */}
      <div className="space-y-4 pt-4">

        {/* Author Avatar Group */}
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border">
            <Image
              src={authorImg}
              alt={authorName}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <span className="text-xs font-semibold text-muted">{authorName}</span>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center justify-between text-muted text-xs font-medium pt-1">
          <div className="flex items-center gap-4">

            {/* Likes */}
            <button className="flex items-center gap-1.5 hover:text-danger transition-colors">
              <AiOutlineHeart className="w-4 h-4" />
              <span>{likes}</span>
            </button>

            {/* Comments */}
            <button className="flex items-center gap-1.5 hover:text-success transition-colors">
              <BiCommentDetail className="w-4 h-4" />
              <span>{comments}</span>
            </button>
          </div>

          {/* Bookmark Button */}
          <button className="hover:text-secondary transition-colors p-1 rounded-md hover:bg-surface">
            <FiBookmark className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default LessonCard;