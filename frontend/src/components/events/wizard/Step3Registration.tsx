import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventWizardStepRegistrationSchema } from '@/schemas/event.schema';
import { motion, AnimatePresence } from 'framer-motion';

interface Step3Props {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    isPending?: boolean;
}

export const Step3Registration: React.FC<Step3Props> = ({ initialData, onSave, isPending }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<any>({
        resolver: zodResolver(eventWizardStepRegistrationSchema),
        defaultValues: {
            waitlistEnabled: false,
            allowTeams: false,
            teamMinSize: 1,
            teamMaxSize: 4,
            visibility: 'public',
            ...initialData,
        },
    });

    const allowTeams = watch('allowTeams');
    const onError = (errs: any) => console.error('Step 3 Errors:', errs);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">Registration & Visibility</h2>
                <p className="text-sm text-muted-foreground">Configure who can join and how.</p>
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
                    <label className="text-sm font-medium">Registration Starts</label>
                    <input
                        type="datetime-local"
                        disabled={isPending}
                        {...register('registrationStart')}
                        className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Registration Ends</label>
                    <input
                        type="datetime-local"
                        disabled={isPending}
                        {...register('registrationEnd')}
                        className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Max Participants (Capacity)</label>
                    <input
                        type="number"
                        disabled={isPending}
                        {...register('maxParticipants', { valueAsNumber: true })}
                        className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="0 for unlimited"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Visibility</label>
                    <select
                        {...register('visibility')}
                        disabled={isPending}
                        className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                        <option value="public">Public (Anyone can see)</option>
                        <option value="college_only">College Only (Internal)</option>
                        <option value="invite_only">Invite Only</option>
                        <option value="private_link">Private Link Only</option>
                    </select>
                </div>

                <div className="p-4 bg-muted/20 border rounded-xl space-y-4 md:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Team Participation</p>
                            <p className="text-xs text-muted-foreground">Allow participants to form teams.</p>
                        </div>
                        <input type="checkbox" disabled={isPending} {...register('allowTeams')} className="w-5 h-5 accent-primary" />
                    </div>

                    {allowTeams && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-1">
                                <label className="text-xs font-medium">Min Team Size</label>
                                <input type="number" disabled={isPending} {...register('teamMinSize', { valueAsNumber: true })} className="w-full p-2 border rounded-lg bg-background" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium">Max Team Size</label>
                                <input type="number" disabled={isPending} {...register('teamMaxSize', { valueAsNumber: true })} className="w-full p-2 border rounded-lg bg-background" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/20 border rounded-xl md:col-span-2">
                    <div>
                        <p className="font-medium">Enable Waitlist</p>
                        <p className="text-xs text-muted-foreground">Automatically put new registrants on waitlist when capacity is full.</p>
                    </div>
                    <input type="checkbox" disabled={isPending} {...register('waitlistEnabled')} className="w-5 h-5 accent-primary" />
                </div>
            </form>
        </div>
    );
};
