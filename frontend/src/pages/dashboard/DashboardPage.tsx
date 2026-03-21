import { useAuthStore } from '@/store/authStore';
import { Calendar, Trophy, Ticket, Users } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.firstName}! 👋</h1>
                    <p className="text-muted-foreground mt-2">Here is a summary of your assigned events and teams.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Role-Specific Stat Cards */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">Upcoming Events</span>
                    </div>
                    <span className="text-3xl font-bold">2</span>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Ticket className="h-4 w-4" />
                        <span className="text-sm font-medium">My Registrations</span>
                    </div>
                    <span className="text-3xl font-bold">1</span>
                </div>

                {['admin', 'organizer', 'judge'].includes(user.role) && (
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Trophy className="h-4 w-4" />
                            <span className="text-sm font-medium">Scores to Submit</span>
                        </div>
                        <span className="text-3xl font-bold">12</span>
                    </div>
                )}

                {['admin', 'organizer', 'committee_member'].includes(user.role) && (
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span className="text-sm font-medium">Pending Approvals</span>
                        </div>
                        <span className="text-3xl font-bold">5</span>
                    </div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Your Teams list */}
                <div className="rounded-xl border bg-card shadow-sm p-6">
                    <h3 className="font-semibold mb-4 text-lg">My Teams</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div>
                                <p className="font-medium text-primary">HackYeah Innovators</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" /> Spring Hackathon 2026
                                </p>
                            </div>
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                                Leader
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div>
                                <p className="font-medium text-foreground">Code Ninjas</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" /> Global Game Jam
                                </p>
                            </div>
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                                Member
                            </span>
                        </div>
                    </div>
                </div>

                {/* Active Commitments depending on Role */}
                <div className="rounded-xl border bg-card shadow-sm p-6">
                    <h3 className="font-semibold mb-4 text-lg">
                        {['admin', 'organizer', 'committee_member'].includes(user.role) ? 'My Committees' : 'Assigned Judging Tracks'}
                    </h3>
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <div className="bg-muted p-4 rounded-full mb-4">
                            <Calendar className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <p className="font-medium text-foreground">Nothing assigned yet</p>
                        <p className="text-sm">When you are assigned to a task or group, it will appear here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
