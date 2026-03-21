import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { appConfig } from '@/config/app.config';
import { queryClient } from '@/lib/queryClient';
import { RoleRoute } from '@/components/shared/RoleRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { OrganizerLayout } from '@/components/layout/OrganizerLayout';
import { ParticipantLayout } from '@/components/layout/ParticipantLayout';
import { AppLogo } from '@/components/shared/AppLogo';
import { useAuthStore } from '@/store/authStore';
import { initSocket, disconnectSocket } from '@/lib/socket';
import { GlobalSocketListener } from '@/components/shared/GlobalSocketListener';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

// Lazy loaded pages to demonstrate routing
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const EventsPage = lazy(() => import('@/pages/events/EventsPage'));
const CreateEventPage = lazy(() => import('@/pages/events/CreateEventPage'));
const EventDashboardPage = lazy(() => import('@/pages/event/EventDashboardPage'));
const ParticipantRegistrationPage = lazy(() => import('@/pages/participant/ParticipantRegistrationPage'));
const ParticipantTicketPage = lazy(() => import('@/pages/participant/ParticipantTicketPage'));
const JudgingLeaderboardPage = lazy(() => import('@/pages/judging/JudgingLeaderboardPage'));
const JudgingScorecardPage = lazy(() => import('@/pages/judging/JudgingScorecardPage'));
const CertificateVerificationPage = lazy(() => import('@/pages/certificates/CertificateVerificationPage'));
const GoogleOnboardingPage = lazy(() => import('@/pages/auth/GoogleOnboardingPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const PendingApprovalPage = lazy(() => import('@/pages/org/PendingApprovalPage'));
const ManageTeamPage = lazy(() => import('@/pages/org/ManageTeamPage'));
const DiscoverPage = lazy(() => import('@/pages/DiscoverPage'));
const SavedEventsPage = lazy(() => import('@/pages/SavedEventsPage'));
const ClubsHubPage = lazy(() => import('@/pages/ClubsHubPage'));
const ClubProfilePage = lazy(() => import('@/pages/ClubProfilePage'));
const EventAnalyticsPage = lazy(() => import('@/pages/org/EventAnalyticsPage'));
const EventParticipantsPage = lazy(() => import('@/pages/org/EventParticipantsPage'));
const PlatformDashboard = lazy(() => import('@/pages/admin/PlatformDashboard'));
const SubmissionReviewPage = lazy(() => import('@/pages/org/SubmissionReviewPage'));
const ClubManagementPage = lazy(() => import('@/pages/org/ClubManagementPage'));

const FullScreenLoader = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
            <AppLogo size="lg" />
            <p className="mt-4 text-muted-foreground">Loading EventByte...</p>
        </div>
    </div>
);

const CreateEventRedirect = () => {
    const { user } = useAuthStore();
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/events/create" replace />;
    if (user.role === 'organizer') return <Navigate to="/org/events/create" replace />;
    return <Navigate to="/app" replace />;
};

function App() {
    const { accessToken } = useAuthStore();

    useEffect(() => {
        document.title = appConfig.name;
        if (appConfig.faviconUrl) {
            let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = appConfig.faviconUrl;
        }

        document.documentElement.style.setProperty('--color-primary', appConfig.primaryColor);
        document.documentElement.style.setProperty('--color-secondary', appConfig.secondaryColor);
    }, []);

    useEffect(() => {
        if (accessToken) {
            initSocket();
        } else {
            disconnectSocket();
        }
    }, [accessToken]);

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ErrorBoundary>
                    <Suspense fallback={<FullScreenLoader />}>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/events" element={<EventsPage />} />
                            <Route path="/events/create" element={<CreateEventRedirect />} />
                            <Route path="/events/:slug" element={<EventDashboardPage />} />
                            <Route path="/certificates/verify/:uid" element={<CertificateVerificationPage />} />
                            <Route path="/google-onboarding" element={<GoogleOnboardingPage />} />
                            <Route path="/discover" element={<DiscoverPage />} />
                            <Route path="/clubs" element={<ClubsHubPage />} />
                            <Route path="/clubs/:id" element={<ClubProfilePage />} />

                            {/* Participant Routes */}
                            <Route element={<RoleRoute allowedRoles={['participant', 'organizer', 'admin']} />}>
                                <Route element={<ParticipantLayout />}>
                                    <Route path="/app" element={<DashboardPage />} />
                                    <Route path="/app/saved" element={<SavedEventsPage />} />
                                    <Route path="/app/registrations" element={<div className="p-4">My Registrations (Coming Soon)</div>} />
                                    <Route path="/events/:eventId/register" element={<ParticipantRegistrationPage />} />
                                    <Route path="/tickets/:ticketId" element={<ParticipantTicketPage />} />
                                </Route>
                            </Route>

                            {/* Organizer Routes */}
                            <Route element={<RoleRoute allowedRoles={['organizer', 'admin']} requireApprovedOrganizer={true} />}>
                                <Route element={<OrganizerLayout />}>
                                    <Route path="/org" element={<DashboardPage />} />
                                    <Route path="/org/events" element={<EventsPage />} />
                                    <Route path="/org/events/create" element={<CreateEventPage />} />
                                    <Route path="/org/events/:id/team" element={<ManageTeamPage />} />
                                    <Route path="/org/events/:id/analytics" element={<EventAnalyticsPage />} />
                                    <Route path="/org/events/:id/participants" element={<EventParticipantsPage />} />
                                    <Route path="/org/events/:id/submissions" element={<SubmissionReviewPage />} />

                                    <Route path="/org/events/:eventId/leaderboard" element={<JudgingLeaderboardPage />} />
                                    <Route path="/org/events/:eventId/judge/:teamId" element={<JudgingScorecardPage />} />
                                    <Route path="/org/clubs/:id/manage" element={<ClubManagementPage />} />
                                </Route>
                            </Route>

                            {/* Organizer Pending Approval Route */}
                            <Route element={<RoleRoute allowedRoles={['organizer']} />}>
                                <Route path="/org/pending-approval" element={<PendingApprovalPage />} />
                            </Route>

                            {/* Admin Routes */}
                            <Route element={<RoleRoute allowedRoles={['admin']} />}>
                                <Route element={<AdminLayout />}>
                                    <Route path="/admin" element={<PlatformDashboard />} />
                                    <Route path="/admin/users" element={<AdminUsersPage />} />
                                    <Route path="/admin/events" element={<EventsPage />} />
                                    <Route path="/admin/events/create" element={<CreateEventPage />} />
                                </Route>
                            </Route>

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                        <GlobalSocketListener />
                    </Suspense>
                    <Toaster position="bottom-right" />
                </ErrorBoundary>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
