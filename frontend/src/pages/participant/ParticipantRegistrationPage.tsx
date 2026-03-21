import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

// Simplified schema for frontend usage
const registerSchema = z.object({
    resumeUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    linkedinUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    dietaryRestrictions: z.string().optional(),
});

type RegisterInput = z.infer<typeof registerSchema>;

export default function ParticipantRegistrationPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const { mutateAsync: submitRegistration, isPending } = useMutation({
        mutationFn: async (data: RegisterInput) => {
            // Format answers per backend schema
            const payload = {
                resumeUrl: data.resumeUrl || undefined,
                githubUrl: data.githubUrl || undefined,
                linkedinUrl: data.linkedinUrl || undefined,
                answers: {
                    dietaryRestrictions: data.dietaryRestrictions
                }
            };
            const response = await api.post(`/api/events/${eventId}/register`, payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Successfully registered for event!');
            navigate('/dashboard');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to register');
        }
    });

    const onSubmit = async (data: RegisterInput) => {
        await submitRegistration(data);
    };

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Event Registration</h1>
                <p className="text-muted-foreground mt-2">Complete your profile to participate in this event.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card border rounded-xl p-6 shadow-sm">

                <div className="space-y-2">
                    <label className="text-sm font-medium">GitHub URL</label>
                    <input
                        {...register('githubUrl')}
                        type="url"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="https://github.com/username"
                    />
                    {errors.githubUrl && <p className="text-xs text-destructive">{errors.githubUrl.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn URL</label>
                    <input
                        {...register('linkedinUrl')}
                        type="url"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="https://linkedin.com/in/username"
                    />
                    {errors.linkedinUrl && <p className="text-xs text-destructive">{errors.linkedinUrl.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Resume/CV Link (Optional)</label>
                    <input
                        {...register('resumeUrl')}
                        type="url"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="https://drive.google.com/..."
                    />
                    {errors.resumeUrl && <p className="text-xs text-destructive">{errors.resumeUrl.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Dietary Restrictions (Optional)</label>
                    <textarea
                        {...register('dietaryRestrictions')}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="e.g. Vegetarian, Nut Allergy"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    {isPending ? 'Submitting...' : 'Complete Registration'}
                </button>
            </form>
        </div>
    );
}
