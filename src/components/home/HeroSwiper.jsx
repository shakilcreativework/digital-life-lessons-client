"use client";

// Swiper Components
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper Modules
import { Autoplay, Pagination } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";

import BaseButton from "../ui/BaseButton";
import { IoArrowForwardOutline } from "react-icons/io5";
import Image from "next/image";

// ======================================================
// Hero Slider Component
// ======================================================
// Displays 3 community-focused themed banners matching the upload reference:
// - Two-column split layout (Text on left, Illustration/Image on right)
// - Uses custom Tailwind CSS v4 variables for effortless light/dark support
// - Dynamic Member metrics stack
// ======================================================

const HeroSlider = () => {
    // Configured content using your theme variables safely
    const sliderData = [
  {
    id: 1,
    badge: "✨ A community that inspires growth",
    heading: (
      <>
        Real stories. <br /> Life lessons. <br />{" "}
        <span className="bg-[#facc15] dark:bg-amber-500 text-[#1b1b1b] px-2 inline-block rounded-md">
          Lasting impact.
        </span>
      </>
    ),
    description:
      "Digital Life Lessons is a community where people share real experiences, personal growth stories, and the lessons that changed everything.",
    primaryBtn: "Explore Lessons",
    secondaryBtn: "Join the Community",
    // VISUAL MEANING: An open journal/book with growing elements, perfectly matching "Real stories & life lessons".
    ImageSrc: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    membersCount: "50K+",
    membersLabel: "Members growing together",
  },
  {
    id: 2,
    badge: "🌱 Shared wisdom, better choices",
    heading: (
      <>
        Every mistake <br /> is a guide <br />{" "}
        <span className="bg-secondary text-white px-2 inline-block rounded-md">
          For tomorrow.
        </span>
      </>
    ),
    description:
      "Skip the trial and error. Read honest reflections written by everyday individuals navigating career transitions, mental health, and relationships.",
    primaryBtn: "Read Reflections",
    secondaryBtn: "Write Your Story",
    // VISUAL MEANING: A clean, conceptual maze or crossroads graphic, symbolizing navigating "mistakes, career transitions, and life choices".
    ImageSrc: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
    membersCount: "120+",
    membersLabel: "Daily stories submitted",
  },
  {
    id: 3,
    badge: "🤝 You are not alone on this journey",
    heading: (
      <>
        Connect through <br /> vulnerable and <br />{" "}
        <span className="bg-primary text-white px-2 inline-block rounded-md">
          True moments.
        </span>
      </>
    ),
    description:
      "Find comfort in shared paths. Engage in meaningful perspectives that remind us that every breakdown is a pathway to a massive breakthrough.",
    primaryBtn: "Discover Voices",
    secondaryBtn: "Explore Spaces",
    // VISUAL MEANING: Interlocking hands/community geometric mural design, perfectly matching "You are not alone on this journey".
    ImageSrc: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
    membersCount: "4.9/5",
    membersLabel: "Community trust rating",
  },
];

    return (
        <section className="relative w-full h-fit bg-background transition-colors duration-300 py-10 md:py-14">
            <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                className="w-full min-h-[85vh] lg:h-[90vh]"
            >
                {sliderData.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="max-w-7xl mx-auto px-6 md:px-12 h-full md:h-fit items-center grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 pb-16 lg:py-0">

                            {/* Left Column: Typography Content */}
                            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left order-2 lg:order-1">

                                {/* Badge component utilizing surface token */}
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted shadow-xs transition">
                                        {slide.badge}
                                    </span>
                                </div>

                                {/* Main Heading utilizing foreground token */}
                                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.15]  transition-colors">
                                    {slide.heading}
                                </h1>

                                {/* Paragraph Description */}
                                <p className="text-base md:text-lg text-muted max-w-xl font-normal leading-relaxed transition-colors">
                                    {slide.description}
                                </p>

                                {/* Call To Action Row */}
                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                    <BaseButton
                                        animated
                                        animatedSpanOne={'animate-spin'}
                                        text={slide.primaryBtn}
                                        className="rounded-xl bg-primary text-white font-medium hover:bg-primary-hover transition-all px-6 py-3 shadow-md"
                                        rightIcon={<IoArrowForwardOutline />}
                                    />

                                    <button className="text-sm font-bold text-foreground underline underline-offset-4 decoration-2 hover:text-muted transition-colors px-2 py-2">
                                        {slide.secondaryBtn}
                                    </button>
                                </div>

                                {/* Social Proof / Metrics Avatar Stack */}
                                <div className="flex items-center gap-3 pt-6 border-t border-border max-w-md transition-colors">
                                    <div className="flex -space-x-3 overflow-hidden">
                                        <Image
                                            width={100}
                                            height={100}
                                            className="inline-block h-9 w-9 rounded-full ring-2 ring-background object-cover transition-all"
                                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                                            alt="User"
                                        />
                                        <Image
                                            width={100}
                                            height={100}
                                            className="inline-block h-9 w-9 rounded-full ring-2 ring-background object-cover transition-all"
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                                            alt="User"
                                        />
                                        <Image
                                            width={100}
                                            height={100}
                                            className="inline-block h-9 w-9 rounded-full ring-2 ring-background object-cover transition-all"
                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                                            alt="User"
                                        />
                                        <Image
                                            width={100}
                                            height={100}
                                            className="inline-block h-9 w-9 rounded-full ring-2 ring-background object-cover transition-all"
                                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                                            alt="User"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground leading-none transition-colors">
                                            {slide.membersCount}
                                        </p>
                                        <p className="text-xs text-muted font-medium mt-0.5 transition-colors">
                                            {slide.membersLabel}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Right Column: Canvas Image Frame container using Surface color token */}
                            <div className="lg:col-span-5 relative w-full h-80 sm:h-100 lg:h-[80vh] flex items-center justify-center order-1 lg:order-2">
                                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm lg:shadow-none bg-surface transition-colors">
                                    <Image
                                        src={slide.ImageSrc}
                                        alt="Life Lessons Canvas Showcase"
                                        width={500}
                                        height={500}
                                        priority
                                        className="w-full h-full object-cover dark:opacity-85 dark:contrast-[1.1]"
                                    />
                                </div>
                            </div>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Global overrides updated to handle light/dark mode dots dynamically */}
            <style jsx global>
                {`
                .swiper-pagination-bullet {
                background: var(--muted) !important;
                opacity: 0.4;
                }
                .swiper-pagination-bullet-active {
                background: var(--primary) !important;
                opacity: 1 !important;
                width: 24px !important;
                border-radius: 6px !important;
                transition: all 0.3s ease;
                }
                `}
            </style>
        </section>
    );
};

export default HeroSlider;