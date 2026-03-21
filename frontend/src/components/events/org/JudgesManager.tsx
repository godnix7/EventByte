import { useState } from 'react';
import { useJudges, useAddJudge, useRemoveJudge } from '@/hooks/useJudges';
import { Plus, Trash2, Shield, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JudgesManager({ eventId }: { eventId: string }) {
    const { data: judges, isLoading } = useJudges(eventId);
    const addJudgeMutation = useAddJudge(eventId);
    const removeJudgeMutation = useRemoveJudge(eventId);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState({ userId: '', expertiseArea: '', affiliation: '', bio: '' });

    // In a real scenario, you'd want an autocomplete to search users. For now, we expect a User ID or Email to be translated.
    // For simplicity, let's assume the user has to input the exact User ID or we build a search.
    // To make it robust without a complex search dropdown right now, we can just allow them to paste the ID.

    if (isLoading) return <div className="p-8 text-center text-muted-foreground bg-card rounded-2xl border border-border">Loading judges...</div>;

    const handleAddJudge = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addForm.userId) return;
        await addJudgeMutation.mutateAsync(addForm);
        setAddForm({ userId: '', expertiseArea: '', affiliation: '', bio: '' });
        setIsAddModalOpen(false);
    };

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Scale className="w-5 h-5 text-primary" />
                        Event Judges
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage the judging panel for this event's submissions.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus size={16} />
                    Add Judge
                </button>
            </div>

            <div className="p-0">
                {judges && judges.length > 0 ? (
                    <div className="divide-y divide-border">
                        {judges.map(judge => (
                            <div key={judge.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                                        {judge.user.avatarUrl ? (
                                            <img src={judge.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            judge.user.firstName.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground flex items-center gap-2">
                                            {judge.user.firstName} {judge.user.lastName}
                                            {judge.isActive && <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">ACTIVE</span>}
                                        </div>
                                        <div className="text-sm text-muted-foreground">{judge.user.email}</div>

                                        {(judge.expertiseArea || judge.affiliation) && (
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                {judge.expertiseArea && <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium border border-border">{judge.expertiseArea}</span>}
                                                {judge.affiliation && <span className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="w-3 h-3" /> {judge.affiliation}</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                    <button
                                        onClick={() => {
                                            if (confirm(`Remove ${judge.user.firstName} as a judge?`)) {
                                                removeJudgeMutation.mutate(judge.id);
                                            }
                                        }}
                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                        title="Remove Judge"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <Scale className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-bold text-foreground">No Judges Assigned</h3>
                        <p className="text-muted-foreground max-w-sm mt-2">Add judges to allow them to review and score participant submissions based on your rubrics.</p>
                    </div>
                )}
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card w-full max-w-md rounded-2xl border shadow-xl flex flex-col overflow-hidden"
                    >
                        <form onSubmit={handleAddJudge} className="p-6 flex flex-col gap-4">
                            <h3 className="text-lg font-bold">Add Judge</h3>
                            <p className="text-sm text-muted-foreground -mt-2">Enter the User ID of the platform user you wish to assign as a judge.</p>

                            <div className="space-y-1 mt-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">User ID <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    className="w-full text-sm border-2 rounded-xl px-4 py-2.5 bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    placeholder="e.g. cm0q..."
                                    value={addForm.userId}
                                    onChange={e => setAddForm({ ...addForm, userId: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Expertise Area</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm border-2 rounded-xl px-4 py-2.5 bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                        placeholder="e.g. AI, UI/UX"
                                        value={addForm.expertiseArea}
                                        onChange={e => setAddForm({ ...addForm, expertiseArea: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Affiliation</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm border-2 rounded-xl px-4 py-2.5 bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                        placeholder="e.g. Google, MIT"
                                        value={addForm.affiliation}
                                        onChange={e => setAddForm({ ...addForm, affiliation: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bio (Optional)</label>
                                <textarea
                                    rows={3}
                                    className="w-full text-sm border-2 rounded-xl px-4 py-2.5 bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
                                    placeholder="Brief background..."
                                    value={addForm.bio}
                                    onChange={e => setAddForm({ ...addForm, bio: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 mt-2 border-t">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-bold rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                                    Cancel
                                </button>
                                <button type="submit" disabled={addJudgeMutation.isPending} className="px-5 py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50">
                                    {addJudgeMutation.isPending ? 'Adding...' : 'Add to Panel'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
