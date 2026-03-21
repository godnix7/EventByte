import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export interface Judge {
    id: string;
    eventId: string;
    userId: string;
    expertiseArea: string | null;
    affiliation: string | null;
    bio: string | null;
    rating: number | null;
    isActive: boolean;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatarUrl: string | null;
    };
}

export function useJudges(eventId: string) {
    return useQuery({
        queryKey: ['judges', eventId],
        queryFn: async () => {
            const { data } = await api.get(`/admin/events/${eventId}/judges`);
            return data.judges as Judge[];
        },
        enabled: !!eventId,
    });
}

export function useAddJudge(eventId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { userId: string; expertiseArea?: string; affiliation?: string; bio?: string }) => {
            const { data } = await api.post(`/admin/events/${eventId}/judges`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['judges', eventId] });
            toast.success('Judge added successfully');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to add judge');
        }
    });
}

export function useRemoveJudge(eventId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (judgeId: string) => {
            await api.delete(`/admin/events/${eventId}/judges/${judgeId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['judges', eventId] });
            toast.success('Judge removed successfully');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to remove judge');
        }
    });
}
