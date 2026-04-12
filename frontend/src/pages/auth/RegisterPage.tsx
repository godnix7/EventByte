import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { appConfig } from '@/config/app.config';
import { AppLogo } from '@/components/shared/AppLogo';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Users, Zap } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role_choice: 'participant',
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
            await api.post('/auth/register/', formData);
            toast.success('Account created! Please sign in.');
            navigate('/login');
        } catch (error: any) {
            const errorData = error.response?.data;
            let errorMessage = 'Registration failed';
            
            if (typeof errorData === 'object' && errorData !== null) {
                // If there's a specific message field
                if (errorData.message) errorMessage = errorData.message;
                // If there are field errors (DRF style)
                else if (errorData.non_field_errors) errorMessage = errorData.non_field_errors[0];
                else {
                    const firstKey = Object.keys(errorData)[0];
                    if (firstKey) {
                        const firstError = errorData[firstKey];
                        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                        // Prepend field name for clarity if it's not a generic message
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
        <div className="flex min-h-screen bg-background overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            {/* Left Column: Visual */}
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-20 relative overflow-hidden bg-white/[0.01] border-r border-white/5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative z-10"
                >
                    <img 
                        src="/assets/3d-ticket.png" 
                        alt="Join The Force" 
                        className="w-[450px] h-auto animate-float drop-shadow-[0_0_80px_rgba(var(--secondary)/0.3)]"
                    />
                </motion.div>
                <div className="relative z-10 mt-16 text-center max-w-lg">
                    <h1 className="text-6xl font-black mb-6 tracking-tight text-glow" style={{ textShadow: '0 0 20px hsla(var(--secondary) / 0.4)' }}>Join the Force</h1>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                        Become part of the global community setting the new standard for digital and physical experiences.
                    </p>
                </div>
            </div>

            {/* Right Column: Auth Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10 overflow-y-auto custom-scrollbar">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-xl py-12"
                >
                    <div className="glass-dark p-10 lg:p-14 rounded-[3.5rem] shadow-2xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 blur-[80px]" />
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <Link to="/" className="mb-12 hover:scale-105 transition-transform">
                                <AppLogo size="lg" />
                            </Link>
                            
                            <h2 className="text-4xl font-black mb-3 tracking-tight">Create Identity</h2>
                            <p className="text-muted-foreground font-medium text-sm mb-12 text-center uppercase tracking-[0.3em] opacity-60">Begin Global Enrollment</p>

                            <form onSubmit={handleRegister} className="w-full flex flex-col gap-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">First Name</label>
                                        <input
                                            name="first_name"
                                            required
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 outline-none transition-all font-bold"
                                            placeholder="Caden"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Last Name</label>
                                        <input
                                            name="last_name"
                                            required
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 outline-none transition-all font-bold"
                                            placeholder="Sterling"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Universal Username</label>
                                    <input
                                        name="username"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 outline-none transition-all font-bold"
                                        placeholder="csterling_01"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Encrypted Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 outline-none transition-all font-bold"
                                        placeholder="user@neural.link"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Secure Passkey</label>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 outline-none transition-all font-bold"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Sector Selection</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`relative flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all cursor-pointer group/role ${
                                            formData.role_choice === 'participant' ? 'bg-secondary/10 border-secondary shadow-lg shadow-secondary/10' : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}>
                                            <input type="radio" name="role_choice" value="participant" checked={formData.role_choice === 'participant'} onChange={handleChange} className="hidden" />
                                            <div className={`p-3 rounded-2xl transition-colors ${formData.role_choice === 'participant' ? 'bg-secondary text-white' : 'bg-white/10'}`}>
                                                <Users size={20} />
                                            </div>
                                            <span className="text-sm font-black uppercase tracking-widest">Joiner</span>
                                        </label>
                                        <label className={`relative flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all cursor-pointer group/role ${
                                            formData.role_choice === 'organizer' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}>
                                            <input type="radio" name="role_choice" value="organizer" checked={formData.role_choice === 'organizer'} onChange={handleChange} className="hidden" />
                                            <div className={`p-3 rounded-2xl transition-colors ${formData.role_choice === 'organizer' ? 'bg-primary text-white' : 'bg-white/10'}`}>
                                                <Zap size={20} />
                                            </div>
                                            <span className="text-sm font-black uppercase tracking-widest">Architect</span>
                                        </label>
                                    </div>
                                    {formData.role_choice === 'organizer' && (
                                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                                            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest leading-relaxed">
                                                Note: Architect status requires verification by the High Council.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative mt-4 h-18 w-full rounded-[2rem] bg-secondary text-white font-black text-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_25px_50px_-12px_rgba(var(--secondary)/0.5)] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {loading ? 'Initializing...' : 'Initialize Identity'}
                                </button>
                            </form>

                            {appConfig.googleAuthEnabled && (
                                <div className="w-full mt-12 flex flex-col items-center">
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

                            <p className="mt-14 text-sm text-center font-bold text-muted-foreground">
                                Already identified?{' '}
                                <Link to="/login" className="text-secondary hover:underline">
                                    Verify Session
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
