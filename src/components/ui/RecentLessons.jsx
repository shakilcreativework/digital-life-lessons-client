'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';   // ← Added this
import { authClient } from '@/lib/auth-client';

export default function RecentLessons({ limit = 3 }) {
    const { data: session } = authClient.useSession();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = session?.user.role === "admin";
    console.log(isAdmin);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/lessons', {
                    cache: 'no-store',
                });

                if (!res.ok) throw new Error('Failed to fetch');

                const data = await res.json();

                const sorted = data
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, limit);

                setLessons(sorted);
            } catch (error) {
                console.error('Error fetching lessons:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [limit]);

    const getAccessBadge = (accessLevel) => {
        switch (accessLevel?.toLowerCase()) {
            case 'premium':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'private':
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
            default:
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        }
    };

    const getRelativeTime = (date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    if (loading) {
        return (
            <div className="p-6 bg-card border border-border/60 rounded-2xl shadow-xs">
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-surface/40 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-card border border-border/60 rounded-2xl shadow-xs flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-foreground">
                        Recently Added Lessons
                    </h3>
                    <Link
                        href="/explore"
                        className={`text-[10px] font-bold hover:underline ${isAdmin ? 'text-secondary' : 'text-orange-500'}`}
                    >
                        View All
                    </Link>
                </div>

                <div className="space-y-3">
                    {lessons.map((lesson) => (
                        <div
                            key={lesson._id}
                            className="p-3.5 bg-surface/40 border border-border/40 rounded-xl flex justify-between items-start gap-2 hover:border-orange-500/30 transition-colors group"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-xs text-foreground truncate group-hover:text-orange-400 transition-colors">
                                    {lesson.title}
                                </p>
                                <span className="text-[10px] text-muted block mt-0.5 text-nowrap">
                                    {lesson.category} • {getRelativeTime(lesson.createdAt)}
                                </span>
                            </div>

                            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md uppercase shrink-0 border ${getAccessBadge(lesson.accessLevel)}`}>
                                {lesson.accessLevel || 'Public'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center pt-4 border-t border-border/40 text-[10px] text-muted/60 font-medium mt-auto">
                Platform diagnostics synchronized.
            </div>
        </div>
    );
}