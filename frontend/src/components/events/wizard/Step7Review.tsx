import React from 'react';
import { CheckCircle2, AlertCircle, Rocket, Eye, Edit3 } from 'lucide-react';

interface Step7Props {
    eventData: any;
    onPublish: () => Promise<void>;
    onPreview?: () => void;
    onEdit?: () => void;
    isPending?: boolean;
}

export const Step7Review: React.FC<Step7Props> = ({ eventData = {}, onPublish, onPreview, onEdit, isPending }) => {
    const isComplete = !!(eventData?.description && eventData?.startDate && eventData?.endDate && eventData?.registrationStart && eventData?.registrationEnd);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold">Review & Publish</h2>
                <p className="text-sm text-muted-foreground">Review your event details before making it live.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="p-6 border rounded-2xl space-y-4">
                        <h3 className="font-bold flex items-center gap-2 truncate">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            {eventData.title}
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Type:</span>
                                <span className="capitalize">{eventData.eventType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Visibility:</span>
                                <span className="capitalize">{eventData.visibility || 'Public'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Fees:</span>
                                <span>{eventData.isPaid ? `₹${eventData.feeAmount}` : 'Free'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border rounded-2xl bg-muted/20 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Checklist</h4>
                        <div className="space-y-2">
                            <CheckItem label="Basic Information" done={!!eventData.title && !!eventData.slug} />
                            <CheckItem label="Schedule & Dates" done={!!eventData.startDate && !!eventData.endDate} />
                            <CheckItem label="Registration Rules" done={!!eventData.registrationStart && !!eventData.registrationEnd} />
                            <CheckItem label="Custom Form" done={true} />
                            <CheckItem label="Payments Content" done={!eventData.isPaid || !!eventData.feeAmount} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl text-center space-y-4">
                        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/30">
                            <Rocket size={32} />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Ready to go live?</p>
                            <p className="text-xs text-muted-foreground">Once published, your event will be visible in the discovery feed and registrations will open on the specified date.</p>
                        </div>
                        <button
                            onClick={onPublish}
                            disabled={isPending || !isComplete}
                            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-primary/20"
                        >
                            {isPending ? 'Publishing...' : 'Publish Event Now'}
                            <Rocket size={18} />
                        </button>
                        {!isComplete && (
                            <p className="text-[10px] text-destructive flex items-center justify-center gap-1 font-medium">
                                <AlertCircle size={12} /> Some required fields are missing. Go back and check dates/description.
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={onPreview} className="flex-1 p-3 border rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors">
                            <Eye size={18} /> Preview
                        </button>
                        <button onClick={onEdit} className="flex-1 p-3 border rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors">
                            <Edit3 size={18} /> Quick Edit
                        </button>
                    </div>
                </div>
            </div>

            <form id="wizard-step-form" onSubmit={(e) => { e.preventDefault(); (isComplete && !isPending) && onPublish(); }} />
        </div>
    );
};

const CheckItem = ({ label, done }: { label: string, done: boolean }) => (
    <div className="flex items-center justify-between">
        <span className={`text-sm ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
        {done ? <CheckCircle2 size={16} className="text-primary" /> : <AlertCircle size={16} className="text-muted-foreground/50" />}
    </div>
);
