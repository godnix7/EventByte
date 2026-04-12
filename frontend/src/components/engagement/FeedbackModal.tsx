import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Star, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface FeedbackModalProps {
    eventId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ eventId, isOpen, onClose, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const mutation = useMutation({
        mutationFn: async (data: { rating: number; comment: string }) => {
            await api.post(`/engagement/events/${eventId}/feedback`, data);
        },
        onSuccess: () => {
            toast.success('Thank you for your feedback!');
            onClose();
            if (onSuccess) onSuccess();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to submit feedback');
        }
    });

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-card w-full max-w-lg rounded-[2.5rem] border shadow-2xl overflow-hidden ring-1 ring-border"
                >
                    <div className="p-8 border-b flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">Rate the <span className="text-primary italic">Event</span></h2>
                            <p className="text-muted-foreground text-sm">Your feedback helps organizers improve!</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Rating Stars */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setRating(s)}
                                        className={`p-3 rounded-2xl transition-all duration-300 ${rating >= s ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-secondary text-muted-foreground hover:bg-primary/10'}`}
                                    >
                                        <Star className={`h-8 w-8 ${rating >= s ? 'fill-current' : 'fill-none'}`} />
                                    </button>
                                ))}
                            </div>
                            <span className="font-black text-xl text-primary uppercase tracking-tighter">
                                {['Terrible', 'Poor', 'Average', 'Good', 'Amazing!'][rating - 1]}
                            </span>
                        </div>

                        {/* Comment area */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Tell us more (Optional)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What did you like? What could be better?"
                                className="w-full h-32 p-6 rounded-3xl bg-secondary/50 border-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-lg"
                            />
                        </div>

                        <button
                            onClick={() => mutation.mutate({ rating, comment })}
                            disabled={mutation.isPending}
                            className="w-full py-5 bg-primary text-white font-black rounded-3xl hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {mutation.isPending ? 'Sending...' : (
                                <>
                                    <Send className="h-5 w-5" />
                                    Submit Feedback
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FeedbackModal;
