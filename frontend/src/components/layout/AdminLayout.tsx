import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AppLogo } from '@/components/shared/AppLogo';
import { Users, Calendar, Settings, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const AdminLayout = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const location = useLocation();

    if (!user) return null;

    const navItems = [
        { path: '/admin', label: 'CONTROL CENTER', icon: Settings },
        { path: '/admin/users', label: 'PERSONNEL', icon: Users },
        { path: '/admin/events', label: 'GLOBAL EVENTS', icon: Calendar },
    ];

    const handleLogout = () => {
        logout();
        toast.success('Admin override terminated');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans perspective-1000">
            {/* Cosmic Admin Sidebar */}
            <aside className="relative z-50 flex w-[280px] flex-col glass-cosmic m-8 rounded-[3rem] p-10 shadow-2xl overflow-visible group border-white/5 preserve-3d transition-transform duration-700 hover:scale-[1.01]">
                {/* 3D Floating Detail Overlay - Admin High Security */}
                <div className="absolute -top-6 -left-6 w-16 h-16 glass-stellar rounded-[2rem] flex items-center justify-center shadow-2xl border-white/10 animate-float">
                    <ShieldCheck className="w-8 h-8 text-primary lunar-glow" />
                </div>
                
                <div className="relative z-10 mb-20 px-2 flex justify-center">
                    <AppLogo size="md" showText={true} />
                </div>

                <nav className="relative z-10 flex-1 space-y-8">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`group/nav relative flex w-full items-center gap-5 py-3 px-6 rounded-2xl transition-all duration-500 font-black tracking-[0.2em] text-[10px] ${
                                    isActive 
                                        ? 'bg-primary/20 text-white shadow-[0_10px_30px_rgba(139,92,246,0.3)] border border-primary/30' 
                                        : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                {isActive && (
                                    <motion.div 
                                        layoutId="a-nav-glow"
                                        className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"
                                    />
                                )}
                                <item.icon className={`h-4 w-4 relative z-10 transition-transform duration-500 ${isActive ? 'scale-110 text-primary' : 'group-hover/nav:scale-110'}`} />
                                <span className="relative z-10 text-glow">{item.label}</span>
                                {isActive && (
                                    <ChevronRight className="ml-auto h-3 w-3 opacity-60 text-primary" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Admin Specific Identity */}
                <div className="relative z-10 mt-auto">
                    <div className="mb-8 flex flex-col gap-5 p-6 rounded-[2rem] glass-stellar border-white/5 group/user hover:border-primary/30 transition-all duration-500">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white font-black shadow-lg shadow-primary/20">
                                {user.firstName[0]}
                            </div>
                            <div className="flex flex-col overflow-hidden gap-0.5">
                                <span className="text-sm font-black truncate tracking-tight text-white">{user.firstName}</span>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-80 text-glow">High Overseer</span>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout} 
                        className="flex w-full h-14 items-center justify-center gap-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-500 group/out border border-transparent hover:border-destructive/20"
                    >
                        <LogOut className="h-4 w-4 group-hover/out:-rotate-12 transition-transform" />
                        <span>Override Exit</span>
                    </button>
                </div>
            </aside>

            {/* Main Admin Canvas */}
            <main className="flex-1 relative overflow-y-auto custom-scrollbar p-10">
                {/* Nebula Effects */}
                <div className="fixed -top-20 -right-20 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] -z-10 animate-celestial" />
                <div className="fixed bottom-0 left-1/3 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] -z-10" />
                
                <div className="relative z-10 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 167, 199, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 167, 199, 0.2); }
            ` }} />
        </div>
    );
};

