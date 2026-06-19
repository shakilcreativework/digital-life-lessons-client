"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";

// Swiper Structural Styles
import "swiper/css";
import LessonCard from "../ui/LessonCard";

const FeaturedLessons = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Content population mapped perfectly to match your 4 uploaded images data
  const lessonsData = [
    {
      id: 1,
      category: "Mindset",
      title: "How I Rebuilt My Confidence from Zero",
      authorName: "Alex R.",
      authorImg: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
      ImageSrc: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
      likes: "1.2K",
      comments: "128",
      badgeColor: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40"
    },
    {
      id: 2,
      category: "Career",
      title: "I Quit My Job to Find Purpose",
      authorName: "Maya S.",
      authorImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      ImageSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      likes: "2.4K",
      comments: "210",
      badgeColor: "text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-950/40"
    },
    {
      id: 3,
      category: "Growth",
      title: "The 5 Habits That Changed My Life",
      authorName: "James T.",
      authorImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
      ImageSrc: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80",
      likes: "3.1K",
      comments: "301",
      badgeColor: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40"
    },
    {
      id: 4,
      category: "Relationships",
      title: "Lessons I Learned from Letting Go",
      authorName: "Priya K.",
      authorImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      ImageSrc: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80",
      likes: "1.8K",
      comments: "146",
      badgeColor: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/40"
    }
  ];

  return (
    <section className="bg-background py-16 px-6 md:px-12 w-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Header Layout Component Area */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight plus-jakarta">
            Featured Lessons
          </h2>
          
          <button className="text-sm font-bold text-foreground underline underline-offset-4 decoration-2 hover:text-primary transition-all">
            View all lessons &rarr;
          </button>
        </div>

        {/* Navigation Arrows positioned contextually relative to the full slider */}
        <div className="absolute top-1/2 -left-4 md:-left-6 z-20 -translate-y-1/2">
          <button
            ref={prevRef}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground hover:bg-surface hover:text-primary transition-all disabled:opacity-40"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute top-1/2 -right-4 md:-right-6 z-20 -translate-y-1/2">
          <button
            ref={nextRef}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground hover:bg-surface hover:text-primary transition-all disabled:opacity-40"
          >
            <HiOutlineArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Responsive Multi-Grid Slider Implementation */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          breakpoints={{
            640: { slidesPerView: 2 }, // Mobile landscape / Small tablets
            1024: { slidesPerView: 3 }, // Medium Laptops
            1280: { slidesPerView: 4 }, // Desktop displays match exactly 4 visible items
          }}
          className="w-full px-1! py-4"
        >
          {lessonsData.map((lesson) => (
            <SwiperSlide key={lesson.id}>
              <LessonCard
                category={lesson.category}
                title={lesson.title}
                authorName={lesson.authorName}
                authorImg={lesson.authorImg}
                ImageSrc={lesson.ImageSrc}
                likes={lesson.likes}
                comments={lesson.comments}
                badgeColorClass={lesson.badgeColor}
              />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default FeaturedLessons;