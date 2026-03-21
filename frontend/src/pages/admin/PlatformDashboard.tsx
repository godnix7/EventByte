import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Users, Calendar, ShieldCheck, Activity, BarChart3, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const PlatformDashboard: React.FC = () => {
    const { data: stats } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await api.get('/admin/stats');
            return res.data.stats;
        }
    });

    const metrics = [
        { label: 'Active Users', value: stats?.users, icon: Users, trend: '+12%', color: 'text-blue-500' },
        { label: 'Total Events', value: stats?.events, icon: Calendar, trend: '+5%', color: 'text-purple-500' },
        { label: 'Verified Clubs', value: stats?.clubs || 0, icon: ShieldCheck, trend: '+2', color: 'text-green-500' },
        { label: 'Pending Approvals', value: stats?.pendingOrganizers || 0, icon: Activity, trend: 'High', color: 'text-orange-500' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Platform <span className="text-primary italic">Intelligence</span></h1>
                    <p className="text-muted-foreground font-medium">Real-time ecosystem overview and administrative control.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
                    <Zap className="h-3 w-3 fill-current" />
                    System Status: Optimal
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <motion.div
                        key={m.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card rounded-[2.5rem] p-8 border hover:shadow-2xl transition-all group ring-1 ring-border"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-4 rounded-2xl bg-secondary group-hover:bg-primary transition-colors`}>
                                <m.icon className={`h-6 w-6 group-hover:text-white transition-colors ${m.color}`} />
                            </div>
                            <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{m.trend}</span>
                        </div>
                        <div className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-1">{m.label}</div>
                        <div className="text-4xl font-black">{m.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Traffic Visual */}
                <div className="lg:col-span-2 bg-card rounded-[3rem] p-10 border shadow-sm ring-1 ring-border">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="h-6 w-6 text-primary" />
                            <h2 className="text-xl font-black uppercase tracking-tight">Growth Velocity</h2>
                        </div>
                        <select className="bg-secondary text-xs font-bold px-4 py-2 rounded-xl outline-none">
                            <option>Last 30 Days</option>
                            <option>Last 90 Days</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 overflow-hidden px-2">
                        {[30, 45, 35, 60, 55, 80, 75, 90, 85, 95, 100, 90, 80, 70, 85, 95].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 0.5 + (i * 0.05), duration: 1 }}
                                className="flex-grow bg-primary/20 rounded-t-lg hover:bg-primary transition-all cursor-pointer"
                            />
                        ))}
                    </div>
                </div>

                {/* Sub-Actions */}
                <div className="space-y-6">
                    <div className="bg-primary text-white rounded-[3rem] p-10 shadow-2xl shadow-primary/30 flex flex-col justify-between h-full min-h-[300px] relative overflow-hidden group">
                        <Globe className="absolute -right-10 -bottom-10 h-48 w-48 opacity-10 group-hover:scale-125 transition-transform duration-1000" />
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-4">Domain Expansion</h3>
                            <p className="text-white/80 font-medium mb-8">Manage category mapping and event classification across all colleges.</p>
                        </div>
                        <button className="relative z-10 w-full py-4 bg-white text-primary font-black rounded-2xl hover:bg-opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10">
                            Configure Taxonomy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformDashboard;
