import { api } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateEventInput } from '@/schemas/event.schema';

export const useEvents = (options?: { public?: boolean; manage?: boolean }) => {
    return useQuery({
        queryKey: ['events', options],
        queryFn: async () => {
            const { data } = await api.get('/events', { params: options });
            return data.events;
        },
    });
};

export const useEvent = (idOrSlug: string) => {
    return useQuery({
        queryKey: ['event', idOrSlug],
        queryFn: async () => {
            const { data } = await api.get(`/events/${idOrSlug}`);
            return data.event;
        },
        enabled: !!idOrSlug,
    });
};

export const useMyPermissions = (eventId: string) => {
    return useQuery({
        queryKey: ['event', eventId, 'my-permissions'],
        queryFn: async () => {
            const { data } = await api.get(`/events/${eventId}/my-permissions`);
            return data;
        },
        enabled: !!eventId,
    });
};

export const useCreateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateEventInput) => {
            const { data } = await api.post('/events', payload);
            return data.event;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};
export const useUpdateEvent = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await api.put(`/events/${id}`, payload);
            return data.event;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event', id] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};

export const useUpdateEventWizardStep = (id: string, step: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await api.put(`/events/${id}/${step}`, payload);
            return data.event;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event', id] });
        },
    });
};

export const usePublishEvent = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { data } = await api.post(`/events/${id}/publish`);
            return data.event;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event', id] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};
export const useRegistrationFields = (eventId: string) => {
    return useQuery({
        queryKey: ['event', eventId, 'registration-fields'],
        queryFn: async () => {
            const { data } = await api.get(`/events/${eventId}/registration-fields`);
            return data.fields;
        },
        enabled: !!eventId,
    });
};

export const useUpdateRegistrationFields = (eventId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (fields: any[]) => {
            const { data } = await api.put(`/events/${eventId}/registration-fields`, { fields });
            return data.fields;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event', eventId, 'registration-fields'] });
        },
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`/events/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};
