import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { AppLogo } from '@/components/shared/AppLogo';
import { Clock, RefreshCcw, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PendingApprovalPage() {
    const { user, setAuth, logout, accessToken, refreshToken } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.organizerStatus === 'approved') {
            navigate('/org', { replace: true });
        }
    }, [user, navigate]);

    const checkStatus = async () => {
        setLoading(true);
        try {
            const response = await api.get('/auth/me');
            if (response.data.user) {
                setAuth(response.data.user, accessToken!, refreshToken!);
                if (response.data.user.organizerStatus === 'approved') {
                    toast.success('Your account has been approved!');
                    navigate('/org', { replace: true });
                } else if (response.data.user.organizerStatus === 'rejected') {
                    toast.error('Your request was rejected. Please contact support.');
                } else {
                    toast.success('Still pending approval. Please check back later.', { icon: '⌛' });
                }
            }
        } catch (error: any) {
            console.error('Failed to check status', error);
            toast.error('Failed to check status');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center p-8 bg-background">
            <div className="max-w-md w-full text-center border rounded-2xl bg-card shadow-lg p-8 flex flex-col items-center gap-6">
                <AppLogo size="lg" />

                <div className="bg-amber-100 dark:bg-amber-900/30 p-5 rounded-full mt-4 flex items-center justify-center">
                    <Clock className="h-10 w-10 text-amber-600 dark:text-amber-500" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-3">Account Pending Approval</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Your Organizer account is currently pending approval from an administrator.
                        You will not be able to create events until your account is activated.
                    </p>
                </div>

                <div className="flex flex-col gap-3 w-full mt-4">
                    <button
                        onClick={checkStatus}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md disabled:opacity-70 transition-opacity hover:opacity-90"
                    >
                        <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Checking...' : 'Check Status Now'}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-muted font-medium rounded-md hover:bg-accent transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
