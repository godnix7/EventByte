import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AppLogo } from '@/components/shared/AppLogo';
import { CheckCircle, XCircle, Award, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { appConfig } from '@/config/app.config';
import { motion } from 'framer-motion';

export default function CertificateVerificationPage() {
    const { uid } = useParams<{ uid: string }>();

    const { data: certificate, isLoading, error } = useQuery({
        queryKey: ['certificate', uid],
        queryFn: async () => {
            const response = await api.get(`/certificates/verify/${uid}`);
            return response.data;
        },
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: appConfig.primaryColor }}></div>
                <p className="text-muted-foreground animate-pulse">Verifying Certificate Integrity...</p>
            </div>
        );
    }

    const isRevoked = certificate?.isRevoked;
    const isValid = certificate && !isRevoked;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 selection:bg-primary/30 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-20" style={{ backgroundColor: isValid ? '#10b981' : '#ef4444' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-10" style={{ backgroundColor: appConfig.primaryColor }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-xl mx-auto"
            >
                <div className="mb-10 text-center">
                    <Link to="/" className="inline-block transition-transform hover:scale-105">
                        <AppLogo size="lg" />
                    </Link>
                </div>

                <div className="rounded-[2.5rem] border border-border/50 bg-card/60 backdrop-blur-2xl shadow-2xl overflow-hidden shadow-primary/5">
                    {error || !certificate ? (
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-inner shadow-red-500/20">
                                <XCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight mb-3">Invalid Certificate</h2>
                            <p className="text-muted-foreground mb-8 text-lg">The certificate UID <span className="font-mono bg-muted px-2 py-1 rounded text-foreground">{uid}</span> could not be found or is mathematically invalid.</p>
                            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-background hover:bg-accent transition-colors font-medium">
                                Return Home
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <div className="px-10 py-12 text-center relative overflow-hidden">
                                {isValid ? (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                            className="w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] ring-1 ring-emerald-500/20"
                                        >
                                            <CheckCircle className="w-12 h-12" />
                                        </motion.div>
                                        <h2 className="text-4xl font-black tracking-tighter mb-2 text-emerald-600 dark:text-emerald-400">Verified Authentic</h2>
                                        <p className="text-emerald-700/80 dark:text-emerald-300/80 font-medium">This certificate was officially issued by {appConfig.name}</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
                                        <div className="w-24 h-24 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_-10px_rgba(239,68,68,0.5)] ring-1 ring-red-500/20">
                                            <XCircle className="w-12 h-12" />
                                        </div>
                                        <h2 className="text-4xl font-black tracking-tighter mb-2 text-red-600 dark:text-red-400">Certificate Revoked</h2>
                                        <p className="text-red-700/80 dark:text-red-300/80 font-medium">This certificate is no longer valid.</p>
                                    </>
                                )}
                            </div>

                            <div className="px-10 pb-10">
                                <div className="space-y-6 bg-background/50 rounded-2xl p-6 border border-border/50">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Award className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground font-medium mb-1">Certificate Type</p>
                                            <p className="font-semibold text-lg capitalize">{certificate.type.replace('_', ' ')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <span className="font-bold font-mono text-xs">ID</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground font-medium mb-1">Unique Identifier (UID)</p>
                                            <p className="font-mono font-medium text-foreground bg-accent/50 p-1.5 rounded-md inline-block text-sm border border-border/50">{certificate.certificateUid}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground font-medium mb-1">Issue Date</p>
                                            <p className="font-semibold">{format(new Date(certificate.issueDate), 'PPP')}</p>
                                        </div>
                                    </div>
                                </div>

                                {certificate.certificateUrl && (
                                    <div className="mt-8">
                                        <a
                                            href={certificate.certificateUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:scale-[1.02]"
                                            style={{ backgroundColor: appConfig.primaryColor, boxShadow: `0 10px 25px -5px ${appConfig.primaryColor}80` }}
                                        >
                                            Download Original PDF <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                )}

                                <div className="mt-8 text-center">
                                    <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
                                        Powered by {appConfig.name} <ShieldCheck className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
