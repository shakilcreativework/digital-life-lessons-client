'use client';
import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { FaTrophy, FaBookmark } from 'react-icons/fa';
// import Image from 'next/image';
import Container from '../shared/Container';
import { ProCard } from '../ui/ProCard';
import LoadingData from '../ui/LoadingData';

export const DynamicStatsSection = ({ type, title }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/${type}`)
            .then(res => res.json())
            .then(res => { setData(res); setLoading(false); })
            .catch(() => setLoading(false));
    }, [type]);

    if (loading) return <LoadingData />
    if (!data.length) return null;

    return (
        <section className="py-20">
            <Container>
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    {type === 'top-contributors' ? <FaTrophy className="text-primary" /> : <FaBookmark className="text-secondary" />}
                    {title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((item, idx) => (
                        // <motion.div
                        //     key={idx}
                        //     initial={{ opacity: 0, y: 10 }}
                        //     animate={{ opacity: 1, y: 0 }}
                        //     className="p-4 bg-card border border-border rounded-xl flex items-center gap-4 hover:border-border-hover transition-colors"
                        // >
                        //     {/* User/Lesson Image with Next.js Image Component */}
                        //     <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border">
                        //         <Image
                        //             src={item.img || item.image || "/placeholder.jpg"}
                        //             alt={item.name || item.title}
                        //             fill
                        //             sizes="48px"
                        //             className="object-cover"
                        //             unoptimized // Use this if the source is external/dynamic to avoid Next.js image optimizer errors
                        //         />
                        //     </div>

                        //     <div className="min-w-0">
                        //         <p className="font-bold text-foreground truncate">{item.name || item.title}</p>
                        //         <p className="text-sm text-muted">
                        //             {item.count ? `${item.count} lessons` : `${item.bookmarkedByCount || 0} saves`}
                        //         </p>
                        //     </div>
                        // </motion.div>

                        <ProCard
                            key={idx}
                            item={item}
                            type={type === 'top-contributors' ? 'contributor' : 'lesson'}
                        />
                    ))}
                </div>
            </Container>
        </section>
    );
};