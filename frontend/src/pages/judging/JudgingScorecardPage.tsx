import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

// Complex dynamic schema based on backend rubric requirements
const scoreSchema = z.object({
    scores: z.record(z.number().min(0).max(10, 'Score must be between 0 and 10')),
    comments: z.string().max(1000).optional()
});

export default function JudgingScorecardPage() {
    const { eventId, teamId } = useParams<{ eventId: string, teamId: string }>();
    const navigate = useNavigate();

    // Fetch rubric criteria
    const { data: rubric, isLoading } = useQuery({
        queryKey: ['rubric', eventId],
        queryFn: async () => {
            // In real app, fetch from `/api/events/${eventId}/rubrics`
            return {
                id: '123',
                name: 'Technical Innovation',
                criteria: [
                    { id: 'c1', name: 'Creativity', description: 'How innovative is the solution?', max_points: 10 },
                    { id: 'c2', name: 'Technical Complexity', description: 'Difficulty of technical implementation', max_points: 10 },
                    { id: 'c3', name: 'UI/UX', description: 'Design and usability of the interface', max_points: 10 }
                ]
            };
        }
    });

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof scoreSchema>>({
        resolver: zodResolver(scoreSchema),
        defaultValues: { scores: {} }
    });

    const { mutateAsync: submitScore, isPending } = useMutation({
        mutationFn: async (data: z.infer<typeof scoreSchema>) => {
            // Aggregate total 
            let total = 0;
            Object.values(data.scores).forEach(val => { total += Number(val) || 0; });

            const payload = {
                rubricId: rubric?.id,
                scoreData: data.scores,
                totalScore: total,
                comments: data.comments
            };

            await api.post(`/api/scores?teamId=${teamId}`, payload);
        },
        onSuccess: () => {
            toast.success('Scores submitted successfully!');
            navigate('/dashboard'); // Go back to dashboard to score next team
        },
        onError: (e: any) => {
            toast.error(e.response?.data?.message || 'Failed to submit scores');
        }
    });

    if (isLoading) return <div className="p-12 text-center text-muted-foreground">Loading rubric...</div>;

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <div className="mb-8 border-b pb-6">
                <h1 className="text-3xl font-bold tracking-tight">Evaluate Team</h1>
                <p className="text-muted-foreground mt-2">Team ID: <span className="font-mono text-primary">{teamId}</span></p>
            </div>

            <form onSubmit={handleSubmit((d) => submitScore(d))}>
                <div className="space-y-8 mb-8">
                    {rubric?.criteria.map((c: any) => (
                        <div key={c.id} className="bg-card border rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{c.name}</h3>
                                    <p className="text-sm text-muted-foreground">{c.description}</p>
                                </div>
                                <div className="bg-muted px-3 py-1 text-sm font-medium rounded-md">
                                    Max: {c.max_points}
                                </div>
                            </div>

                            <div>
                                <input
                                    type="number"
                                    step="0.5"
                                    {...register(`scores.${c.id}`, { valueAsNumber: true })}
                                    className="flex h-12 w-32 rounded-md border border-input bg-background px-3 py-2 text-lg font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="0.0"
                                />
                                {errors.scores?.[c.id] && <p className="text-xs text-destructive mt-1">{errors.scores[c.id]?.message as string}</p>}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-sm mb-8 space-y-4">
                    <h3 className="font-semibold">Additional Comments (Optional)</h3>
                    <textarea
                        {...register('comments')}
                        placeholder="Provide constructive feedback for the team..."
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 rounded-md font-medium text-foreground bg-muted hover:bg-muted/80"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-2 rounded-md font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isPending ? 'Submitting...' : 'Submit Evaluation'}
                    </button>
                </div>
            </form>
        </div>
    );
}
