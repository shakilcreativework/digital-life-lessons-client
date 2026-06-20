"use client";

import { motion, useReducedMotion } from "framer-motion";
import Container from "../shared/Container";

// 1. Static Benefit Data Layout Schema
const BENEFIT_ITEMS = [
    {
        id: "benefit-1",
        title: "Preserve Personal Wisdom",
        description: "Don't let profound personal breakthroughs fade away over time. Document your unique insights to build a reliable playbook for your life's challenges.",
        accentColor: "border-t-primary",
        iconColor: "text-primary",
        // Inline SVG Configuration for zero layout shift
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
        )
    },
    {
        id: "benefit-2",
        title: "Mindful Reflection",
        description: "Taking a moment to step back and articulate your experiences transforms raw emotional events into clear, actionable intelligence for the future.",
        accentColor: "border-t-secondary",
        iconColor: "text-secondary",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a3 3 0 1 0-3-3M12 12.75a3 3 0 1 1 3-3m-3 15c5.523 0 10-4.477 10-10s-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10Z" />
            </svg>
        )
    },
    {
        id: "benefit-3",
        title: "Community Growth",
        description: "Share your public realizations to help peers bypass common life pitfalls, building an open, accessible network of collective human wisdom.",
        accentColor: "border-t-primary",
        iconColor: "text-primary",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.969-1.584A6.005 6.005 0 0 1 12 15a15 15 0 0 1 6 3.72ZM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6.57 1a8.959 8.959 0 0 1 4.5 1.125A3 3 0 0 0 19 11v-1.5a3 3 0 0 0-3-3 3 3 0 0 0-3 3v.681A8.951 8.951 0 0 1 12 7c-1.74 0-3.35.495-4.714 1.348A3 3 0 0 0 5 11v1.5a3 3 0 0 0 4.5 2.625" />
            </svg>
        )
    },
    {
        id: "benefit-4",
        title: "Track Lifelong Progress",
        description: "Look back at your entries over time to watch your personal growth, look for patterns in your choices, and see how your perspective shifts over the years.",
        accentColor: "border-t-secondary",
        iconColor: "text-secondary",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
        )
    }
];

export default function WhyLearning({ className = "", animated = true }) {
    // Hook detecting system settings for users who prefer minimal movement
    const shouldReduceMotion = useReducedMotion();

    // Animation Variant Declarations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: shouldReduceMotion || !animated ? 0 : 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: shouldReduceMotion || !animated ? 0 : 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    return (
        <section
            id="why-learning-matters"
            className={`py-20 md:py-24 transition-colors duration-300 ${className}`}
            aria-labelledby="section-title"
        >
            <Container>
                {/* Structural Header Wrapper Component */}
                <div className="max-w-3xl mb-12 md:mb-16">
                    <p className="text-sm font-semibold tracking-wider uppercase text-secondary mb-2">
                        Core Philosophy
                    </p>
                    <h2
                        id="section-title"
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                    >
                        Why Learning From Life Matters
                    </h2>
                    <div className="h-1 w-20 bg-secondary mt-4 mb-6 rounded-full" />
                    <p className="text-base sm:text-lg text-muted leading-relaxed">
                        Your life experiences are your greatest asset. Keeping a record of what you learn helps turn past challenges into wisdom for your future decisions.
                    </p>
                </div>

                {/* Main Structural Layout Grid Matrix */}
                <motion.ul
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {BENEFIT_ITEMS.map((benefit) => (
                        <motion.li
                            key={benefit.id}
                            variants={itemVariants}
                            className={`group h-full flex flex-col bg-card border border-border rounded-xl p-6 ${benefit.accentColor} border-t-4 transition-all duration-300 hover:border-border-hover hover:scale-[1.01]`}
                        >
                            {/* Semantic Icon Header Container Block */}
                            <div className={`w-12 h-12 rounded-lg bg-surface flex items-center justify-center mb-5 ${benefit.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                {benefit.icon}
                            </div>

                            {/* Benefit Core Informational Typographic Blocks */}
                            <h3 className="text-lg font-medium text-foreground mb-3 tracking-tight transition-colors duration-200">
                                {benefit.title}
                            </h3>

                            <p className="text-sm text-muted leading-relaxed grow">
                                {benefit.description}
                            </p>
                        </motion.li>
                    ))}
                </motion.ul>
            </Container>
        </section>
    );
}