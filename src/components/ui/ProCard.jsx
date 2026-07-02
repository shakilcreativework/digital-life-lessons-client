'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const ProCard = ({ item, type }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative bg-card border border-border p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg shadow-sm"
    >
      {/* Dynamic Image Container */}
      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-surface shrink-0">
        <Image
          src={item.img || item.image || "/placeholder.jpg"}
          alt={item.name || item.title}
          fill
          sizes="(max-width: 768px) 56px, 56px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Text Info */}
      <div className="grow min-w-0">
        <h4 className="font-bold text-foreground text-sm truncate leading-tight group-hover:text-primary transition-colors">
          {item.name || item.title}
        </h4>
        <p className="text-xs text-muted mt-1 font-medium bg-surface/50 inline-block px-2 py-0.5 rounded-md">
          {type === 'contributor' ? `${item.count} Lessons` : `${item.bookmarkedByCount} Saves`}
        </p>
      </div>

      {/* Decorative Arrow */}
      <div className="text-muted/20 group-hover:text-primary transition-colors">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  );
};