import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { appConfig } from '@/config/app.config';
import { BarChart3, Users, Clock, Star, TrendingUp, Download, PieChart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const EventAnalyticsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['event-analytics', id],
        queryFn: async () => {
            const res = await api.get(`/events/${id}/analytics`);
            return res.data;
        }
    });

    const handleExportCSV = async () => {
        window.open(`${appConfig.apiBaseUrl}/events/${id}/export/csv`, '_blank');
    };

    if (isLoading) return <div className="p-20 text-center animate-pulse">Calculating Insights...</div>;

    const cards = [
        { title: 'Total Registrations', value: stats?.registrations, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Attendance Rate', value: `${Math.round(stats?.attendanceRate || 0)}%`, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
        { title: 'Waitlist Size', value: stats?.waitlist?.total, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { title: 'Avg. Rating', value: stats?.feedback?.averageRating.toFixed(1), icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    ];

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Event <span className="text-primary italic">Analytics</span></h1>
                    <p className="text-muted-foreground italic font-medium">Performance data for Event ID: {id?.slice(0, 8)}</p>
                </div>

                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-6 py-3 bg-card border rounded-2xl hover:bg-secondary font-bold transition-all shadow-sm active:scale-95"
                >
                    <Download className="h-4 w-4" />
                    Export Participants CSV
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card p-6 rounded-[2rem] border relative overflow-hidden group hover:shadow-xl transition-all ring-1 ring-border"
                    >
                        <div className={`p-3 rounded-2xl w-fit mb-4 ${card.bg}`}>
                            <card.icon className={`h-6 w-6 ${card.color}`} />
                        </div>
                        <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">{card.title}</div>
                        <div className="text-3xl font-black">{card.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Registration Breakdown Mockup Visual */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card rounded-[2.5rem] p-10 border shadow-sm ring-1 ring-border"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-bold uppercase tracking-tight">Registration Trends</h2>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4">
                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                            <div key={i} className="flex-grow flex flex-col items-center gap-2 group">
                                <div
                                    className="w-full bg-primary/20 rounded-xl group-hover:bg-primary transition-all duration-500"
                                    style={{ height: `${h}%` }}
                                />
                                <span className="text-[10px] font-bold text-muted-foreground">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Feedback Distribution Mockup Visual */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card rounded-[2.5rem] p-10 border shadow-sm ring-1 ring-border"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <PieChart className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-bold uppercase tracking-tight">Satisfaction Score</h2>
                    </div>

                    <div className="flex items-center justify-center py-4">
                        <div className="relative w-48 h-48 rounded-full border-[1.5rem] border-primary/10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 border-[1.5rem] border-primary border-t-transparent border-l-transparent rotate-45" />
                            <div className="text-center">
                                <div className="text-4xl font-black">{stats?.feedback?.averageRating || 0}</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase">Rating</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center justify-between text-sm font-medium">
                            <span>Promoted from Waitlist</span>
                            <span className="font-bold text-primary">{stats?.waitlist?.promoted} users</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-1000"
                                style={{ width: stats?.waitlist?.total > 0 ? `${(stats.waitlist.promoted / stats.waitlist.total) * 100}%` : '0%' }}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-card rounded-[2.5rem] p-10 border shadow-sm ring-1 ring-border">
                    <div className="flex items-center gap-3 mb-8">
                        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        <h2 className="text-xl font-bold uppercase tracking-tight">Recent Feedback</h2>
                    </div>

                    <div className="space-y-4">
                        {stats?.feedback?.recent?.length > 0 ? stats.feedback.recent.map((f: any, i: number) => (
                            <div key={i} className="p-6 bg-secondary/10 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1">
                                        {[...Array(f.rating)].map((_, i) => (
                                            <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase">{new Date(f.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm font-medium">"{f.comment || 'No comment provided'}"</p>
                            </div>
                        )) : (
                            <p className="text-muted-foreground italic text-center py-10 font-bold uppercase tracking-widest">No feedback signals received yet</p>
                        )}
                    </div>
                </div>

                <div className="bg-primary text-white rounded-[2.5rem] p-10 shadow-2xl shadow-primary/20 flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-black mb-4 italic uppercase">Sentiment Analytics</h3>
                        <p className="opacity-80 font-medium">Participants are emphasizing the technical workshops and networking sessions as high-value touchpoints.</p>
                    </div>
                    <div className="mt-8 p-6 bg-white/10 rounded-3xl backdrop-blur-md">
                        <div className="text-sm font-black uppercase mb-1">Response Rate</div>
                        <div className="text-3xl font-black">42%</div>
                        <div className="w-full h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                            <div className="w-[42%] h-full bg-white" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-card rounded-[2rem] p-8 border border-dashed text-center">
                <BarChart3 className="h-8 w-8 text-primary/40 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium italic">Advanced participant demographic breakdowns and source tracking coming in v4.</p>
            </div>
        </div>
    );
};

export default EventAnalyticsPage;
