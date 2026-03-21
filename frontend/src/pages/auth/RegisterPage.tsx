import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { appConfig } from '@/config/app.config';
import { AppLogo } from '@/components/shared/AppLogo';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        roleChoice: 'participant',
    });
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRoute = (user: any) => {
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'organizer') navigate('/org');
        else navigate('/app');
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/auth/register', formData);
            toast.success('Account created! Please sign in.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/google', { idToken: credentialResponse.credential });

            if (response.data.needsOnboarding) {
                // Temporarily store info and redirect to onboarding
                sessionStorage.setItem('google_idToken', credentialResponse.credential);
                sessionStorage.setItem('onboarding_user', JSON.stringify(response.data.user));
                navigate('/google-onboarding');
            } else {
                const { user, accessToken, refreshToken } = response.data;
                setAuth(user, accessToken, refreshToken);
                toast.success('Logged in successfully');
                handleRoute(user);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Google Sign-Up failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md p-8 border rounded-2xl bg-card shadow-lg flex flex-col items-center">
                <AppLogo size="lg" />
                <h2 className="text-2xl font-bold mt-6 mb-2">Create an account</h2>
                <p className="text-muted-foreground text-sm mb-6 text-center">Join {appConfig.name} today to start managing events.</p>

                <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">First Name</label>
                            <input name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="px-3 py-2 border rounded-md bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="John" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Last Name</label>
                            <input name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="px-3 py-2 border rounded-md bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Doe" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Username</label>
                        <input name="username" type="text" required value={formData.username} onChange={handleChange} className="px-3 py-2 border rounded-md bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="johndoe123" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Email</label>
                        <input name="email" type="email" required value={formData.email} onChange={handleChange} className="px-3 py-2 border rounded-md bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="john@example.com" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Password</label>
                        <input name="password" type="password" required value={formData.password} onChange={handleChange} className="px-3 py-2 border rounded-md bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="••••••••" />
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <label className="text-sm font-medium">I want to...</label>
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
                        className="mt-4 px-4 py-2 text-white font-medium rounded-md disabled:opacity-70 transition-opacity"
                        style={{ backgroundColor: appConfig.primaryColor }}
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                {appConfig.googleAuthEnabled && (
                    <div className="w-full mt-6 flex flex-col items-center">
                        <div className="flex items-center w-full mb-4">
                            <hr className="flex-1 border-muted" />
                            <span className="px-3 text-xs text-muted-foreground uppercase">Or continue with</span>
                            <hr className="flex-1 border-muted" />
                        </div>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google Sign-In Failed')}
                            useOneTap
                        />
                    </div>
                )}

                <p className="mt-6 text-sm text-center text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium hover:underline" style={{ color: appConfig.primaryColor }}>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
