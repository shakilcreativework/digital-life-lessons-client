'use client';

import { useState, useEffect } from 'react';
import { FaTrophy, FaBookmark } from 'react-icons/fa';
import Container from '../shared/Container';
import { ProCard } from '../ui/ProCard';
import LoadingData from '../ui/LoadingData';

export const DynamicStatsSection = ({ type, title }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/${type}`)
            .then(res => res.json())
            .then(res => {
                setData(res || []);
                setLoading(false);
            })
            .catch(() => {
                setData([]);
                setLoading(false);
            });
    }, [type]);

    if (!loading && !data.length) return null;

    return (
        <section className="py-20">
            <Container>
                {/* Title - Always visible */}
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    {type === 'top-contributors' ? (
                        <FaTrophy className="text-primary" />
                    ) : (
                        <FaBookmark className="text-secondary" />
                    )}
                    {title}
                </h2>

                {/* Content Area with Perfect Loading Space */}
                {loading ? (
                    <LoadingData 
                        text="Loading..." 
                        className="min-h-40 flex items-center justify-center" 
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.map((item, idx) => (
                            <ProCard
                                key={idx}
                                item={item}
                                type={type === 'top-contributors' ? 'contributor' : 'lesson'}
                            />
                        ))}
                    </div>
                )}
            </Container>
        </section>
    );
};