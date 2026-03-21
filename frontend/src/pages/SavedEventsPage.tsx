import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Bookmark, Calendar, Trash2, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { queryClient } from '@/lib/queryClient';

const SavedEventsPage: React.FC = () => {
    const { data: bookmarks, isLoading } = useQuery({
        queryKey: ['bookmarks'],
        queryFn: async () => {
            const res = await axios.get('/api/engagement/bookmarks');
            return res.data.bookmarks;
        }
    });

    const removeBookmarkMutation = useMutation({
        mutationFn: async (eventId: string) => {
            await axios.delete(`/api/engagement/events/${eventId}/bookmark`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
            toast.success('Removed from bookmarks');
        }
    });

    return (
        <div className="min-h-screen bg-background pb-20 pt-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <Bookmark className="h-8 w-8 text-primary fill-primary/20" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">Saved <span className="text-primary italic">Events</span></h1>
                </div>
                <p className="text-muted-foreground text-lg">Keep track of events you're interested in attending.</p>
            </div>

            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-card rounded-[2.5rem] animate-pulse" />
                        ))}
                    </div>
                ) : bookmarks && bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence>
                            {bookmarks.map((bookmark: any, index: number) => (
                                <motion.div
                                    key={bookmark.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-card rounded-[2.5rem] overflow-hidden border hover:border-primary/20 transition-all hover:shadow-xl flex flex-col md:flex-row shadow-sm ring-1 ring-border"
                                >
                                    {/* Placeholder Image / Event Visual */}
                                    <div className="w-full md:w-64 aspect-video md:aspect-auto bg-primary/5 flex items-center justify-center border-r">
                                        <Calendar className="h-12 w-12 text-primary/20" />
                                    </div>

                                    <div className="p-8 flex-grow flex flex-col justify-center">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="text-primary font-bold text-xs uppercase tracking-tighter mb-2 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                    Event ID: {bookmark.eventId.slice(0, 8)}
                                                </div>
                                                <h3 className="text-2xl font-black mb-2 hover:text-primary transition-colors cursor-pointer capitalize">
                                                    Event Details Coming Soon
                                                </h3>
                                                <p className="text-muted-foreground max-w-xl">
                                                    Your saved interest in this event is noted. Visit the event page to see the full details and registration options.
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Link
                                                    to={`/events/${bookmark.eventId}`}
                                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
                                                >
                                                    View Event
                                                    <ChevronRight className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => removeBookmarkMutation.mutate(bookmark.eventId)}
                                                    className="p-3 rounded-2xl bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-all group/btn"
                                                    title="Remove bookmark"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-24 bg-card rounded-[4rem] border border-dashed relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative z-10">
                            <div className="bg-primary/10 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                <Bookmark className="h-12 w-12 text-primary fill-none" />
                            </div>
                            <h2 className="text-3xl font-black mb-4">Your bookmarks list is <span className="text-primary">empty</span></h2>
                            <p className="text-muted-foreground mb-10 text-lg max-w-md mx-auto leading-relaxed">
                                Ready to discover some amazing events? Head over to the discovery hub and save your favorites!
                            </p>
                            <Link
                                to="/discover"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-[2rem] hover:shadow-2xl hover:shadow-primary/30 active:scale-95 transition-all group"
                            >
                                <Sparkles className="h-5 w-5 group-hover:animate-spin-slow" />
                                Explore Events
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedEventsPage;
