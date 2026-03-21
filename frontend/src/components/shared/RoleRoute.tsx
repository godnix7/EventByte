import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface RoleRouteProps {
    allowedRoles: string[];
    requireApprovedOrganizer?: boolean;
}

export const RoleRoute = ({ allowedRoles, requireApprovedOrganizer = false }: RoleRouteProps) => {
    const { user, accessToken } = useAuthStore();
    const location = useLocation();

    if (!accessToken || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user.role) && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    if (requireApprovedOrganizer && user.role === 'organizer' && user.organizerStatus !== 'approved') {
        return <Navigate to="/org/pending-approval" replace />;
    }

    return <Outlet />;
};
