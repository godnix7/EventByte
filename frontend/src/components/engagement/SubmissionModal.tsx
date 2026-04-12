import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { FileUp, Send, X, Paperclip, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface SubmissionModalProps {
    eventId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ eventId, isOpen, onClose, onSuccess }) => {
    const [type, setType] = useState<'project' | 'poster' | 'resume' | 'other'>('project');
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [fileUrl, setFileUrl] = useState('');

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            await api.post(`/events/${eventId}/submissions`, data);
        },
        onSuccess: () => {
            toast.success('Project submitted successfully!');
            onClose();
            if (onSuccess) onSuccess();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to submit project');
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileUrl) return toast.error('Please provide a file URL');
        mutation.mutate({ type, title, notes, fileUrl, fileKey: 'TODO-S3-KEY' });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: 20 }}
                    className="bg-card w-full max-w-xl rounded-[3rem] border shadow-2xl overflow-hidden ring-1 ring-border"
                >
                    <div className="p-10 border-b flex items-center justify-between bg-primary/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20">
                                <FileUp className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tighter uppercase italic">Submit <span className="text-primary">Deliverable</span></h2>
                                <p className="text-muted-foreground text-sm font-medium">Ready to showcase your work?</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Project Title</label>
                                <input
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., EventByte V3 Evolution"
                                    className="w-full bg-secondary/30 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Type</label>
                                <select
                                    className="w-full bg-secondary/30 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold cursor-pointer"
                                    value={type}
                                    onChange={(e) => setType(e.target.value as any)}
                                >
                                    <option value="project">Standard Project</option>
                                    <option value="poster">Poster / UI Design</option>
                                    <option value="resume">Resume / Portfolio</option>
                                    <option value="other">Other Assets</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">File URL</label>
                                <div className="relative group">
                                    <Paperclip className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        required
                                        type="url"
                                        value={fileUrl}
                                        onChange={(e) => setFileUrl(e.target.value)}
                                        placeholder="GitHub/GDrive Link"
                                        className="w-full bg-secondary/30 border-none rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Additional Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any context or instructions for the judges..."
                                className="w-full h-24 p-6 rounded-3xl bg-secondary/30 border-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
                            />
                        </div>

                        <div className="p-4 bg-primary/5 rounded-2xl flex items-start gap-3 border border-primary/10">
                            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                            <p className="text-[10px] text-primary/70 font-bold uppercase tracking-wider leading-relaxed">
                                Once submitted, you can update your materials until the event deadline. Organizers will receive real-time notifications.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {mutation.isPending ? 'Uploading...' : (
                                <>
                                    <Send className="h-5 w-5" />
                                    Finalize Submission
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SubmissionModal;
