import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Users, Plus, Shield, ExternalLink, Search, Sparkles, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const ClubsHubPage: React.FC = () => {
    const { user } = useAuthStore();
    const [search, setSearch] = useState('');

    const { data: clubs, isLoading } = useQuery({
        queryKey: ['clubs', search],
        queryFn: async () => {
            const res = await axios.get('/api/clubs');
            return res.data.clubs;
        }
    });

    const filteredClubs = clubs?.filter((club: any) =>
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        club.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background pb-20 pt-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">Club <span className="text-primary italic">Hub</span></h1>
                    </motion.div>
                    <p className="text-muted-foreground text-lg max-w-xl">Join student organizations, specialized clubs, and communities to elevate your experience.</p>
                </div>

                <Link
                    to={user?.role === 'admin' ? '/admin/events/create' : '/org/events/create'}
                    className="inline-flex items-center gap-2 px-6 py-4 bg-primary text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    Create Your Club
                </Link>
            </div>

            {/* Hub Tools */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for clubs by name or interest..."
                        className="w-full pl-12 pr-4 py-4 rounded-[2rem] border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm text-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-card rounded-[3rem] animate-pulse" />
                        ))}
                    </div>
                ) : filteredClubs && filteredClubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredClubs.map((club: any, index: number) => (
                                <motion.div
                                    key={club.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-card rounded-[3rem] p-8 border hover:border-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/5 flex flex-col shadow-sm ring-1 ring-border"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="h-20 w-20 rounded-3xl bg-primary/5 overflow-hidden border flex items-center justify-center">
                                            {club.logoUrl ? (
                                                <img src={club.logoUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <Users className="h-10 w-10 text-primary/40" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-full text-[10px] font-black uppercase tracking-widest text-secondary-foreground">
                                            <Shield className="h-3 w-3" />
                                            Verified
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors">{club.name}</h3>
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-8 leading-relaxed">
                                        {club.description || 'No description provided for this club yet.'}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(m => (
                                                <div key={m} className="h-8 w-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                                                    U{m}
                                                </div>
                                            ))}
                                            <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                +12
                                            </div>
                                        </div>

                                        <Link
                                            to={`/clubs/${club.id}`}
                                            className="p-3 rounded-2xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-white transition-all"
                                        >
                                            <ExternalLink className="h-5 w-5" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-32 bg-card rounded-[4rem] border border-dashed">
                        <LayoutGrid className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                        <h2 className="text-3xl font-black mb-4">No clubs <span className="text-primary italic">found</span></h2>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-8">We couldn't find any clubs matching your search. Why not start one yourself?</p>
                        <button
                            onClick={() => setSearch('')}
                            className="px-8 py-4 bg-secondary font-black rounded-2xl hover:bg-primary hover:text-white transition-all"
                        >
                            View All Communities
                        </button>
                    </div>
                )}
            </div>

            {/* Featured Clubs Horizontal Scroll */}
            <div className="max-w-7xl mx-auto mt-24">
                <div className="flex items-center gap-2 mb-8">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-black tracking-tight uppercase">Featured Organizations</h2>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="min-w-[300px] bg-card/50 rounded-[2.5rem] p-6 border border-dashed animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClubsHubPage;
