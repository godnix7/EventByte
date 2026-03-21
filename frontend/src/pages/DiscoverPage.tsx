import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Search, Calendar, MapPin, Tag, ChevronRight, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface Event {
    event: {
        id: string;
        title: string;
        description: string;
        slug: string;
        bannerUrl: string;
        startDate: string;
        location: string;
        status: string;
    };
    club?: {
        name: string;
        logoUrl: string;
    };
}

const DiscoverPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState<'newest' | 'soonest' | 'trending'>('trending');

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await axios.get('/api/admin/categories');
            return res.data.categories;
        }
    });

    const { data: events, isLoading } = useQuery({
        queryKey: ['events', 'discover', search, category, sort],
        queryFn: async () => {
            const params: any = { sort };
            if (search) params.q = search;
            if (category) params.categoryId = category;
            const res = await axios.get('/api/events/discover', { params });
            return res.data.events as Event[];
        },
        enabled: true
    });

    const handleBookmark = async (eventId: string) => {
        try {
            await axios.post(`/api/engagement/events/${eventId}/bookmark`);
            toast.success('Event saved to bookmarks!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to save event');
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20 pt-8 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto mb-12 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4"
                >
                    Discover <span className="text-primary italic">Incredible</span> Events
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                    Explore hackathons, workshops, and meetups from your favorite clubs and organizations.
                </motion.p>
            </div>

            {/* Filters & Search */}
            <div className="max-w-7xl mx-auto mb-12 sticky top-20 z-40 bg-background/80 backdrop-blur-md py-4 transition-all">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by title or description..."
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        <select
                            className="px-4 py-3 rounded-2xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium cursor-pointer min-w-[140px]"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categoriesData?.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <select
                            className="px-4 py-3 rounded-2xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium cursor-pointer min-w-[140px]"
                            value={sort}
                            onChange={(e) => setSort(e.target.value as any)}
                        >
                            <option value="trending">Trending Now</option>
                            <option value="soonest">Happening Soon</option>
                            <option value="newest">Just Added</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[400px] rounded-3xl bg-card animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : events && events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {events.map((item, index) => (
                                <motion.div
                                    key={item.event.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="group relative bg-card rounded-[2rem] overflow-hidden border hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full ring-1 ring-border"
                                >
                                    {/* Banner Image */}
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <img
                                            src={item.event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'}
                                            alt={item.event.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleBookmark(item.event.id);
                                            }}
                                            className="absolute top-4 right-4 p-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-primary transition-all shadow-xl"
                                        >
                                            <Bookmark className="h-5 w-5" />
                                        </button>

                                        {item.club && (
                                            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/30 truncate max-w-[80%]">
                                                {item.club.logoUrl && (
                                                    <img src={item.club.logoUrl} className="h-5 w-5 rounded-md object-cover" />
                                                )}
                                                <span className="text-sm font-semibold text-white truncate">{item.club.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-3 bg-primary/10 w-fit px-3 py-1 rounded-full">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(item.event.startDate), 'MMM dd, yyyy')}
                                        </div>

                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                            {item.event.title}
                                        </h3>

                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed">
                                            {item.event.description}
                                        </p>

                                        <div className="mt-auto pt-6 border-t flex items-center justify-between">
                                            <div className="flex items-center text-muted-foreground text-xs font-medium">
                                                <MapPin className="h-4 w-4 mr-1 text-primary/60" />
                                                {item.event.location}
                                            </div>

                                            <Link
                                                to={`/events/${item.event.slug}`}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-bold text-sm hover:bg-primary hover:text-white transition-all shadow-sm group/btn"
                                            >
                                                Details
                                                <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-24 bg-card rounded-[3rem] border border-dashed shadow-inner">
                        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Tag className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No events found</h2>
                        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Try adjusting your filters or search keywords to find what you're looking for.</p>
                        <button
                            onClick={() => { setSearch(''); setCategory(''); }}
                            className="px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all"
                        >
                            Reset all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscoverPage;
