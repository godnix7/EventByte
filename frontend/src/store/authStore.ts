import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    organizerStatus?: string | null;
    profilePhotoUrl?: string | null;
    isBanned?: boolean;
    collegeName?: string | null;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            setAuth: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
            setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
            logout: () => set({ user: null, accessToken: null, refreshToken: null }),
        }),
        {
            name: 'eventbyte-auth',
        }
    )
);
