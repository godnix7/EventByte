import { appConfig } from '@/config/app.config';
import { AppLogo } from '@/components/shared/AppLogo';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Globe, Users, PlayCircle } from 'lucide-react';

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

import { useAuthStore } from '@/store/authStore';
import { LogOut } from 'lucide-react';

// ... inside component before return ...
export default function LandingPage() {
    const { user, logout } = useAuthStore();

    const getDashboardRoute = () => {
        if (user?.role === 'admin') return '/admin';
        if (user?.role === 'organizer') return '/org';
        return '/app';
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: appConfig.primaryColor }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: appConfig.secondaryColor || appConfig.primaryColor }} />
            </div>

            <header className="relative z-10 border-b border-border/40 bg-background/60 backdrop-blur-xl px-4 md:px-8 py-4 flex items-center justify-between sticky top-0">
                <Link to="/">
                    <AppLogo size="md" />
                </Link>
                {user ? (
                    <div className="flex items-center gap-4">
                        <Link to={getDashboardRoute()} className="flex items-center gap-2 group p-1 pr-4 rounded-full bg-secondary/50 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                {user.profilePhotoUrl ? (
                                    <img src={user.profilePhotoUrl} className="w-full h-full rounded-full object-cover" />
                                ) : user.firstName[0]}
                            </div>
                            <div className="flex flex-col items-start leading-none gap-0.5">
                                <span className="text-xs font-black tracking-tight">{user.firstName} {user.lastName}</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{user.role}</span>
                            </div>
                        </Link>
                        <button onClick={() => logout()} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors" title="Logout">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <nav className="flex items-center gap-4 md:gap-6">
                        <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
                        <Link to="/register" className="text-sm font-medium px-5 py-2.5 rounded-full text-primary-foreground shadow-sm hover:opacity-90 transition-all font-semibold" style={{ backgroundColor: appConfig.primaryColor }}>
                            Get Started
                        </Link>
                    </nav>
                )}
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-start pt-20 md:pt-32 pb-20 px-4 md:px-8 text-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="max-w-4xl mx-auto flex flex-col items-center"
                >
                    <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold mb-8 backdrop-blur-sm">
                        <Sparkles size={16} />
                        <span>The Ultimate Platform for Hackathons & Seminars</span>
                    </motion.div>

                    <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[1.1]">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${appConfig.primaryColor}, ${appConfig.secondaryColor || '#8b5cf6'})` }}>{appConfig.name}</span>
                    </motion.h1>

                    <motion.p variants={fadeIn} className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                        {appConfig.tagline} Host, judge, and manage world-class events seamlessly with a production-ready suite.
                    </motion.p>

                    <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center">
                        <Link
                            to="/register"
                            className="group relative flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold text-primary-foreground transition-all shadow-lg hover:-translate-y-1 w-full sm:w-auto overflow-hidden"
                            style={{ backgroundColor: appConfig.primaryColor, boxShadow: `0 10px 25px -5px ${appConfig.primaryColor}80` }}
                        >
                            <span className="relative z-10">Start Your Event Free</span>
                            <Zap className="relative z-10 h-5 w-5" />
                        </Link>
                        {user ? (
                            <Link
                                to={getDashboardRoute()}
                                className="flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold border border-border bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-all w-full sm:w-auto"
                            >
                                <Users className="h-5 w-5" />
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold border border-border bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-all w-full sm:w-auto"
                            >
                                <PlayCircle className="h-5 w-5" />
                                Sign In to Dashboard
                            </Link>
                        )}
                    </motion.div>
                </motion.div>

                {/* Dashboard / Platform Preview Image (Mock) */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                    className="mt-24 w-full max-w-6xl relative rounded-3xl border border-border/50 bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                    <div className="text-center p-8">
                        <Globe className="w-24 h-24 mx-auto text-primary/40 mb-6 drop-shadow-lg" />
                        <h2 className="text-3xl font-bold text-foreground/80">Interactive Dashboard Interface</h2>
                        <p className="text-muted-foreground mt-3 text-lg">Sign in to experience the full React 18 EventByte application block-chain.</p>
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl text-left"
                >
                    <motion.div variants={fadeIn} className="p-8 rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: `${appConfig.primaryColor}20`, color: appConfig.primaryColor }}>
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 tracking-tight">Fully Dynamic</h3>
                        <p className="text-muted-foreground leading-relaxed text-[15px]">The entire platform scales to your brand. Colors, logos, and taglines are entirely driven by environment variables. No code changes required.</p>
                    </motion.div>

                    <motion.div variants={fadeIn} className="p-8 rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: `${appConfig.primaryColor}20`, color: appConfig.primaryColor }}>
                            <Shield className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 tracking-tight">Production Ready</h3>
                        <p className="text-muted-foreground leading-relaxed text-[15px]">Built with a bulletproof Next-Gen Postgres ORM, rock-solid auth middleware, and global guards protecting every edge of the platform.</p>
                    </motion.div>

                    <motion.div variants={fadeIn} className="p-8 rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: `${appConfig.primaryColor}20`, color: appConfig.primaryColor }}>
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 tracking-tight">Real-Time Enabled</h3>
                        <p className="text-muted-foreground leading-relaxed text-[15px]">Deeply integrated with WebSockets for live judging, instant leaderboards, notifications, and group chats that never miss a beat.</p>
                    </motion.div>
                </motion.div>
            </main>

            <footer className="relative z-10 border-t border-border/40 bg-background/80 backdrop-blur-xl px-6 py-8 text-center text-sm text-muted-foreground mt-10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-medium">&copy; {new Date().getFullYear()} {appConfig.name}. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-primary transition-colors font-medium">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors font-medium">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors font-medium">System Status</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
