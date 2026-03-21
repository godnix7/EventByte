import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { appConfig } from '@/config/app.config';
import { AppLogo } from '@/components/shared/AppLogo';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleRoute = (user: any) => {
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'organizer') navigate('/org');
        else navigate('/app');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { user, accessToken, refreshToken } = response.data;

            setAuth(user, accessToken, refreshToken);
            toast.success('Logged in successfully');
            handleRoute(user);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
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
            toast.error(error.response?.data?.message || 'Google Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md p-8 border rounded-2xl bg-card shadow-lg flex flex-col items-center">
                <AppLogo size="lg" />
                <h2 className="text-2xl font-bold mt-6 mb-2">Sign in to {appConfig.name}</h2>
                <p className="text-muted-foreground text-sm mb-6 text-center">Welcome back! Please enter your details.</p>

                <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="px-3 py-2 border rounded-md bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-3 py-2 border rounded-md bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 px-4 py-2 text-white font-medium rounded-md disabled:opacity-70 transition-opacity"
                        style={{ backgroundColor: appConfig.primaryColor }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
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
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium hover:underline" style={{ color: appConfig.primaryColor }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
