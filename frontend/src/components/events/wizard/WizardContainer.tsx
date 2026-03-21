import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Save } from 'lucide-react';

interface Step {
    id: number;
    title: string;
    description: string;
}

const STEPS: Step[] = [
    { id: 1, title: 'Basic Info', description: 'Title, slug, and type' },
    { id: 2, title: 'Schedule & Venue', description: 'When and where' },
    { id: 3, title: 'Registration', description: 'Access and capacity' },
    { id: 4, title: 'Form Builder', description: 'Custom fields' },
    { id: 5, title: 'Payments', description: 'Fees and refunds' },
    { id: 6, title: 'Certificates', description: 'Design templates' },
    { id: 7, title: 'Review', description: 'Final check' },
];

interface WizardContainerProps {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    onSaveDraft?: () => void;
    children: React.ReactNode;
    canNext?: boolean;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({
    currentStep,
    totalSteps,
    onNext,
    onBack,
    onSaveDraft,
    children,
    canNext = true,
}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Progress */}
            <div className="lg:w-64 flex-shrink-0">
                <div className="sticky top-24 space-y-4">
                    {STEPS.map((step) => (
                        <div key={step.id} className="flex items-start gap-4">
                            <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                ${currentStep > step.id ? 'bg-primary border-primary text-primary-foreground' :
                                    currentStep === step.id ? 'border-primary text-primary' : 'border-muted text-muted-foreground'}
              `}>
                                {currentStep > step.id ? <Check size={16} /> : step.id}
                            </div>
                            <div className="hidden lg:block">
                                <p className={`text-sm font-semibold ${currentStep === step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {step.title}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 space-y-8">
                <div className="bg-card border rounded-2xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    <div className="p-8 flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="p-6 bg-muted/30 border-t flex items-center justify-between">
                        <button
                            onClick={onBack}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-muted-foreground hover:bg-accent disabled:opacity-50 transition-colors"
                        >
                            <ChevronLeft size={20} />
                            Back
                        </button>

                        <div className="flex items-center gap-4">
                            {onSaveDraft && (
                                <button
                                    onClick={onSaveDraft}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-muted-foreground hover:bg-accent transition-colors"
                                >
                                    <Save size={20} />
                                    Save Draft
                                </button>
                            )}
                            <button
                                onClick={onNext}
                                disabled={!canNext}
                                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 min-w-[140px] justify-center"
                            >
                                {!canNext ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        {currentStep === totalSteps ? 'Complete & Publish' : 'Continue'}
                                        <ChevronRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
