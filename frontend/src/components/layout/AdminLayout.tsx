import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AppLogo } from '@/components/shared/AppLogo';
import { Users, Calendar, Settings, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const AdminLayout = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const location = useLocation();

    if (!user) return null;

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: Settings },
        { path: '/admin/users', label: 'Users & Approvals', icon: Users },
        { path: '/admin/events', label: 'All Events', icon: Calendar },
        { path: '/admin/events/create', label: 'Create Event', icon: Calendar },
    ];

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Admin Sidebar Blade */}
            <aside className="relative z-50 flex w-72 flex-col glass border-r-0 m-4 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden group">
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                
                <div className="relative z-10 flex items-center gap-3 mb-12 px-4 cursor-pointer group/logo" onClick={() => navigate('/')}>
                    <div className="p-2 bg-destructive/20 rounded-2xl group-hover/logo:scale-110 transition-transform duration-500 shadow-lg shadow-destructive/10">
                        <AppLogo size="sm" showText={false} />
                    </div>
                    <div>
                        <span className="text-lg font-black tracking-tighter text-glow" style={{ textShadow: '0 0 10px hsla(var(--destructive) / 0.5)' }}>EventByte</span>
                        <div className="text-[10px] uppercase tracking-[0.3em] font-black text-destructive/60">Admin Panel</div>
                    </div>
                </div>

                <nav className="relative z-10 flex-1 space-y-3">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`relative flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-500 overflow-hidden ${
                                    isActive 
                                        ? 'text-destructive bg-destructive/10 shadow-inner' 
                                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                }`}
                            >
                                <item.icon className={`h-5 w-5 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="relative z-10">{item.label}</span>
                                {isActive && (
                                    <motion.div 
                                        layoutId="admin-active-pill"
                                        className="absolute left-0 w-1 h-6 bg-destructive rounded-full"
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="relative z-10 mt-auto pt-8 border-t border-white/5">
                    <div className="mb-6 flex items-center gap-4 px-4 p-3 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive to-destructive/60 text-white font-black shadow-lg shadow-destructive/20">
                            {user.firstName[0]}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-black truncate">{user.firstName} {user.lastName}</span>
                            <span className="text-[10px] font-bold text-destructive uppercase tracking-widest opacity-80">Administrator</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold text-destructive hover:bg-destructive/10 transition-all duration-300 group"
                    >
                        <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Admin Canvas */}
            <main className="flex-1 relative overflow-y-auto custom-scrollbar p-6 lg:p-10">
                {/* Decorative Canvas Glow */}
                <div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-destructive/5 rounded-full blur-[150px] -z-10 animate-pulse" />
                <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] -z-10" />
                
                <div className="relative z-10 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

