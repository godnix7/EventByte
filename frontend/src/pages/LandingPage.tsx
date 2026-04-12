import { appConfig } from '@/config/app.config';
import { AppLogo } from '@/components/shared/AppLogo';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Globe, Users, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { InteractiveTeamCard } from '@/components/shared/InteractiveTeamCard';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function LandingPage() {
    const { user, logout } = useAuthStore();

    const getDashboardRoute = () => {
        if (user?.role === 'admin') return '/admin';
        if (user?.role === 'organizer') return '/org';
        return '/app';
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[160px] opacity-20 bg-primary/30" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[160px] opacity-20 bg-secondary/30" />
            </div>

            <header className="relative z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl px-4 md:px-12 py-5 flex items-center justify-between sticky top-0">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <AppLogo size="md" />
                </Link>
                {user ? (
                    <div className="flex items-center gap-6">
                        <Link to={getDashboardRoute()} className="flex items-center gap-3 group p-1 pr-5 rounded-full bg-secondary/10 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-500 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 text-white flex items-center justify-center font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform overflow-hidden">
                                {user.profilePhotoUrl ? (
                                    <img src={user.profilePhotoUrl} className="w-full h-full object-cover" />
                                ) : user.firstName[0]}
                            </div>
                            <div className="flex flex-col items-start leading-none gap-1">
                                <span className="text-sm font-bold tracking-tight">{user.firstName} {user.lastName}</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-70">{user.role}</span>
                            </div>
                        </Link>
                        <button onClick={() => logout()} className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-300 transform hover:rotate-12" title="Logout">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <nav className="flex items-center gap-6 md:gap-8">
                        <Link to="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hover:translate-y-[-1px]">Log in</Link>
                        <Link to="/register" className="text-sm font-bold px-7 py-3 rounded-full bg-primary text-primary-foreground shadow-[0_8px_30px_rgb(var(--primary)/0.3)] hover:shadow-[0_8px_30px_rgb(var(--primary)/0.5)] hover:-translate-y-0.5 transition-all duration-300">
                            Get Started
                        </Link>
                    </nav>
                )}
            </header>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="px-6 md:px-12 py-20 lg:py-32 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="flex flex-col items-start text-left"
                        >
                            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold mb-10 backdrop-blur-md uppercase tracking-[0.2em]">
                                <Sparkles size={14} className="animate-pulse" />
                                <span>The Future of Event Management</span>
                            </motion.div>

                            <motion.h1 variants={fadeIn} className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.95] text-balance">
                                Elevate Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-secondary animate-gradient-x">
                                    Experiences
                                </span>
                            </motion.h1>

                            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-xl leading-relaxed font-medium">
                                Host, judge, and manage world-class hackathons and seminars with <span className="text-foreground font-bold">EventByte</span>. The all-in-one suite for modern organizers.
                            </motion.p>

                            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-5 items-center w-full lg:w-auto">
                                <Link
                                    to="/register"
                                    className="group relative flex h-16 items-center justify-center gap-3 rounded-2xl px-10 text-lg font-bold text-primary-foreground bg-primary transition-all shadow-[0_20px_50px_rgba(var(--primary)/0.3)] hover:shadow-[0_20px_50px_rgba(var(--primary)/0.5)] hover:-translate-y-1 w-full sm:w-auto overflow-hidden active:scale-95"
                                >
                                    <span className="relative z-10 font-black">Plan an Event</span>
                                    <Zap className="relative z-10 h-6 w-6 fill-current group-hover:animate-bounce" />
                                </Link>
                                <Link
                                    to="/discover"
                                    className="flex h-16 items-center justify-center gap-3 rounded-2xl px-10 text-lg font-bold border-2 border-border bg-background/40 backdrop-blur-md hover:bg-accent hover:text-accent-foreground transition-all w-full sm:w-auto active:scale-95"
                                >
                                    <Globe className="h-6 w-6" />
                                    Explore Events
                                </Link>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative flex items-center justify-center"
                        >
                            <motion.div
                                animate={{ y: [0, -30, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <img src="/assets/3d-ticket.png" alt="3D Ticket" className="max-w-full h-auto drop-shadow-2xl" />
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="px-6 md:px-12 py-32 relative overflow-hidden bg-secondary/5">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">The Pioneering Force</h2>
                            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                                Redefining gatherings with a team of visionary designers and engineers.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <InteractiveTeamCard 
                                name="Nischay" 
                                role="Lead Visionary" 
                                initials="N" 
                                color="#A855F7"
                                socials={{ github: "https://github.com", twitter: "https://twitter.com" }}
                            />
                            <InteractiveTeamCard 
                                name="Alex Chen" 
                                role="Chief Architect" 
                                image="https://i.pravatar.cc/150?u=alex"
                                color="#06B6D4"
                                socials={{ github: "https://github.com" }}
                            />
                            <InteractiveTeamCard 
                                name="Elena Rodriguez" 
                                role="Creative Director" 
                                image="https://i.pravatar.cc/150?u=elena"
                                color="#EC4899"
                                socials={{ twitter: "https://twitter.com" }}
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="px-6 md:px-12 py-32 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                { icon: <Zap />, title: "Dynamic Branding", desc: "Every event reflects your brand instantly." },
                                { icon: <Shield />, title: "Bulletproof Security", desc: "Advanced auth and role-based access control." },
                                { icon: <Users />, title: "Real-time Sync", desc: "Instant updates powered by low-latency sockets." }
                            ].map((f, i) => (
                                <div key={i} className="p-10 rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-xl hover:bg-card transition-all duration-500">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-primary/10 text-primary">
                                        {f.icon}
                                    </div>
                                    <h3 className="text-2xl font-black mb-4">{f.title}</h3>
                                    <p className="text-muted-foreground font-medium">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 border-t border-border/20 bg-background/80 backdrop-blur-2xl px-8 md:px-12 py-16">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                    <div className="flex flex-col gap-4">
                        <AppLogo size="md" />
                        <p className="text-muted-foreground text-sm font-medium">Making event management seamless since 2024.</p>
                    </div>
                    <div className="flex items-center gap-10">
                        <a href="#" className="hover:text-primary transition-colors font-bold text-sm">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors font-bold text-sm">Privacy</a>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">&copy; {new Date().getFullYear()} {appConfig.name}</p>
                </div>
            </footer>
        </div>
    );
}
