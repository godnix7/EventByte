import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AppLogo } from '@/components/shared/AppLogo';
import { LayoutDashboard, Calendar, Edit3, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export const OrganizerLayout = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-background">
            <aside className="flex w-64 flex-col border-r bg-card px-4 py-6">
                <div className="flex items-center gap-2 mb-8 px-2 cursor-pointer" onClick={() => navigate('/')}>
                    <AppLogo size="sm" />
                </div>
                <nav className="flex-1 space-y-2">
                    <button onClick={() => navigate('/org')} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </button>
                    <button onClick={() => navigate('/org/events')} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                        <Calendar className="h-4 w-4" />
                        My Events
                    </button>
                    <button onClick={() => navigate('/org/events/create')} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                        <Edit3 className="h-4 w-4" />
                        Create Event
                    </button>
                </nav>
                <div className="mt-auto border-t pt-4">
                    <div className="mb-4 flex items-center gap-3 px-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            {user.firstName[0]}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</span>
                            <span className="text-xs text-muted-foreground capitalize">Organizer</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto bg-muted/10 p-8">
                <Outlet />
            </main>
        </div>
    );
};
