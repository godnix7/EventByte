import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Trophy, Search, ExternalLink } from 'lucide-react';
import { getSocket } from '@/lib/socket';

interface TeamScore {
    teamId: string;
    teamName: string;
    totalScore: number;
    projectUrl?: string;
}

export default function JudgingLeaderboardPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const [leaderboard, setLeaderboard] = useState<TeamScore[]>([]);
    const [search, setSearch] = useState('');

    // Fetch initial leaderboard
    useQuery({
        queryKey: ['leaderboard', eventId],
        queryFn: async () => {
            // In real app, this would be an endpoint aggregating all scores
            const response = await api.get(`/api/events/${eventId}/leaderboard`).catch(() => ({ data: [] }));
            setLeaderboard(response.data || []);
            return response.data;
        }
    });

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        socket.emit('join:event', eventId);

        // Listen for real-time score updates
        socket.on('score:updated', (data) => {
            // Re-fetch or manually update leaderboard array based on complex ranking logic
            // For this scaffold, we're just triggering a logical log 
            console.log("Real-time score update received:", data);
        });

        return () => {
            socket.emit('leave:event', eventId);
            socket.off('score:updated');
        };
    }, [eventId]);

    // Dummy data for visual scaffolding
    const displayBoard = leaderboard.length ? leaderboard : [
        { teamId: '1', teamName: 'HackYeah Innovators', totalScore: 98.5, projectUrl: 'https://github.com/...' },
        { teamId: '2', teamName: 'Code Ninjas', totalScore: 95.0, projectUrl: 'https://github.com/...' },
        { teamId: '3', teamName: 'Byte Benders', totalScore: 88.5 },
        { teamId: '4', teamName: 'Neural Netters', totalScore: 82.0 },
    ];

    const filteredBoard = displayBoard.filter(t => t.teamName.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Live Leaderboard</h1>
                    <p className="text-muted-foreground mt-2 flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Updating in real-time
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search teams..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
            </div>

            <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground border-b">
                        <tr>
                            <th className="px-6 py-4 font-medium">Rank</th>
                            <th className="px-6 py-4 font-medium">Team Name</th>
                            <th className="px-6 py-4 font-medium text-right">Total Score</th>
                            <th className="px-6 py-4 font-medium text-right">Links</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredBoard.map((team, index) => (
                            <tr key={team.teamId} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 font-bold text-lg">
                                        {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                                        {index === 1 && <Trophy className="h-5 w-5 text-slate-400" />}
                                        {index === 2 && <Trophy className="h-5 w-5 text-amber-700" />}
                                        <span className={index < 3 ? 'text-foreground' : 'text-muted-foreground ml-7'}>
                                            #{index + 1}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-base">
                                    {team.teamName}
                                </td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-lg text-primary">
                                    {team.totalScore.toFixed(1)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {team.projectUrl ? (
                                        <a href={team.projectUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                                            Project <ExternalLink className="h-3 w-3" />
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">Pending</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBoard.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        No teams found matching "{search}"
                    </div>
                )}
            </div>
        </div>
    );
}
