import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { QrCode, Ticket, CheckCircle2, Clock } from 'lucide-react';
// Assuming we'll use a library like qrcode.react in the future
// import { QRCodeSVG } from 'qrcode.react';

export default function ParticipantTicketPage() {
    const { user } = useAuthStore();
    const [status] = useState<'registered' | 'checked_in'>('registered');

    // In a real app we would fetch the specific registration details from API
    const ticketData = {
        eventName: "Spring Hackathon 2026",
        registrationNumber: "REG-847291",
        date: "March 15-17, 2026",
        location: "Tech Hub, City Center",
        qrValue: `TICKET:REG-847291:USER:${user?.id}`
    };

    return (
        <div className="container mx-auto max-w-3xl py-12 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">My Ticket</h1>
                <p className="text-muted-foreground mt-2">Present this QR code at the check-in desk.</p>
            </div>

            <div className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">

                {/* Left side: QR Code */}
                <div className="bg-muted p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-dashed">
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                        {/* Placeholder for actual QR code component */}
                        <div className="w-48 h-48 bg-slate-200 flex items-center justify-center rounded-lg">
                            <QrCode className="h-12 w-12 text-slate-400" />
                        </div>
                    </div>
                    <p className="text-sm font-mono text-muted-foreground">{ticketData.registrationNumber}</p>

                    {status === 'checked_in' ? (
                        <div className="mt-6 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full text-sm font-medium">
                            <CheckCircle2 className="h-4 w-4" />
                            Checked In
                        </div>
                    ) : (
                        <div className="mt-6 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full text-sm font-medium">
                            <Clock className="h-4 w-4" />
                            Awaiting Check-in
                        </div>
                    )}
                </div>

                {/* Right side: Event Details */}
                <div className="p-8 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-primary font-medium mb-2">
                        <Ticket className="h-5 w-5" />
                        <span>Admit One</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">{ticketData.eventName}</h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Attendee</p>
                            <p className="font-medium text-lg">{user?.firstName} {user?.lastName}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-sm text-muted-foreground">Date</p>
                                <p className="font-medium">{ticketData.date}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="font-medium">{ticketData.location}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
