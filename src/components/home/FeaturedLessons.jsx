"use client";

import "swiper/css";
import { useEffect, useState } from "react";
import LessonCard from "../ui/LessonCard";
import Container from "../shared/Container";
import EmptyState from "../ui/EmptyState";
import LoadingData from "../ui/LoadingData";
import { getAllFeatured } from "@/lib/actions/featured";

const FeaturedLessons = () => {
    const [features, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const feaData = await getAllFeatured();
                setFeatured(feaData || []); // Ensure it's always an array
            } catch (error) {
                console.error("Featured data load error:", error);
                setFeatured([]); // Fallback to empty array on error
            } finally {
                setLoading(false);
            }
        };

        loadFeatured();
    }, []);

    return (
        <main className="py-10">
            <Container>
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                        Featured Lessons
                    </h2>

                    <button className="text-sm font-medium text-muted underline underline-offset-4 decoration-2 hover:text-foreground transition-all">
                        View all lessons &rarr;
                    </button>
                </div>

                {/* Loading, Empty & Data States */}
                {loading ? (
                    <LoadingData 
                        size={40} 
                        text="Featured processing..." 
                        className="py-20"
                    />
                ) : features.length === 0 ? (
                    <div className="w-full py-12 flex justify-center items-center">
                        <EmptyState />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {features.slice(0, 12).map((item) => (
                            <LessonCard key={item._id} lesson={item} />
                        ))}
                    </div>
                )}
            </Container>
        </main>
    );
};

export default FeaturedLessons;