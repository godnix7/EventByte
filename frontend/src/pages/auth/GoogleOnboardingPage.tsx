import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { appConfig } from '@/config/app.config';
import { AppLogo } from '@/components/shared/AppLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, UserCheck, Phone, School, Compass, ChevronRight, Loader2 } from 'lucide-react';
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
        <div className="min-h-screen w-full bg-[#050505] relative flex items-center justify-center p-6 sm:p-8 overflow-hidden">
            {/* Animated Mesh Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl relative z-10"
            >
                {/* Visual Header */}
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block p-4 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl mb-6 ring-1 ring-white/20"
                    >
                        <AppLogo size="xl" showText={false} />
                    </motion.div>
                    
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-3">
                        ALMOST <span className="text-primary italic">THERE.</span>
                    </h1>
                    <p className="text-white/60 font-medium">
                        Welcome, {googleUser.firstName}! Customize your profile to begin.
                    </p>
                </div>

                {/* Glassmorphic Form Card */}
                <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[3rem] shadow-2xl p-8 sm:p-12 relative overflow-hidden ring-1 ring-white/10">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="h-32 w-32 text-primary" />
                    </div>

                    <form onSubmit={handleOnboarding} className="space-y-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Username */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 ml-1 flex items-center gap-2">
                                    <UserCheck className="h-3 w-3" /> Unique Username *
                                </label>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all font-bold placeholder:text-white/20"
                                    placeholder="creative_spark"
                                />
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 ml-1 flex items-center gap-2">
                                    <Compass className="h-3 w-3" /> Purpose *
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, roleChoice: 'participant' }))}
                                        className={`flex-1 py-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${
                                            formData.roleChoice === 'participant' 
                                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                                        }`}
                                    >
                                        Attend
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, roleChoice: 'organizer' }))}
                                        className={`flex-1 py-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${
                                            formData.roleChoice === 'organizer' 
                                            ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/20' 
                                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                                        }`}
                                    >
                                        Host
                                    </button>
                                </div>
                            </div>

                            {/* College */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 ml-1 flex items-center gap-2">
                                    <School className="h-3 w-3" /> Institution
                                </label>
                                <input
                                    name="collegeName"
                                    type="text"
                                    value={formData.collegeName}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold placeholder:text-white/20"
                                    placeholder="University Name"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 ml-1 flex items-center gap-2">
                                    <Phone className="h-3 w-3" /> Contact (Optional)
                                </label>
                                <input
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold placeholder:text-white/20"
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                        </div>

                        {/* Organizer Warning */}
                        <AnimatePresence>
                            {formData.roleChoice === 'organizer' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                                        <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider leading-relaxed text-center">
                                            Admin verification is required for organizers before hosting events.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !formData.username}
                            className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed group uppercase tracking-[0.2em] text-sm italic"
                        >
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    Enter Platform <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
