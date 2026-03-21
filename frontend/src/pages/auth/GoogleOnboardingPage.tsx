import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { appConfig } from '@/config/app.config';
import { AppLogo } from '@/components/shared/AppLogo';
import toast from 'react-hot-toast';

export default function GoogleOnboardingPage() {
    const [formData, setFormData] = useState({
        username: '',
        collegeName: '',
        phone: '',
        roleChoice: 'participant',
    });
    const [loading, setLoading] = useState(false);
    const [googleUser, setGoogleUser] = useState<any>(null);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('google_idToken');
        const userStr = sessionStorage.getItem('onboarding_user');
        if (!token || !userStr) {
            navigate('/login');
            return;
        }
        setGoogleUser(JSON.parse(userStr));
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRoute = (user: any) => {
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'organizer') navigate('/org');
        else navigate('/app');
    };

    const handleOnboarding = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const idToken = sessionStorage.getItem('google_idToken');
        if (!idToken) {
            toast.error('Session expired. Please sign in again.');
            navigate('/login');
            return;
        }

        try {
            const response = await api.post('/auth/onboarding', {
                idToken,
                ...formData
            });

            const { user, accessToken, refreshToken } = response.data;
            setAuth(user, accessToken, refreshToken);
            toast.success('Onboarding complete!');

            // clear session storage
            sessionStorage.removeItem('google_idToken');
            sessionStorage.removeItem('onboarding_user');

            handleRoute(user);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Onboarding failed');
        } finally {
            setLoading(false);
        }
    };

    if (!googleUser) return null;

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md p-8 border rounded-2xl bg-card shadow-lg flex flex-col items-center">
                <AppLogo size="lg" />
                <h2 className="text-2xl font-bold mt-6 mb-2">Complete Your Profile</h2>
                <p className="text-muted-foreground text-sm mb-6 text-center">
                    Welcome, {googleUser.firstName}! Just a few more details to set up your account.
                </p>

                <form onSubmit={handleOnboarding} className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Username *</label>
                        <input name="username" type="text" required value={formData.username} onChange={handleChange} className="px-3 py-2 border rounded-md bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="creative_name" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">College/University (Optional)</label>
                        <input name="collegeName" type="text" value={formData.collegeName} onChange={handleChange} className="px-3 py-2 border rounded-md bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="University Name" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Phone Number (Optional)</label>
                        <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="px-3 py-2 border rounded-md bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="+1234567890" />
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <label className="text-sm font-medium">I want to... *</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer border rounded-md p-3 flex-1">
                                <input type="radio" name="roleChoice" value="participant" checked={formData.roleChoice === 'participant'} onChange={handleChange} className="accent-primary" />
                                <span className="text-sm font-medium">Join Events</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer border rounded-md p-3 flex-1">
                                <input type="radio" name="roleChoice" value="organizer" checked={formData.roleChoice === 'organizer'} onChange={handleChange} className="accent-primary" />
                                <span className="text-sm font-medium">Organize Events</span>
                            </label>
                        </div>
                        {formData.roleChoice === 'organizer' && (
                            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                                Note: Organizer accounts must be manually approved by an admin before you can create events.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 px-4 py-2 text-white font-medium rounded-md disabled:opacity-70 transition-opacity"
                        style={{ backgroundColor: appConfig.primaryColor }}
                    >
                        {loading ? 'Saving...' : 'Complete Setup'}
                    </button>
                </form>
            </div>
        </div>
    );
}
