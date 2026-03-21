import { z } from 'zod';

export const eventWizardStep1Schema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    shortDescription: z.string().max(200).nullish().or(z.literal('')),
    description: z.string().min(10, "Description must be at least 10 chars").nullish().or(z.literal('')),
    eventType: z.enum(['hackathon', 'seminar', 'workshop', 'conference', 'meetup']),
    tags: z.array(z.string()).nullish(),
    bannerImageUrl: z.string().url().nullish().or(z.literal('')),
    clubId: z.string().nullish().or(z.literal('')),
    lastStep: z.number().int().min(1).max(7).optional(),
});

export const eventWizardStepScheduleSchema = z.object({
    startDate: z.string().nullish().or(z.literal('')),
    endDate: z.string().nullish().or(z.literal('')),
    timezone: z.string().default('UTC'),
    venueType: z.enum(['offline', 'online', 'hybrid']).default('offline'),
    venueLocation: z.string().nullish().or(z.literal('')),
    venueRoom: z.string().nullish().or(z.literal('')),
    onlinePlatform: z.string().nullish().or(z.literal('')),
    meetingLink: z.string().url().nullish().or(z.literal('')),
    lastStep: z.number().int().min(1).max(7).optional(),
});

export const eventWizardStepRegistrationSchema = z.object({
    registrationStart: z.string().nullish().or(z.literal('')),
    registrationEnd: z.string().nullish().or(z.literal('')),
    maxParticipants: z.number().int().min(0).nullish(),
    minParticipants: z.number().int().min(0).nullish(),
    waitlistEnabled: z.boolean().default(false),
    allowTeams: z.boolean().default(false),
    teamMinSize: z.number().int().min(1).default(1),
    teamMaxSize: z.number().int().max(10).default(4),
    visibility: z.enum(['public', 'college_only', 'invite_only', 'private_link']).default('public'),
    lastStep: z.number().int().min(1).max(7).optional(),
});

export const eventWizardStepPaymentsSchema = z.object({
    isPaid: z.boolean().default(false),
    feeAmount: z.number().min(0).nullish(),
    currency: z.string().default('INR'),
    paymentProvider: z.enum(['upi', 'razorpay', 'stripe', 'manual']).nullish(),
    refundPolicy: z.string().nullish().or(z.literal('')),
    paymentDeadlineAt: z.string().nullish().or(z.literal('')),
    lastStep: z.number().int().min(1).max(7).optional(),
});

export const eventWizardStepCertificatesSchema = z.object({
    certificatesEnabled: z.boolean().default(false),
    certificateType: z.enum(['participation', 'volunteer', 'winner', 'runner_up', 'speaker', 'organizer', 'both']).nullish(),
    certificateTemplateUrl: z.string().url().nullish().or(z.literal('')),
    certificateNameFormat: z.string().nullish().or(z.literal('')),
    lastStep: z.number().int().min(1).max(7).optional(),
});

export const eventWizardStepAttendanceSchema = z.object({
    attendanceMethod: z.enum(['qr', 'manual']).default('qr'),
    entryWindowStartsAt: z.string().nullish(),
    entryWindowEndsAt: z.string().nullish(),
    lateEntryRule: z.string().nullish(),
    lastStep: z.number().int().min(1).max(7).optional(),
});

export const eventWizardStepAdvancedSchema = z.object({
    allowCancellation: z.boolean().default(true),
    allowSubstitution: z.boolean().default(false),
    allowLateRegistration: z.boolean().default(false),
    feedbackEnabled: z.boolean().default(true),
});

export const createEventSchema = eventWizardStep1Schema;

export const updateEventSchema = z.object({
    ...eventWizardStep1Schema.partial().shape,
    ...eventWizardStepScheduleSchema.partial().shape,
    ...eventWizardStepRegistrationSchema.partial().shape,
    ...eventWizardStepPaymentsSchema.partial().shape,
    ...eventWizardStepCertificatesSchema.partial().shape,
    ...eventWizardStepAttendanceSchema.partial().shape,
    ...eventWizardStepAdvancedSchema.partial().shape,
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
