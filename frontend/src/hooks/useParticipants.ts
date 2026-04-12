import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Participant {
    id: string;
    eventId: string;
    userId: string;
    registrationNumber: string | null;
    status: string;
    role: string;
    checkedIn: boolean;
    checkedInAt: string | null;
    registrationDate: string;
    formResponses: any; // Depending on the JSON structure
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        collegeName: string | null;
        profilePhotoUrl: string | null;
    };
    payments?: any[]; // For future use if payments are attached
}

export function useEventParticipants(eventId: string) {
    return useQuery({
        queryKey: ['participants', eventId],
        queryFn: async () => {
            const { data } = await api.get(`/admin/events/${eventId}/participants/`);
            return data.participants as Participant[];
        },
        enabled: !!eventId,
    });
}

export function useCheckInParticipant(eventId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (registrationNumber: string) => {
            const { data } = await api.post(`/admin/events/${eventId}/checkin/`, { registrationNumber });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['participants', eventId] });
        }
    });
}
