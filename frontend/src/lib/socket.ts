import { io, Socket } from 'socket.io-client';
import { appConfig } from '../config/app.config';
import { useAuthStore } from '../store/authStore';

let socket: Socket | null = null;

export const initSocket = (): Socket => {
    if (socket) return socket;

    const token = useAuthStore.getState().accessToken;

    socket = io(appConfig.socketUrl, {
        auth: { token },
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
