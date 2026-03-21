import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventWizardStepPaymentsSchema } from '@/schemas/event.schema';
import { IndianRupee, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step5Props {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    isPending?: boolean;
}

export const Step5Payments: React.FC<Step5Props> = ({ initialData, onSave, isPending }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<any>({
        resolver: zodResolver(eventWizardStepPaymentsSchema),
        defaultValues: {
            isPaid: false,
            feeAmount: 0,
            currency: 'INR',
            paymentProvider: 'razorpay',
            ...initialData,
        },
    });

    const isPaidValue = watch('isPaid');
    const isPaid = isPaidValue === true || isPaidValue === 'true';

    const handleActualSave = async (data: any) => {
        // Coerce isPaid string back to boolean if it came from the radio input
        const coercedData = {
            ...data,
            isPaid: data.isPaid === 'true' || data.isPaid === true
        };
        await onSave(coercedData);
    };

    const onError = (errs: any) => console.error('Step 5 Errors:', errs);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">Payments & Fees</h2>
                <p className="text-sm text-muted-foreground">Configure how you'll collect ticket fees.</p>
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

            <form id="wizard-step-form" onSubmit={handleSubmit(handleActualSave, onError)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Free Entry Card */}
                    <label className={`
                        relative p-6 border-2 rounded-2xl cursor-pointer transition-all flex flex-col gap-3
                        ${!isPaid ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-muted hover:border-muted-foreground/30'}
                    `}>
                        <input
                            type="radio"
                            className="sr-only"
                            {...register('isPaid')}
                            value="false"
                        />
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${!isPaid ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Free Entry</p>
                            <p className="text-sm text-muted-foreground text-balance">No tickets or fees. Perfect for open workshops and community meetups.</p>
                        </div>
                        {!isPaid && <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div></div>}
                    </label>

                    {/* Paid Entry Card */}
                    <label className={`
                        relative p-6 border-2 rounded-2xl cursor-pointer transition-all flex flex-col gap-3
                        ${isPaid ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-muted hover:border-muted-foreground/30'}
                    `}>
                        <input
                            type="radio"
                            className="sr-only"
                            {...register('isPaid')}
                            value="true"
                        />
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPaid ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            <IndianRupee size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Paid Entry</p>
                            <p className="text-sm text-muted-foreground text-balance">Charge for attendance. Requires a linked payment provider.</p>
                        </div>
                        {isPaid && <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div></div>}
                    </label>
                </div>

                <AnimatePresence>
                    {isPaid && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-8 border rounded-2xl bg-muted/20 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fee Amount</label>
                                        <div className="relative group">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                                            <input
                                                type="number"
                                                disabled={isPending}
                                                {...register('feeAmount', { valueAsNumber: true })}
                                                className="w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-background outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-xl"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.feeAmount && <p className="text-xs text-destructive font-medium">{errors.feeAmount.message?.toString()}</p>}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Currency</label>
                                        <select
                                            {...register('currency')}
                                            disabled={isPending}
                                            className="w-full p-4 border-2 rounded-xl bg-background outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                                        >
                                            <option value="INR">Indian Rupee (INR)</option>
                                            <option value="USD">US Dollar (USD)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Select Payment Provider</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <label className="relative p-5 border-2 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:shadow-sm">
                                            <input type="radio" disabled={isPending} {...register('paymentProvider')} value="razorpay" className="sr-only" />
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-xs shadow-inner">RP</div>
                                            <div>
                                                <p className="font-bold text-sm">Razorpay</p>
                                                <p className="text-[10px] text-muted-foreground">UPI, Cards, Netbanking</p>
                                            </div>
                                            <div className="ml-auto w-4 h-4 border-2 rounded-full flex items-center justify-center has-[:checked]:bg-primary has-[:checked]:border-primary transition-colors">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100" />
                                            </div>
                                        </label>
                                        <label className="relative p-5 border-2 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:shadow-sm">
                                            <input type="radio" disabled={isPending} {...register('paymentProvider')} value="stripe" className="sr-only" />
                                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-xs shadow-inner">ST</div>
                                            <div>
                                                <p className="font-bold text-sm">Stripe</p>
                                                <p className="text-[10px] text-muted-foreground">International Cards, Wallet</p>
                                            </div>
                                            <div className="ml-auto w-4 h-4 border-2 rounded-full flex items-center justify-center has-[:checked]:bg-primary has-[:checked]:border-primary transition-colors">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0" />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3">
                    <ShieldCheck className="text-primary shrink-0" size={20} />
                    <p className="text-xs text-muted-foreground">
                        Your payments are processed securely. Fee payouts happen 3 days after the event ends.
                    </p>
                </div>
            </form>
        </div>
    );
};
