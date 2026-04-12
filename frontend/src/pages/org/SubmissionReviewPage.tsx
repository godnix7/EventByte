import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { FileUp, Search, ExternalLink, CheckCircle2, XCircle, Clock, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const SubmissionReviewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchTerm, setSearchTerm] = React.useState('');

    const { data: submissions, isLoading, refetch } = useQuery({
        queryKey: ['event-submissions', id],
        queryFn: async () => {
            const res = await api.get(`/events/${id}/submissions`);
            return res.data.submissions;
        }
    });

    const statusMutation = useMutation({
        mutationFn: async ({ submissionId, status }: { submissionId: string, status: string }) => {
            await api.patch(`/events/${id}/submissions/${submissionId}`, { status });
        },
        onSuccess: () => {
            toast.success('Submission status updated');
            refetch();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    });

    if (isLoading) return <div className="p-20 text-center animate-pulse font-black text-2xl tracking-tighter">RETRIEVING DELIVERABLES...</div>;

    const filtered = submissions?.filter((s: any) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.participant?.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <Link to={`/app/events/${id}`} className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest hover:gap-3 transition-all">
                        <ChevronLeft className="h-4 w-4" /> Back to Event
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight">Project <span className="text-primary italic">Deliverables</span></h1>
                    <p className="text-muted-foreground font-medium">Review and evaluate materials submitted by {submissions?.length || 0} participants.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Find projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-secondary/50 border-none rounded-2xl px-12 py-3 focus:ring-2 focus:ring-primary/20 transition-all font-bold w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filtered?.map((sub: any, i: number) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-card rounded-[2.5rem] border overflow-hidden p-8 flex flex-col ring-1 ring-border shadow-sm hover:shadow-2xl transition-all"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <FileUp className="h-6 w-6 text-primary" />
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${sub.status === 'approved' ? 'bg-green-500/10 text-green-600' :
                                    sub.status === 'rejected' ? 'bg-red-500/10 text-red-600' :
                                        'bg-orange-500/10 text-orange-600'
                                    }`}>
                                    {sub.status}
                                </div>
                            </div>

                            <h3 className="text-xl font-black mb-1 line-clamp-1">{sub.title}</h3>
                            <p className="text-muted-foreground text-xs font-bold uppercase mb-6 tracking-wide italic">{sub.type}</p>

                            <div className="p-4 bg-secondary/30 rounded-2xl mb-6">
                                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                    {sub.notes || "No notes provided by the participant."}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black uppercase">
                                    {sub.participant?.user?.firstName[0]}
                                </div>
                                <div className="text-xs font-bold italic text-primary">
                                    {sub.participant?.user?.firstName} {sub.participant?.user?.lastName}
                                </div>
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-3">
                                <a
                                    href={sub.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="col-span-2 py-3 bg-primary text-white text-center rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all mb-2"
                                >
                                    Review Assets <ExternalLink className="h-3 w-3" />
                                </a>
                                <button
                                    onClick={() => statusMutation.mutate({ submissionId: sub.id, status: 'approved' })}
                                    className="py-3 bg-green-500/10 text-green-600 rounded-xl font-black text-[10px] uppercase tracking-tighter hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-1"
                                >
                                    <CheckCircle2 className="h-3 w-3" /> Approve
                                </button>
                                <button
                                    onClick={() => statusMutation.mutate({ submissionId: sub.id, status: 'rejected' })}
                                    className="py-3 bg-red-500/10 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-tighter hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-1"
                                >
                                    <XCircle className="h-3 w-3" /> Reject
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filtered?.length === 0 && (
                <div className="py-20 text-center bg-card rounded-[3rem] border border-dashed border-muted-foreground/20">
                    <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-black uppercase tracking-widest italic">No Deliverables Matching Query</p>
                </div>
            )}
        </div>
    );
};

export default SubmissionReviewPage;
