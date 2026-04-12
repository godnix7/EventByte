import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Shield, MapPin, Users, Calendar, ArrowLeft, Globe, Twitter, Github, Mail, Share2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const ClubProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const { data: club, isLoading } = useQuery({
        queryKey: ['club', id],
        queryFn: async () => {
            const res = await api.get(`/clubs/${id}`);
            return res.data.club;
        }
    });

    const { data: events } = useQuery({
        queryKey: ['club-events', id],
        queryFn: async () => {
            const res = await api.get('/events/discover', { params: { clubId: id } });
            return res.data.events;
        }
    });

    if (isLoading) return <div className="p-20 text-center animate-bounce">Loading Community...</div>;
    if (!club) return <div className="p-20 text-center">Club not found.</div>;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header / Banner Area */}
            <div className="h-64 sm:h-80 w-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8">
                    <Link to="/clubs" className="absolute top-8 left-4 sm:left-8 flex items-center gap-2 text-primary font-bold bg-background/50 backdrop-blur-md px-4 py-2 rounded-xl border hover:bg-background transition-all">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Hub
                    </Link>

                    <button className="absolute top-8 right-4 sm:right-8 p-3 bg-background/50 backdrop-blur-md rounded-2xl border hover:bg-background transition-all">
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Profile Info Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar / Identity */}
                    <div className="lg:w-1/3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card rounded-[3rem] p-10 border shadow-2xl relative z-10 ring-1 ring-border"
                        >
                            <div className="h-32 w-32 rounded-[2rem] bg-background border-4 border-card shadow-xl mx-auto -mt-24 mb-6 overflow-hidden flex items-center justify-center">
                                {club.logoUrl ? (
                                    <img src={club.logoUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <Users className="h-12 w-12 text-primary/40" />
                                )}
                            </div>

                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-black mb-2">{club.name}</h1>
                                <div className="flex items-center justify-center gap-1.5 text-primary text-xs font-black uppercase tracking-widest bg-primary/10 w-fit mx-auto px-4 py-1.5 rounded-full">
                                    <Shield className="h-3.5 w-3.5" />
                                    Official Community
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-secondary/50 p-4 rounded-3xl text-center">
                                    <div className="text-2xl font-black">1.2k</div>
                                    <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Members</div>
                                </div>
                                <div className="bg-secondary/50 p-4 rounded-3xl text-center">
                                    <div className="text-2xl font-black">{events?.length || 0}</div>
                                    <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Events</div>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-primary text-white font-black rounded-3xl hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95 mb-6">
                                Join Common Community
                            </button>

                            <div className="flex justify-center gap-4 text-muted-foreground">
                                <Globe className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
                                <Twitter className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
                                <Github className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
                                <Mail className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Content / Events */}
                    <div className="lg:w-2/3 pt-8">
                        <section className="mb-16">
                            <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">About <span className="text-primary italic">Us</span></h2>
                            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-lg">
                                {club.description || 'This club hasn\'t shared their story yet. Stay tuned for updates on their mission and values!'}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black uppercase tracking-tight">Our <span className="text-primary italic">Events</span></h2>
                                <span className="text-sm font-bold text-muted-foreground">{events?.length || 0} items</span>
                            </div>

                            {events && events.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {events.map((item: any) => (
                                        <Link
                                            key={item.event.id}
                                            to={`/events/${item.event.slug}`}
                                            className="group bg-card rounded-[2.5rem] border p-6 hover:shadow-xl hover:border-primary/20 transition-all flex flex-col"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                                                    <Calendar className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-muted-foreground uppercase">{format(new Date(item.event.startDate), 'MMM dd, yyyy')}</div>
                                                    <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-1">{item.event.title}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-xs text-muted-foreground font-medium mb-4">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {item.event.location}
                                            </div>
                                            <div className="mt-auto flex justify-end">
                                                <div className="p-2 rounded-xl bg-secondary group-hover:bg-primary group-hover:text-white transition-all text-secondary-foreground">
                                                    <ChevronRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-16 rounded-[3rem] border-2 border-dashed border-muted text-center italic text-muted-foreground">
                                    No upcoming public events scheduled.
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubProfilePage;
