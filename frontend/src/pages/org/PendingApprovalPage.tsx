import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { AppLogo } from '@/components/shared/AppLogo';
import { Clock, RefreshCcw, LogOut, Loader2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
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
        <div className="min-h-screen w-full bg-[#050505] relative flex items-center justify-center p-6 sm:p-8 overflow-hidden">
            {/* Animated Mesh Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[3.5rem] shadow-2xl p-10 sm:p-14 text-center ring-1 ring-white/10 overflow-hidden relative">
                    {/* Decorative Ring */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

                    <div className="mb-10">
                        <AppLogo size="lg" />
                    </div>

                    <motion.div 
                        animate={{ 
                            boxShadow: ["0 0 0px rgba(245, 158, 11, 0)", "0 0 40px rgba(245, 158, 11, 0.2)", "0 0 0px rgba(245, 158, 11, 0)"] 
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="bg-amber-500/10 p-8 rounded-[2.5rem] inline-block mb-10 border border-amber-500/20 relative group"
                    >
                        <Clock className="h-16 w-16 text-amber-500 animate-[spin_10s_linear_infinite]" />
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-amber-500 p-2 rounded-full border-4 border-[#050505]"
                        >
                            <ShieldAlert className="h-4 w-4 text-black font-black" />
                        </motion.div>
                    </motion.div>

                    <div className="space-y-4 mb-12">
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                            Verification <span className="text-amber-500">Pending</span>
                        </h2>
                        <p className="text-white/60 font-medium leading-relaxed max-w-md mx-auto">
                            Your <span className="text-white font-bold">Organizer Profile</span> is currently being reviewed by our administrative force.
                            You'll receive a notification once access is granted.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={checkStatus}
                            disabled={loading}
                            className="w-full py-5 bg-amber-500 text-black font-black rounded-3xl shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 group uppercase tracking-widest text-sm"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <RefreshCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-700" />
                                    Check Status Now
                                </>
                            )}
                        </button>
                        
                        <button
                            onClick={handleLogout}
                            className="w-full py-5 bg-white/5 border border-white/10 text-white/60 font-black rounded-3xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out Securely
                        </button>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-4 text-white/20 select-none">
                        <div className="h-px w-8 bg-current" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase">STITCH PLATINUM SERVICE</span>
                        <div className="h-px w-8 bg-current" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
