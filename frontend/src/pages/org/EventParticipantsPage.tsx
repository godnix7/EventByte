import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEventParticipants, useCheckInParticipant, Participant } from '@/hooks/useParticipants';
import { useEvent } from '@/hooks/useEvents';
import { Search, Download, CheckCircle, Clock, ShieldAlert, ArrowLeft, MoreVertical, FileText, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventParticipantsPage() {
    const { id: eventId } = useParams<{ id: string }>();
    const { data: event, isLoading: eventLoading } = useEvent(eventId!);
    const { data: participants, isLoading: participantsLoading } = useEventParticipants(eventId!);
    const checkInMutation = useCheckInParticipant(eventId!);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

    const filteredParticipants = useMemo(() => {
        if (!participants) return [];
        return participants.filter(p => {
            const matchesSearch =
                p.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.registrationNumber && p.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [participants, searchTerm, statusFilter]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'waitlisted': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    if (eventLoading || participantsLoading) return <div className="p-12 text-center text-muted-foreground font-medium animate-pulse">Loading CRM data...</div>;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col h-[calc(100vh-80px)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
                <div>
                    <Link to={`/org/events/${event?.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-2">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight mb-1">Participants CRM</h1>
                    <p className="text-muted-foreground">Manage registrations, payments, and attendance for <span className="font-semibold text-foreground">{event?.title}</span></p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-muted hover:bg-muted/80 transition-colors border border-border/50 text-foreground"
                        onClick={() => window.open(`http://localhost:8000/api/admin/events/${eventId}/export/csv`, '_blank')}
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Left Column: List */}
                <div className="lg:col-span-2 flex flex-col bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden min-h-0">
                    <div className="p-4 border-b border-border/50 bg-muted/10 shrink-0 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or registration ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-background border-2 border-border/50 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                            {['all', 'approved', 'pending', 'waitlisted', 'rejected'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${statusFilter === status ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground hover:bg-muted border-border/50'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {filteredParticipants.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                                <Search className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-bold text-lg text-foreground">No participants found</p>
                                <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredParticipants.map(participant => (
                                    <div
                                        key={participant.id}
                                        onClick={() => setSelectedParticipant(participant)}
                                        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${selectedParticipant?.id === participant.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-background hover:bg-muted/30 border-transparent hover:border-border'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0 border border-primary/20">
                                                {participant.user.profilePhotoUrl ? (
                                                    <img src={participant.user.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    participant.user.firstName.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-foreground text-[15px]">{participant.user.firstName} {participant.user.lastName}</div>
                                                <div className="text-xs font-medium text-muted-foreground">{participant.user.email}</div>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(participant.status)}`}>
                                                        {participant.status}
                                                    </span>
                                                    {participant.checkedIn && (
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                                                            <CheckCircle className="w-3 h-3" /> Checked In
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">{participant.registrationNumber || 'Pending ID'}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                                                <Clock className="w-3 h-3" />
                                                {new Date(participant.registrationDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Details Pane */}
                <div className="hidden lg:flex flex-col bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden min-h-0">
                    <AnimatePresence mode="wait">
                        {selectedParticipant ? (
                            <motion.div
                                key={selectedParticipant.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 overflow-y-auto custom-scrollbar flex flex-col"
                            >
                                <div className="p-6 border-b border-border/50 bg-gradient-to-b from-muted/30 to-transparent">
                                    <div className="flex items-start justify-between">
                                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl overflow-hidden shadow-inner border border-primary/20 mb-4">
                                            {selectedParticipant.user.profilePhotoUrl ? (
                                                <img src={selectedParticipant.user.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                selectedParticipant.user.firstName.charAt(0)
                                            )}
                                        </div>
                                        <button className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                    <h2 className="text-2xl font-black">{selectedParticipant.user.firstName} {selectedParticipant.user.lastName}</h2>
                                    <p className="text-primary font-medium">{selectedParticipant.user.email}</p>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${getStatusStyle(selectedParticipant.status)}`}>
                                            {selectedParticipant.status}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border border-border bg-background text-foreground">
                                            {selectedParticipant.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 space-y-8 flex-1">
                                    {/* Registration Details */}
                                    <section>
                                        <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> Registration Info
                                        </h3>
                                        <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground font-medium">Registration ID</span>
                                                <span className="text-sm font-bold text-foreground font-mono">{selectedParticipant.registrationNumber || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground font-medium">Date Applied</span>
                                                <span className="text-sm font-bold text-foreground">{new Date(selectedParticipant.registrationDate).toLocaleString()}</span>
                                            </div>
                                            {selectedParticipant.user.collegeName && (
                                                <div className="flex justify-between border-t border-border/50 pt-3">
                                                    <span className="text-sm text-muted-foreground font-medium">College/Organization</span>
                                                    <span className="text-sm font-bold text-foreground">{selectedParticipant.user.collegeName}</span>
                                                </div>
                                            )}
                                            {selectedParticipant.user.phone && (
                                                <div className="flex justify-between border-t border-border/50 pt-3">
                                                    <span className="text-sm text-muted-foreground font-medium">Phone Number</span>
                                                    <span className="text-sm font-bold text-foreground">{selectedParticipant.user.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    {/* Form Responses (if any) */}
                                    {selectedParticipant.formResponses && Object.keys(selectedParticipant.formResponses).length > 0 && (
                                        <section>
                                            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <FileText className="w-4 h-4" /> Form Responses
                                            </h3>
                                            <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 space-y-4">
                                                {Object.entries(selectedParticipant.formResponses).map(([key, value]) => (
                                                    <div key={key}>
                                                        <div className="text-xs font-bold text-muted-foreground mb-1">{key}</div>
                                                        <div className="text-sm font-medium text-foreground bg-background p-2.5 rounded-lg border border-border/50">
                                                            {Array.isArray(value) ? value.join(', ') : String(value)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {/* Attendance */}
                                    <section>
                                        <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4" /> Attendance Status
                                        </h3>
                                        <div className={`p-4 rounded-2xl border flex items-center justify-between ${selectedParticipant.checkedIn ? 'bg-green-50 border-green-200' : 'bg-muted/30 border-border/50'}`}>
                                            <div>
                                                <div className={`text-sm font-bold ${selectedParticipant.checkedIn ? 'text-green-800' : 'text-foreground'}`}>
                                                    {selectedParticipant.checkedIn ? 'Checked In' : 'Not Checked In Yet'}
                                                </div>
                                                {selectedParticipant.checkedInAt ? (
                                                    <div className="text-xs text-green-600/70 font-medium mt-1">
                                                        {new Date(selectedParticipant.checkedInAt).toLocaleString()}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        Scan participant's QR code or check in manually.
                                                    </div>
                                                )}
                                            </div>
                                            {selectedParticipant.checkedIn ? (
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                    <CheckCircle className="w-5 h-5" />
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        if (!selectedParticipant.registrationNumber) return alert('No Registration ID available');
                                                        checkInMutation.mutate(selectedParticipant.registrationNumber);
                                                        // Optimistic local update
                                                        setSelectedParticipant({ ...selectedParticipant, checkedIn: true, checkedInAt: new Date().toISOString() });
                                                    }}
                                                    disabled={checkInMutation.isPending}
                                                    className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 text-sm disabled:opacity-50"
                                                >
                                                    <QrCode className="w-4 h-4" />
                                                    {checkInMutation.isPending ? 'Verifying...' : 'Manual Check-in'}
                                                </button>
                                            )}
                                        </div>
                                    </section>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6 border border-border/50">
                                    <Users className="w-10 h-10 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-xl font-black text-foreground mb-2">Participant Details</h3>
                                <p className="text-muted-foreground max-w-xs text-sm">Select a participant from the list to view their complete profile, responses, and check-in status.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// Just adding this icon local import for the empty state
import { Users } from 'lucide-react';
