import { api } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useEventRoles = (eventId: string) => {
    return useQuery({
        queryKey: ['event-roles', eventId],
        queryFn: async () => {
            const { data } = await api.get(`/events/${eventId}/roles`);
            return data.roles;
        },
        enabled: !!eventId,
    });
};

export const useCreateEventRole = (eventId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await api.post(`/events/${eventId}/roles`, payload);
            return data.role;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event-roles', eventId] });
            toast.success('Role created successfully');
        },
    });
};

export const useUpdateEventRole = (eventId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ roleId, data }: { roleId: string; data: any }) => {
            const { data: responseData } = await api.put(`/events/${eventId}/roles/${roleId}`, data);
            return responseData.role;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event-roles', eventId] });
            toast.success('Role updated successfully');
        },
    });
};

export const useDeleteEventRole = (eventId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (roleId: string) => {
            await api.delete(`/events/${eventId}/roles/${roleId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event-roles', eventId] });
            toast.success('Role deleted successfully');
        },
    });
};

export const useEventStaff = (eventId: string) => {
    return useQuery({
        queryKey: ['event-staff', eventId],
        queryFn: async () => {
            const { data } = await api.get(`/events/${eventId}/staff`);
            return data.staff;
        },
        enabled: !!eventId,
    });
};

export const useAddStaffMember = (eventId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { emailOrUsername: string; roleIds: string[] }) => {
            const { data } = await api.post(`/events/${eventId}/staff`, payload);
            return data.staff;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event-staff', eventId] });
            toast.success('Staff member added successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add staff member');
        }
    });
};

export const useRemoveStaffMember = (eventId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            await api.delete(`/events/${eventId}/staff/${userId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event-staff', eventId] });
            toast.success('Staff member removed');
        },
    });
};
