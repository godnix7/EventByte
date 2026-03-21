import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCreateEvent, useUpdateEventWizardStep, usePublishEvent, useEvent, useRegistrationFields, useUpdateRegistrationFields } from '@/hooks/useEvents';
import { AppLogo } from '@/components/shared/AppLogo';
import { WizardContainer } from '@/components/events/wizard/WizardContainer';
import { Step1BasicInfo } from '@/components/events/wizard/Step1BasicInfo';
import { Step2ScheduleVenue } from '@/components/events/wizard/Step2ScheduleVenue';
import { Step3Registration } from '@/components/events/wizard/Step3Registration';
import { Step4FormBuilder } from '@/components/events/wizard/Step4FormBuilder';
import { Step5Payments } from '@/components/events/wizard/Step5Payments';
import { Step6Certificates } from '@/components/events/wizard/Step6Certificates';
import { Step7Review } from '@/components/events/wizard/Step7Review';
import { useRef } from 'react';

export default function CreateEventPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const eventId = searchParams.get('id');
    const stepParam = parseInt(searchParams.get('step') || '1');
    const [currentStep, setCurrentStep] = useState(stepParam);

    const { data: event, isLoading: isEventLoading } = useEvent(eventId || '');
    const { data: regFields } = useRegistrationFields(eventId || '');

    const { mutateAsync: createEvent, isPending: isCreating } = useCreateEvent();
    const { mutateAsync: updateStep1, isPending: isUpdating1 } = useUpdateEventWizardStep(eventId || '', 'basic');
    const { mutateAsync: updateStep2, isPending: isUpdating2 } = useUpdateEventWizardStep(eventId || '', 'schedule');
    const { mutateAsync: updateStep3, isPending: isUpdating3 } = useUpdateEventWizardStep(eventId || '', 'registration');
    const { mutateAsync: updateStep5, isPending: isUpdating5 } = useUpdateEventWizardStep(eventId || '', 'payments');
    const { mutateAsync: updateStep6, isPending: isUpdating6 } = useUpdateEventWizardStep(eventId || '', 'certificates');
    const { mutateAsync: updateRegFields, isPending: isUpdatingReg } = useUpdateRegistrationFields(eventId || '');
    const { mutateAsync: publishEvent, isPending: isPublishing } = usePublishEvent(eventId || '');

    const isSaving = isCreating || isUpdating1 || isUpdating2 || isUpdating3 || isUpdating5 || isUpdating6 || isUpdatingReg || isPublishing;

    useEffect(() => {
        if (stepParam !== currentStep) {
            setCurrentStep(stepParam);
        }
    }, [stepParam]);

    const isDraftSaveRef = useRef(false);

    const handleNext = async (data?: any) => {
        const isDraft = isDraftSaveRef.current;
        isDraftSaveRef.current = false; // Reset for next time

        // Calculate the highest step reached.
        const nextStepNum = isDraft ? currentStep : Math.min(7, currentStep + 1);
        const dataWithStep = data && typeof data === 'object' && !Array.isArray(data)
            ? { ...data, lastStep: Math.max(event?.lastStep || 1, nextStepNum) }
            : data;

        try {
            if (currentStep === 1) {
                if (!eventId) {
                    const newEvent = await createEvent(dataWithStep);
                    toast.success('Event created and draft saved!');
                    setSearchParams({ id: newEvent.id, step: isDraft ? '1' : '2' });
                } else {
                    await updateStep1(dataWithStep);
                    if (isDraft) toast.success('Progress saved!');
                    setSearchParams({ id: eventId, step: isDraft ? '1' : '2' });
                }
            } else if (currentStep === 2) {
                await updateStep2(dataWithStep);
                if (isDraft) toast.success('Schedule saved!');
                setSearchParams({ id: eventId!, step: isDraft ? '2' : '3' });
            } else if (currentStep === 3) {
                await updateStep3(dataWithStep);
                if (isDraft) toast.success('Registration settings saved!');
                setSearchParams({ id: eventId!, step: isDraft ? '3' : '4' });
            } else if (currentStep === 4) {
                await updateRegFields(data); // Can't add lastStep to array payload easily without changing route
                // Optional: We can do a quick updateStep1({ lastStep: nextStepNum }) here if needed, but it's fine.
                if (isDraft) toast.success('Form fields saved!');
                setSearchParams({ id: eventId!, step: isDraft ? '4' : '5' });
            } else if (currentStep === 5) {
                await updateStep5(dataWithStep);
                if (isDraft) toast.success('Payments saved!');
                setSearchParams({ id: eventId!, step: isDraft ? '5' : '6' });
            } else if (currentStep === 6) {
                await updateStep6(dataWithStep);
                if (isDraft) toast.success('Certificates saved!');
                setSearchParams({ id: eventId!, step: isDraft ? '6' : '7' });
            } else if (currentStep === 7) {
                if (isDraft) {
                    toast.success('Draft finalized!');
                    return;
                }
                await publishEvent();
                toast.success('Event published successfully!');
                navigate(`/events/${event?.slug || eventId}`);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to save step');
        }
    };

    const handleSaveDraft = () => {
        isDraftSaveRef.current = true;
        const form = document.getElementById('wizard-step-form') as HTMLFormElement;
        if (form) {
            form.requestSubmit();
        } else {
            // No form (e.g. review step or empty step)
            handleNext();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setSearchParams({ id: eventId!, step: (currentStep - 1).toString() });
        }
    };

    const renderStep = () => {
        if (eventId && isEventLoading) return <div className="h-64 flex items-center justify-center">Loading event data...</div>;

        switch (currentStep) {
            case 1: return <Step1BasicInfo initialData={event} onSave={handleNext} isPending={isSaving} />;
            case 2: return <Step2ScheduleVenue initialData={event} onSave={handleNext} isPending={isSaving} />;
            case 3: return <Step3Registration initialData={event} onSave={handleNext} isPending={isSaving} />;
            case 4: return <Step4FormBuilder eventId={eventId!} initialData={regFields} onSave={handleNext} isPending={isSaving} />;
            case 5: return <Step5Payments initialData={event} onSave={handleNext} isPending={isSaving} />;
            case 6: return <Step6Certificates initialData={event} onSave={handleNext} isPending={isSaving} />;
            case 7: return <Step7Review 
                eventData={event} 
                onPublish={() => handleNext()} 
                onPreview={() => window.open(`/events/${event?.slug || event?.id}`, '_blank')}
                onEdit={() => setSearchParams({ id: eventId!, step: '1' })}
                isPending={isPublishing} 
            />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <AppLogo size="sm" />
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Event Creation Wizard v3</p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-2xl font-bold tracking-tight">Create Event</h1>
                        <p className="text-sm text-muted-foreground whitespace-nowrap">Step {currentStep} of 7</p>
                    </div>
                </header>

                <WizardContainer
                    currentStep={currentStep}
                    totalSteps={7}
                    canNext={!isSaving}
                    onNext={() => {
                        // For steps that are forms, they handle their own submission via the 'wizard-step-form' ID
                        const form = document.getElementById('wizard-step-form') as HTMLFormElement;
                        if (form) form.requestSubmit();
                        else handleNext(); // For step 7 or others without a traditional form
                    }}
                    onBack={handleBack}
                    onSaveDraft={handleSaveDraft}
                >
                    {renderStep()}
                </WizardContainer>
            </div>
        </div>
    );
}
