import { appConfig } from '@/config/app.config';
import { AppLogo } from '@/components/shared/AppLogo';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Zap, Shield, Globe, Users, LogOut, ArrowRight, MousePointer2, Calendar, Trophy } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { InteractiveTeamCard } from '@/components/shared/InteractiveTeamCard';
import { useRef } from 'react';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

export default function LandingPage() {
    const { user, logout } = useAuthStore();
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

    const getDashboardRoute = () => {
        if (user?.role === 'admin') return '/admin';
        if (user?.role === 'organizer') return '/org';
        return '/app';
    };

    return (
        <div className="min-h-screen bg-[#030303] text-white selection:bg-primary/30">
            {/* Studio Grid Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20 studio-grid" />
            
            {/* Animated Background Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] opacity-[0.07] bg-primary" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] opacity-[0.05] bg-accent" />
            </div>

            <header className="relative z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 md:px-16 py-6 flex items-center justify-between sticky top-0">
                <Link to="/" className="hover:opacity-80 transition-all active:scale-95">
                    <AppLogo size="md" />
                </Link>
                
                {user ? (
                    <div className="flex items-center gap-6">
                        <Link to={getDashboardRoute()} className="group flex items-center gap-3 p-1 pr-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold overflow-hidden shadow-lg shadow-primary/20">
                                {user.profilePhotoUrl ? (
                                    <img src={user.profilePhotoUrl} className="w-full h-full object-cover" />
                                ) : user.firstName[0]}
                            </div>
                            <span className="text-sm font-semibold tracking-tight">{user.firstName}</span>
                        </Link>
                        <button onClick={() => logout()} className="p-2 text-white/40 hover:text-red-400 transition-colors" title="Logout">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <nav className="flex items-center gap-8">
                        <Link to="/login" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Login</Link>
                        <Link to="/register" className="text-sm font-bold px-8 py-3 rounded-full bg-white text-black hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-white/5">
                            Get Started
                        </Link>
                    </nav>
                )}
            </header>

            <main className="relative z-10">
                {/* Hero Section */}
                <section ref={targetRef} className="px-6 py-32 md:py-56 max-w-7xl mx-auto flex flex-col items-center text-center relative overflow-visible">
                    <motion.div
                        style={{ opacity, scale, y }}
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="flex flex-col items-center"
                    >
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-bold uppercase tracking-[0.2em] mb-12 backdrop-blur-md">
                            <Sparkles size={12} className="text-primary" />
                            <span>Next-Gen Event OS</span>
                        </motion.div>

                        <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] mb-16 text-gradient">
                            Shape <br />
                            <span className="text-glow-sm">Reality.</span>
                        </motion.h1>

                        <motion.p variants={fadeIn} className="text-lg md:text-2xl text-white/50 mb-20 max-w-2xl font-medium leading-relaxed">
                            The definitive platform for visionary organizers. Manage, scale, and celebrate events with precision and unparalleled aesthetics.
                        </motion.p>

                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-6 items-center">
                            <Link
                                to="/register"
                                className="group relative flex h-16 items-center justify-center gap-4 rounded-full px-12 text-lg font-bold text-black bg-white transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
                            >
                                <span>Start Creating</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/discover"
                                className="flex h-16 items-center justify-center gap-4 rounded-full px-12 text-lg font-bold border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all active:scale-95"
                            >
                                <Globe className="w-5 h-5 text-primary" />
                                <span>Discover</span>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Floating Feature Pills */}
                    <div className="absolute top-1/2 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
                        <motion.div 
                            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            className="absolute top-10 left-[10%] p-4 glass-panel rounded-2xl flex items-center gap-3"
                        >
                            <Zap className="text-primary" size={20} />
                            <span className="text-xs font-bold">Fast Setup</span>
                        </motion.div>
                        <motion.div 
                            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                            className="absolute top-40 right-[15%] p-4 glass-panel rounded-2xl flex items-center gap-3"
                        >
                            <Users className="text-accent" size={20} />
                            <span className="text-xs font-bold">42k+ Users</span>
                        </motion.div>
                    </div>
                </section>

                {/* Value Props Section */}
                <section className="px-6 py-32 bg-[#050505] border-y border-white/5 relative">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
                        {[
                            { 
                                icon: <MousePointer2 className="text-primary" />, 
                                title: "Fluid Design", 
                                desc: "An interface that moves with you. Built for speed, polished for perfection." 
                            },
                            { 
                                icon: <Calendar className="text-accent" />, 
                                title: "Smart Scheduling", 
                                desc: "Automated logistics and resource management. Let the OS handle the heavy lifting." 
                            },
                            { 
                                icon: <Trophy className="text-purple-400" />, 
                                title: "Global Reach", 
                                desc: "Scale your events from local meetups to international summits effortlessly." 
                            }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="flex flex-col items-start"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-white/40 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Team Section */}
                <section className="px-6 py-40 max-w-7xl mx-auto">
                    <div className="flex flex-col items-center text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">The Visionaries</h2>
                        <p className="text-white/40 max-w-xl text-lg font-medium">Building the infrastructure for the next generation of human connection.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center">
                        <InteractiveTeamCard 
                            name="Nischay" 
                            role="Lead Visionary" 
                            initials="N" 
                            color="#A855F7"
                            socials={{ github: "https://github.com/nischay" }}
                        />
                        <InteractiveTeamCard 
                            name="Alex Chen" 
                            role="Chief Architect" 
                            image="https://i.pravatar.cc/150?u=alex"
                            color="#06B6D4"
                            socials={{ github: "https://github.com/alex" }}
                        />
                        <InteractiveTeamCard 
                            name="Elena Rodriguez" 
                            role="Creative Director" 
                            image="https://i.pravatar.cc/150?u=elena"
                            color="#EC4899"
                            socials={{ twitter: "https://twitter.com/elena" }}
                        />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-6 py-40">
                    <div className="max-w-5xl mx-auto p-16 md:p-24 rounded-[3rem] bg-gradient-to-br from-primary/20 to-transparent border border-white/10 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter relative z-10">Ready to redefine <br/> the event experience?</h2>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-10">
                            <Link to="/register" className="h-16 px-12 rounded-full bg-white text-black font-bold flex items-center justify-center hover:scale-105 transition-all shadow-xl">
                                Create Your First Event
                            </Link>
                            <Link to="/contact" className="h-16 px-12 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 font-bold flex items-center justify-center transition-all">
                                Talk to Sales
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="px-6 md:px-16 py-20 border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8">
                    <div className="flex flex-col gap-6">
                        <AppLogo size="md" />
                        <p className="text-white/30 text-sm max-w-xs font-medium">Building the OS for events. Designed with precision, built for scale.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                        <div className="flex flex-col gap-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/20">Platform</span>
                            <Link to="/discover" className="text-sm text-white/50 hover:text-white transition-colors">Discover</Link>
                            <Link to="/features" className="text-sm text-white/50 hover:text-white transition-colors">Features</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/20">Company</span>
                            <Link to="/about" className="text-sm text-white/50 hover:text-white transition-colors">About</Link>
                            <Link to="/contact" className="text-sm text-white/50 hover:text-white transition-colors">Contact</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/20">Legal</span>
                            <Link to="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">Privacy</Link>
                            <Link to="/terms" className="text-sm text-white/50 hover:text-white transition-colors">Terms</Link>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 text-xs font-bold">
                    <span>&copy; {new Date().getFullYear()} {appConfig.name}. All rights reserved.</span>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">GitHub</a>
                        <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
