import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { appConfig } from '@/config/app.config';
import { AppLogo } from '@/components/shared/AppLogo';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
            const response = await api.post('/auth/login/', { email, password });
            const { user, accessToken, refreshToken } = response.data;

            setAuth(user, accessToken, refreshToken);
            toast.success('Logged in successfully');
            handleRoute(user);
        } catch (error: any) {
            const errorData = error.response?.data;
            let errorMessage = 'Login failed';
            
            if (typeof errorData === 'object' && errorData !== null) {
                if (errorData.message) errorMessage = errorData.message;
                else if (errorData.error) errorMessage = errorData.error;
                else if (errorData.detail) errorMessage = errorData.detail;
                else if (errorData.non_field_errors) errorMessage = errorData.non_field_errors[0];
                else {
                    const firstKey = Object.keys(errorData)[0];
                    if (firstKey) {
                        const firstError = errorData[firstKey];
                        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                        if (firstKey !== 'error' && firstKey !== 'detail') {
                            errorMessage = `${firstKey}: ${errorMessage}`;
                        }
                    }
                }
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/google', { idToken: credentialResponse.credential });

            if (response.data.needsOnboarding) {
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
        <div className="flex min-h-screen bg-background overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            {/* Left Column: Cinematic Visual */}
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-20 relative overflow-hidden bg-white/[0.02]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative z-10"
                >
                    <img 
                        src="/assets/auth-shield.png" 
                        alt="Security Shield" 
                        className="w-[400px] h-auto animate-float drop-shadow-[0_0_50px_rgba(var(--primary)/0.3)]"
                    />
                </motion.div>
                <div className="relative z-10 mt-12 text-center max-w-lg">
                    <h1 className="text-5xl font-black mb-6 tracking-tight text-glow">Guardian of Events</h1>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                        Access your premium console and manage high-stakes gatherings with bulletproof security.
                    </p>
                </div>
            </div>

            {/* Right Column: Auth Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-dark p-10 rounded-[3rem] shadow-2xl border border-white/10 relative overflow-hidden group">
                        {/* Glow on form */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[60px] group-hover:bg-primary/30 transition-all duration-500" />
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <Link to="/" className="mb-10 hover:scale-105 transition-transform">
                                <AppLogo size="lg" />
                            </Link>
                            
                            <h2 className="text-3xl font-black mb-2 tracking-tight">Sign In</h2>
                            <p className="text-muted-foreground font-medium text-sm mb-10 text-center uppercase tracking-widest opacity-60">Authentication Required</p>

                            <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Terminal</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg"
                                        placeholder="user@eventbyte.terminal"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between px-1">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Access Key</label>
                                        <Link to="/forgot-password"><span className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Lost access?</span></Link>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative mt-4 h-16 w-full rounded-2xl bg-primary text-white font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_-10px_rgba(var(--primary)/0.5)] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {loading ? 'Decrypting...' : 'Authorize Session'}
                                </button>
                            </form>

                            {appConfig.googleAuthEnabled && (
                                <div className="w-full mt-10 flex flex-col items-center">
                                    <div className="flex items-center w-full mb-8">
                                        <hr className="flex-1 border-white/10" />
                                        <span className="px-4 text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">Neural Link</span>
                                        <hr className="flex-1 border-white/10" />
                                    </div>
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => toast.error('Link Failed')}
                                        useOneTap
                                    />
                                </div>
                            )}

                            <p className="mt-12 text-sm text-center font-bold text-muted-foreground">
                                No session established?{' '}
                                <Link to="/register" className="text-primary hover:underline">
                                    Create New Force
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

