import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventWizardStepCertificatesSchema } from '@/schemas/event.schema';
import { Award, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step6Props {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    isPending?: boolean;
}

export const Step6Certificates: React.FC<Step6Props> = ({ initialData, onSave, isPending }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<any>({
        resolver: zodResolver(eventWizardStepCertificatesSchema),
        defaultValues: {
            certificatesEnabled: false,
            certificateType: 'participation',
            certificateNameFormat: '{name}',
            ...initialData,
        },
    });

    const certificatesEnabled = watch('certificatesEnabled');
    const onError = (errs: any) => console.error('Step 6 Errors:', errs);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">Certificates</h2>
                <p className="text-sm text-muted-foreground">Automate certificate generation for participants.</p>
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

            <form id="wizard-step-form" onSubmit={handleSubmit(onSave, onError)} className="space-y-6">
                <div className="p-6 border rounded-2xl bg-muted/20 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <Award size={20} />
                            </div>
                            <div>
                                <p className="font-bold">Enable Certificates</p>
                                <p className="text-xs text-muted-foreground">Participants can download certificates after the event.</p>
                            </div>
                        </div>
                        <input type="checkbox" disabled={isPending} {...register('certificatesEnabled')} className="w-6 h-6 accent-primary" />
                    </div>

                    {certificatesEnabled && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="pt-6 border-t space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Certificate Type</label>
                                <select
                                    {...register('certificateType')}
                                    disabled={isPending}
                                    className="w-full p-3 border rounded-xl bg-background outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                >
                                    <option value="participation">Participation Only</option>
                                    <option value="merit">Merit (Winner/Runner-up)</option>
                                    <option value="appreciation">Appreciation</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Template Image URL</label>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                        <input
                                            {...register('certificateTemplateUrl')}
                                            disabled={isPending}
                                            className="w-full pl-10 pr-4 py-3 border rounded-xl bg-background outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="https://example.com/certificate-bg.png"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Recommended size: 1920x1080px (PNG/JPG)</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name Format</label>
                                <input
                                    {...register('certificateNameFormat')}
                                    disabled={isPending}
                                    className="w-full p-3 border rounded-xl bg-background outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="e.g. {name}"
                                />
                                <p className="text-[10px] text-muted-foreground">Use {'{name}'} for participant's full name.</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </form>
        </div>
    );
};
