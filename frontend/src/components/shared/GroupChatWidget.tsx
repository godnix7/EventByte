import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getSocket } from '@/lib/socket';
import { Send, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    userId: string;
    username: string;
    text: string;
    timestamp: Date;
}

export function GroupChatWidget({ eventId }: { eventId: string }) {
    const { user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !isOpen) return;

        socket.emit('chat:join', { eventId });

        socket.on('chat:message', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
            scrollToBottom();
        });

        socket.on('chat:typing', ({ username }: { username: string }) => {
            if (username === user?.username) return;
            setIsTyping(`${username} is typing...`);

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setIsTyping(null), 3000);
        });

        return () => {
            socket.emit('chat:leave', { eventId });
            socket.off('chat:message');
            socket.off('chat:typing');
        };
    }, [isOpen, eventId, user?.username]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const socket = getSocket();
        if (socket) {
            const newMsg = {
                id: Date.now().toString(),
                userId: user?.id || 'anon',
                username: user?.username || 'Anonymous',
                text: input.trim(),
                timestamp: new Date()
            };
            socket.emit('chat:message', { eventId, message: newMsg });
            // Optimistic update
            setMessages((prev) => [...prev, newMsg]);
            scrollToBottom();
        }
        setInput('');
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        const socket = getSocket();
        if (socket) {
            socket.emit('chat:typing', { eventId, username: user?.username });
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 right-0 w-80 sm:w-96 bg-card border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden"
                        style={{ height: '500px', maxHeight: '80vh' }}
                    >
                        <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center backdrop-blur-md">
                            <div className="flex items-center gap-2 font-semibold">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                <span>Event Chat</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                    <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="text-sm">No messages yet.</p>
                                    <p className="text-xs">Be the first to say hello!</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = msg.userId === user?.id;
                                    return (
                                        <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <span className="text-[10px] text-muted-foreground mb-1 ml-1">{msg.username}</span>
                                            <div
                                                className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${isMe
                                                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                        : 'bg-muted text-foreground rounded-bl-sm border border-border/50'
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            {isTyping && (
                                <div className="text-xs text-muted-foreground italic flex items-center gap-1">
                                    <div className="flex gap-1">
                                        <span className="animate-bounce inline-block w-1 h-1 bg-muted-foreground rounded-full" style={{ animationDelay: '0ms' }} />
                                        <span className="animate-bounce inline-block w-1 h-1 bg-muted-foreground rounded-full" style={{ animationDelay: '150ms' }} />
                                        <span className="animate-bounce inline-block w-1 h-1 bg-muted-foreground rounded-full" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span className="ml-1">{isTyping}</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} className="p-3 border-t border-border bg-muted/30 backdrop-blur-md flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={handleTyping}
                                placeholder="Type a message..."
                                className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-colors hover:bg-primary/90"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-primary/25 relative"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                {!isOpen && messages.length > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                )}
            </button>
        </div>
    );
}
