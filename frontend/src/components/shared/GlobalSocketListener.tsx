import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getSocket } from '@/lib/socket';
import { toast } from 'react-hot-toast';
import { Bell, Megaphone } from 'lucide-react';
import { appConfig } from '@/config/app.config';

export function GlobalSocketListener() {
    const { accessToken } = useAuthStore();

    useEffect(() => {
        if (!accessToken) return;

        const socket = getSocket();
        if (!socket) return;

        socket.on('announcement:new', (data: any) => {
            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-in slide-in-from-bottom-5' : 'animate-out slide-out-to-bottom-5'
                        } max-w-md w-full bg-card shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-primary/20 rounded-xl pointer-events-auto flex ring-1 ring-black/5`}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <div className="h-10 w-10 rounded-full flex items-center justify-center p-2 text-white" style={{ backgroundColor: appConfig.primaryColor }}>
                                    <Megaphone className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-bold text-foreground">
                                    {data.title || 'New Announcement!'}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                    {data.content}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-border">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-sm font-medium text-primary hover:text-primary/80 focus:outline-none"
                        >
                            Close
                        </button>
                    </div>
                </div>
            ), { duration: 6000 });
        });

        socket.on('notification:new', (data: any) => {
            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-in fade-in zoom-in-95' : 'animate-out fade-out zoom-out-95'
                        } max-w-sm w-full bg-accent text-accent-foreground shadow-xl rounded-lg pointer-events-auto flex ring-1 ring-black/5 p-4`}
                >
                    <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold">{data.title || 'Notification'}</p>
                            <p className="text-sm opacity-90">{data.message}</p>
                        </div>
                    </div>
                </div>
            ), { duration: 4000 });
        });

        return () => {
            socket.off('announcement:new');
            socket.off('notification:new');
        };
    }, [accessToken]);

    // This component renders nothing, just handles side-effects
    return null;
}
