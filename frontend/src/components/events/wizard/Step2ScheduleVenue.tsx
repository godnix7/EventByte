import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventWizardStepScheduleSchema, UpdateEventInput } from '@/schemas/event.schema';
import { motion, AnimatePresence } from 'framer-motion';

interface Step2Props {
    initialData?: Partial<UpdateEventInput>;
    onSave: (data: any) => Promise<void>;
    isPending?: boolean;
}

export const Step2ScheduleVenue: React.FC<Step2Props> = ({ initialData, onSave, isPending }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<any>({
        resolver: zodResolver(eventWizardStepScheduleSchema),
        defaultValues: {
            timezone: 'UTC',
            venueType: 'offline',
            ...initialData,
        },
    });

    const venueType = watch('venueType');

    const onError = (errs: any) => console.error('Step 2 Errors:', errs);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">Schedule & Venue</h2>
                <p className="text-sm text-muted-foreground">When and where is the magic happening?</p>
            </div>

            <AnimatePresence>
                {Object.keys(errors).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive"
                    >
                        <strong>Please fix the following:</strong>
                        <ul className="list-disc list-inside mt-1">
                            {Object.entries(errors).map(([field, error]) => (
                                <li key={field}>{field}: {error?.message as string}</li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            <form id="wizard-step-form" onSubmit={handleSubmit(onSave, onError)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date & Time</label>
                    <input
                        type="datetime-local"
                        disabled={isPending}
                        {...register('startDate')}
                        className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">End Date & Time</label>
                    <input
                        type="datetime-local"
                        disabled={isPending}
                        {...register('endDate')}
                        className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Timezone</label>
                    <select
                        {...register('timezone')}
                        disabled={isPending}
                        className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                        <option value="UTC">UTC</option>
                        <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
                        <option value="America/New_York">EST (America/New_York)</option>
                        <option value="Europe/London">GMT (Europe/London)</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Venue Type</label>
                    <select
                        {...register('venueType')}
                        disabled={isPending}
                        className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                        <option value="offline">In-Person (Offline)</option>
                        <option value="online">Virtual (Online)</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>

                {(venueType === 'offline' || venueType === 'hybrid') && (
                    <>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Venue Address / Location</label>
                            <input
                                {...register('venueLocation')}
                                disabled={isPending}
                                className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="e.g. Main Auditorium, College Campus"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Room / Hall Number</label>
                            <input
                                {...register('venueRoom')}
                                disabled={isPending}
                                className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="e.g. Room 402"
                            />
                        </div>
                    </>
                )}

                {(venueType === 'online' || venueType === 'hybrid') && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Platform</label>
                            <input
                                {...register('onlinePlatform')}
                                disabled={isPending}
                                className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="e.g. Zoom, Google Meet"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Meeting Link</label>
                            <input
                                {...register('meetingLink')}
                                disabled={isPending}
                                className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="https://zoom.us/j/..."
                            />
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};
