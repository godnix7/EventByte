import { useParams, Link } from 'react-router-dom';
import { useEvent, useMyPermissions } from '@/hooks/useEvents';
import { AppLogo } from '@/components/shared/AppLogo';
import { Calendar, Users, Share2, Star, FileUp, Edit } from 'lucide-react';
import { GroupChatWidget } from '@/components/shared/GroupChatWidget';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import FeedbackModal from '@/components/engagement/FeedbackModal';
import SubmissionModal from '@/components/engagement/SubmissionModal';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

// Type definition for feedback items
interface FeedbackItem {
    id?: string;
    rating: number;
    comment: string;
    userName?: string;
}

export default function EventDashboardPage() {
    const { slug } = useParams<{ slug: string }>();
    const { data: event, isLoading, error } = useEvent(slug!);
    const { data: myPerms, isLoading: permsLoading } = useMyPermissions(event?.id);

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
    const { user } = useAuthStore();

    const { data: feedback, isLoading: feedbackLoading } = useQuery<FeedbackItem[]>({
        queryKey: ['feedback', event?.id],
        queryFn: async () => {
            try {
                const res = await axios.get(`/api/communication/events/${event?.id}/feedback`);
                return Array.isArray(res.data) ? res.data : [];
            } catch (err) {
                return [];
            }
        },
        enabled: !!event
    });

    if (isLoading || permsLoading) return <div className="p-8 text-center text-muted-foreground">Loading event...</div>;
    if (error || !event) return <div className="p-8 text-center text-destructive">Event not found</div>;

    const hasPermission = (key: string) => {
        if (!myPerms) return false;
        if (myPerms.permissions.includes('*')) return true;
        return myPerms.permissions.includes(key);
    };

    const canEdit = hasPermission('event.edit');
    const canManageStaff = hasPermission('staff.manage');
    const canViewSubmissions = hasPermission('submissions.view');
    const canViewParticipants = hasPermission('participants.view');
    const isManager = myPerms?.permissions.length > 0 || myPerms?.isOwner || myPerms?.isAdmin;
    const isParticipantView = !isManager;

    const editUrl = user?.role === 'admin' ? `/admin/events/create?id=${event?.id}&step=1` : `/org/events/create?id=${event?.id}&step=1`;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b px-6 py-4 flex items-center justify-between bg-card text-card-foreground">
                <Link to="/"><AppLogo size="sm" showText={false} /></Link>
                <div className="flex gap-4">
                    <Link to="/events" className="text-sm font-medium">All Events</Link>
                    <Link to="/dashboard" className="text-sm font-medium">My Dashboard</Link>
                </div>
            </header>

            <div className="h-64 sm:h-80 w-full bg-accent relative flex items-center justify-center">
                {event.bannerImageUrl ? (
                    <img src={event.bannerImageUrl} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-accent-foreground opacity-50 text-xl font-medium">Event Cover Image</span>
                )}
            </div>

            <main className="max-w-5xl mx-auto w-full px-6 py-8 flex flex-col md:flex-row gap-8 relative -mt-20">

                {/* Main Content */}
                <div className="flex-1 bg-card border rounded-2xl shadow-sm p-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {event.eventType}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${event.status === 'published' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                            {event.status}
                        </span>
                    </div>

                    <h1 className="text-4xl font-extrabold mb-4">{event.title}</h1>
                    <p className="text-lg text-muted-foreground mb-8">{event.description}</p>

                    <div className="prose dark:prose-invert max-w-none">
                        {/* Extended content would go here */}
                        <h3>Event Details</h3>
                        <p>Registration opens on {new Date(event.registrationStart).toLocaleDateString()} and closes on {new Date(event.registrationEnd).toLocaleDateString()}.</p>
                    </div>

                    <div className="mt-12 pt-12 border-t">
                        <div className="flex items-center gap-3 mb-8">
                            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                            <h2 className="text-2xl font-black tracking-tight uppercase italic">Community <span className="text-primary italic">Feedback</span></h2>
                        </div>

                        <div className="space-y-6">
                            {feedbackLoading ? (
                                <p className="text-muted-foreground">Loading feedback...</p>
                            ) : Array.isArray(feedback) && feedback.length > 0 ? (
                                feedback.map((fb: any, i: number) => (
                                    <div key={i} className="p-6 bg-secondary/30 rounded-3xl border border-transparent hover:border-primary/20 transition-all">
                                        <div className="flex items-center gap-1 mb-3">
                                            {[...Array(5)].map((_, s) => (
                                                <Star
                                                    key={s}
                                                    className={`h-3 w-3 ${fb.rating > s || fb.overallRating > s ? 'fill-yellow-500 text-yellow-500' : 'fill-none text-muted-foreground'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed">{fb.comment || fb.feedbackText}</p>
                                        <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            - {fb.userName || 'Anonymous'}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground italic">No feedback yet. Be the first to leave a review!</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="w-full md:w-80 space-y-6">
                    <div className="bg-card border rounded-2xl shadow-sm p-6 space-y-6">

                        {isParticipantView && (
                            <button className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
                                Register Now
                            </button>
                        )}

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-start gap-3">
                                <Calendar className="text-muted-foreground mt-0.5" size={20} />
                                <div>
                                    <p className="font-medium text-sm">Date & Time</p>
                                    <p className="text-sm text-muted-foreground">{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Users className="text-muted-foreground mt-0.5" size={20} />
                                <div>
                                    <p className="font-medium text-sm">Participation</p>
                                    <p className="text-sm text-muted-foreground">
                                        {event.allowTeams ? `Teams of ${event.teamMinSize}-${event.teamMaxSize}` : 'Individual Participation'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t flex flex-col gap-2">
                            {isManager && (
                                <div className="mb-2">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Management</span>
                                    <div className="flex flex-col gap-2 mt-2">
                                        {canManageStaff && (
                                            <Link
                                                to={`/org/events/${event.id}/team`}
                                                className="w-full flex items-center justify-center gap-2 py-2 bg-muted hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/30 rounded-md text-sm font-bold transition-all"
                                            >
                                                <Users size={16} /> Manage Team
                                            </Link>
                                        )}
                                        {canViewParticipants && (
                                            <Link
                                                to={`/org/events/${event.id}/participants`}
                                                className="w-full flex items-center justify-center gap-2 py-2 bg-muted hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/30 rounded-md text-sm font-bold transition-all"
                                            >
                                                <Users size={16} /> Manage Participants
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}

                            {canEdit && (
                                <div className="mb-2 border-t pt-3 mt-1">
                                    <span className="text-[10px] font-black text-red-500/80 uppercase tracking-widest">Administration</span>
                                    <Link to={editUrl} className="w-full mt-2 flex items-center justify-center gap-2 py-2 border rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-sm font-medium transition-colors">
                                        <Edit size={16} /> Edit Details
                                    </Link>
                                </div>
                            )}

                            {isParticipantView && (
                                <div className="mb-2 border-t pt-3 mt-1">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Participant Actions</span>
                                    <div className="flex flex-col gap-2 mt-2">
                                        <button
                                            onClick={() => setIsSubmissionOpen(true)}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-black transition-all hover:bg-primary hover:text-white"
                                        >
                                            <FileUp size={18} /> Submit Project
                                        </button>
                                        <button
                                            onClick={() => setIsFeedbackOpen(true)}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-secondary text-secondary-foreground rounded-xl text-sm font-black transition-all hover:bg-yellow-500 hover:text-white"
                                        >
                                            <Star size={18} /> Rate Event
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="border-t pt-3 mt-1 space-y-2">
                                <button className="w-full flex items-center justify-center gap-2 py-2 border border-transparent hover:border-border rounded-md hover:bg-accent text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                                    <Share2 size={16} /> Share Event
                                </button>
                                <button
                                    onClick={() => window.open(`/api/calendar/${event.id}/ics`, '_blank')}
                                    className="w-full flex items-center justify-center gap-2 py-2 border border-transparent hover:border-border rounded-md hover:bg-accent text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <Calendar size={16} /> Add to Calendar
                                </button>
                            </div>
                        </div>
                    </div>

                    {canViewSubmissions && (
                        <Link
                            to={`/org/events/${event.id}/submissions`}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-[2rem] font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest"
                        >
                            <FileUp className="h-5 w-5" />
                            Review Submissions
                        </Link>
                    )}
                </div>
            </main>
            {event && <GroupChatWidget eventId={event.id} />}

            {event && (
                <>
                    <FeedbackModal
                        eventId={event.id}
                        isOpen={isFeedbackOpen}
                        onClose={() => setIsFeedbackOpen(false)}
                    />
                    <SubmissionModal
                        eventId={event.id}
                        isOpen={isSubmissionOpen}
                        onClose={() => setIsSubmissionOpen(false)}
                    />
                </>
            )}
        </div>
    );
}
