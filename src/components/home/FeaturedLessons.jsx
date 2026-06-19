"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";

// Swiper Structural Styles
import "swiper/css";
import LessonCard from "../ui/LessonCard";

const FeaturedLessons = () => {
    const lessonsData = [
        {
            id: 1,
            category: "Mindset",
            title: "How I Rebuilt My Confidence from Zero",
            authorName: "Alex R.",
            authorImg: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
            ImageSrc: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=600&q=80", // Ocean Sunrise
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
            ImageSrc: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80", // Fine Art / Floral Mood
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
            ImageSrc: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", // Modern Architecture / Design
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
            ImageSrc: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80", // Friends / Group at Sunset
            likes: "1.8K",
            comments: "146",
            badgeColor: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/40"
        },
        {
            id: 5,
            category: "Mindset",
            title: "Overcoming the Fear of Critical Failure",
            authorName: "Marcus V.",
            authorImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
            ImageSrc: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80", // Person meditating on misty mountain top
            likes: "942",
            comments: "64",
            badgeColor: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40"
        },
        {
            id: 6,
            category: "Career",
            title: "Mastering Creative Work-Life Balance",
            authorName: "Elena Rostova",
            authorImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80",
            ImageSrc: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80", // Workspace with laptop, notebook, coffee
            likes: "4.2K",
            comments: "512",
            badgeColor: "text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-950/40"
        },
        {
            id: 7,
            category: "Growth",
            title: "The Ultimate Framework for Micro-Learning",
            authorName: "David K.",
            authorImg: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80",
            ImageSrc: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80", // Calm desk library with open books
            likes: "2.8K",
            comments: "198",
            badgeColor: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40"
        },
        {
            id: 8,
            category: "Relationships",
            title: "How to Build Unshakeable Boundaries",
            authorName: "Sarah J.",
            authorImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
            ImageSrc: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80", // Happy people walking together laughing outdoors
            likes: "1.5K",
            comments: "89",
            badgeColor: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/40"
        }
    ];

    return (
        <section className="bg-background py-16 px-6 md:px-12 w-full transition-colors duration-300">
            <div className="relative px-6">

                {/* Header Layout */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                        Featured Lessons
                    </h2>

                    <button className="text-sm font-medium text-muted underline underline-offset-4 decoration-2 hover:text-foreground transition-all">
                        View all lessons &rarr;
                    </button>
                </div>

                {/* Custom Navigation Arrows positioned correctly inside the parent wrapper padding */}
                <div className="absolute top-1/2 left-0 z-20 -translate-y-1/2">
                    <button
                        className="featured-prev-btn w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground hover:bg-surface hover:text-primary transition-all disabled:opacity-40"
                        aria-label="Previous slide"
                    >
                        <HiOutlineArrowLeft className="w-5 h-5" />
                    </button>
                </div>

                <div className="absolute top-1/2 right-0 z-20 -translate-y-1/2">
                    <button
                        className="featured-next-btn w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground hover:bg-surface hover:text-primary transition-all disabled:opacity-40"
                        aria-label="Next slide"
                    >
                        <HiOutlineArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Swiper Slider Configuration */}
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    navigation={{
                        prevEl: ".featured-prev-btn",
                        nextEl: ".featured-next-btn",
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 }, // Shows exactly 4 full cards safely inside the boundary layout 
                    }}
                    // 2. Changed "!overflow-visible" to standard default overflow configuration
                    className="w-full"
                >
                    {lessonsData.map((lesson) => (
                        <SwiperSlide key={lesson.id} className="h-auto">
                            <LessonCard
                                category={lesson.category}
                                title={lesson.title}
                                authorName={lesson.authorName}
                                authorImg={lesson.authorImg}
                                ImageSrc={lesson.ImageSrc}
                                likes={lesson.likes}
                                comments={lesson.comments}
                                // badgeColorClass={lesson.badgeColor}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                
            </div>
        </section>
    );
};

export default FeaturedLessons;