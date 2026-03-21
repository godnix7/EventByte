import { z } from 'zod';

export const teamBuilderSchema = z.object({
    name: z.string().min(3).max(50),
});

export const judgingScoreSchema = z.object({
    rubricId: z.string().uuid(),
    scoreData: z.record(z.number()),
    totalScore: z.number().nonnegative(),
    comments: z.string().max(1000).optional(),
});

export type TeamBuilderInput = z.infer<typeof teamBuilderSchema>;
export type JudgingScoreInput = z.infer<typeof judgingScoreSchema>;
