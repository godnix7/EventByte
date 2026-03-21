import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AppLogo } from '@/components/shared/AppLogo';
import { LayoutDashboard, Calendar as CalendarIcon, Edit3, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface SidebarProps {
    className?: string;
}

export function AppSidebar({ className = '' }: SidebarProps) {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <aside className={`flex w-64 flex-col border-r bg-card px-4 py-6 ${className}`}>
            <div className="flex items-center gap-2 mb-8">
                <AppLogo size="sm" />
            </div>

            <nav className="flex-1 space-y-2">
                <button
                    onClick={() => {
                        if (user.role === 'admin') navigate('/admin');
                        else if (user.role === 'organizer') navigate('/org');
                        else navigate('/app');
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                </button>
                <button
                    onClick={() => {
                        if (user.role === 'admin') navigate('/admin/events');
                        else if (user.role === 'organizer') navigate('/org/events');
                        else navigate('/events');
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                    <CalendarIcon className="h-4 w-4" />
                    Events
                </button>
                {['admin', 'organizer'].includes(user.role) && (
                    <button
                        onClick={() => {
                            const path = user.role === 'admin' ? '/admin/events/create' : '/org/events/create';
                            navigate(path);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                        <Edit3 className="h-4 w-4" />
                        Create Event
                    </button>
                )}
            </nav>

            <div className="mt-auto border-t pt-4">
                <div className="mb-4 flex items-center gap-3 px-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {user.firstName[0]}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</span>
                        <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
