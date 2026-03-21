import { useEvents, useDeleteEvent } from '@/hooks/useEvents';
import { appConfig } from '@/config/app.config';
import { Link, useLocation } from 'react-router-dom';
import { AppLogo } from '@/components/shared/AppLogo';
import { Calendar, Users, Edit3, Eye, Trash2 } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { LogOut } from 'lucide-react';

export default function EventsPage() {
    const location = useLocation();
    const isManageMode = location.pathname.startsWith('/admin') || location.pathname.startsWith('/org');

    const { data: events, isLoading, error } = useEvents(
        isManageMode ? { manage: true } : { public: true }
    );
    const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

    const { user, logout } = useAuthStore();

    const getDashboardRoute = () => {
        if (user?.role === 'admin') return '/admin';
        if (user?.role === 'organizer') return '/org';
        return '/app';
    };

    const getCreateEventRoute = () => {
        if (user?.role === 'admin') return '/admin/events/create';
        if (user?.role === 'organizer') return '/org/events/create';
        return '/login';
    };

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading events...</div>;
    if (error) return <div className="p-8 text-center text-destructive">Failed to load events. Database connection might be offline.</div>;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b px-6 py-4 flex items-center justify-between bg-card text-card-foreground">
                <Link to={user ? getDashboardRoute() : "/"}><AppLogo size="sm" showText={false} /></Link>
                <div className="flex gap-4 items-center">
                    {!isManageMode && <Link to="/events" className="text-sm font-medium hover:text-primary">Explore Events</Link>}
                    {isManageMode && <Link to="/events" className="text-sm font-medium hover:text-primary flex items-center gap-1"><Eye size={14} /> View Public Gallery</Link>}

                    {user ? (
                        <>
                            <div className="w-px h-4 bg-border mx-2"></div>
                            <Link to={getDashboardRoute()} className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded-full border border-transparent hover:border-border transition-colors">
                                <span className="text-sm font-medium pr-1 hidden sm:inline-block">{user.firstName}</span>
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                    {user.firstName[0]}
                                </div>
                            </Link>
                            <button onClick={() => logout()} className="text-muted-foreground hover:text-destructive" title="Logout">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-px h-4 bg-border mx-2"></div>
                            <Link to="/login" className="text-sm font-medium hover:text-primary">Login</Link>
                        </>
                    )}
                </div>
            </header>

            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">{isManageMode ? 'Manage Events' : 'Discover Events'}</h1>
                    {['admin', 'organizer'].includes(user?.role || '') && (
                        <Link
                            to={getCreateEventRoute()}
                            className="px-4 py-2 text-white font-semibold rounded-md transition-opacity hover:opacity-90"
                            style={{ backgroundColor: appConfig.primaryColor }}
                        >
                            Create New Event
                        </Link>
                    )}
                </div>

                {events?.length === 0 ? (
                    <div className="p-12 border rounded-xl bg-card text-center shadow-sm">
                        <h2 className="text-xl font-semibold mb-2">No Events Found</h2>
                        <p className="text-muted-foreground">
                            {isManageMode ? "You haven't created any events yet." : "Be the first to host an event on EventByte!"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events?.map((event: any) => (
                            <div key={event.id} className="relative group">
                                <Link
                                    to={isManageMode && event.status === 'draft' ? `${getCreateEventRoute().replace('/create', '')}/create?id=${event.id}&step=${event.lastStep || 1}` : `/events/${event.slug}`}
                                    className="block"
                                >
                                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                        <div className="h-40 bg-accent relative">
                                            {event.bannerImageUrl ? (
                                                <img src={event.bannerImageUrl} alt={event.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-accent-foreground opacity-50">
                                                    No Cover Image
                                                </div>
                                            )}

                                            <div className="absolute top-4 right-4 flex gap-2">
                                                {event.status === 'draft' && (
                                                    <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-lg">
                                                        Draft
                                                    </span>
                                                )}
                                                <span className="bg-background/90 text-xs font-bold px-2 py-1 rounded backdrop-blur-sm uppercase tracking-wider">
                                                    {event.eventType}
                                                </span>
                                            </div>

                                            {isManageMode && (
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                        <Edit3 size={16} /> {event.status === 'draft' ? 'Continue Setup' : 'Manage Event'}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors pr-8">{event.title}</h3>
                                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description || 'No description provided.'}</p>

                                            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'Date TBD'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users size={14} />
                                                    {event.allowTeams ? `${event.teamMaxSize} per team` : 'Individual'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                {isManageMode && event.status === 'draft' && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (window.confirm('Are you sure you want to delete this draft?')) {
                                                deleteEvent(event.id);
                                            }
                                        }}
                                        className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        title="Delete Draft"
                                        disabled={isDeleting}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
