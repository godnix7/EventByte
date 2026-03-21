import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventWizardStep1Schema, CreateEventInput } from '@/schemas/event.schema';

interface Step1Props {
    initialData?: Partial<CreateEventInput>;
    onSave: (data: CreateEventInput) => Promise<void>;
    isPending?: boolean;
}

export const Step1BasicInfo: React.FC<Step1Props> = ({ initialData, onSave, isPending }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<CreateEventInput>({
        resolver: zodResolver(eventWizardStep1Schema),
        defaultValues: {
            eventType: 'hackathon',
            ...initialData,
        },
    });

    const onSubmit = (data: CreateEventInput) => {
        console.log('Step 1 Validated Data:', data);
        onSave(data);
    };

    const onError = (errors: any) => {
        console.error('Step 1 Validation Errors:', errors);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">Details</h2>
                <p className="text-sm text-muted-foreground">Start with the basics of your event.</p>
            </div>

            <AnimatePresence>
                {Object.keys(errors).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive"
                    >
                        <strong>Please fix the following errors:</strong>
                        <ul className="list-disc list-inside mt-1">
                            {Object.entries(errors).map(([field, error]) => (
                                <li key={field}>{field}: {error?.message as string}</li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            <form id="wizard-step-form" onSubmit={handleSubmit(onSubmit, onError)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Event Title</label>
                    <input
                        {...register('title')}
                        disabled={isPending}
                        className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Give your event a catchy name"
                    />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">URL Slug</label>
                    <div className="flex items-center">
                        <span className="bg-muted px-3 py-3 border border-r-0 rounded-l-xl text-xs text-muted-foreground">eventbyte.com/e/</span>
                        <input
                            {...register('slug')}
                            disabled={isPending}
                            className="flex-1 p-3 border rounded-r-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="my-awesome-event"
                        />
                    </div>
                    {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Event Type</label>
                    <select
                        {...register('eventType')}
                        disabled={isPending}
                        className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                        <option value="hackathon">Hackathon</option>
                        <option value="seminar">Seminar</option>
                        <option value="workshop">Workshop</option>
                        <option value="conference">Conference</option>
                        <option value="meetup">Meetup</option>
                    </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Short Catchphrase (Max 200 chars)</label>
                    <input
                        {...register('shortDescription')}
                        disabled={isPending}
                        className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="A one-liner to grab attention..."
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Long Description</label>
                    <textarea
                        {...register('description')}
                        rows={5}
                        disabled={isPending}
                        className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Tell participants what to expect, the agenda, rules, etc."
                    />
                    {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Banner Image URL</label>
                    <input
                        {...register('bannerImageUrl')}
                        disabled={isPending}
                        className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="https://example.com/banner.jpg"
                    />
                </div>
            </form>
        </div>
    );
};
