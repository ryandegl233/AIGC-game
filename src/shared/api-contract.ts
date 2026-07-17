import { z } from 'zod';

import { analysisSchema, questionSchema, type AnswerAnalysis, type Question } from './question-schema';

export const fallbackReasonSchema = z.enum([
  'missing_key',
  'timeout',
  'invalid_output',
  'upstream_error',
]);

export type FallbackReason = z.infer<typeof fallbackReasonSchema>;

export const questionRequestSchema = z.object({
  levelId: z.number().int().min(1).max(9),
  era: z.string().trim().min(2).max(60),
  difficulty: z.number().int().min(1).max(9),
  excludedPrompts: z.array(z.string().trim().min(1).max(240)).max(12).default([]),
});

export type QuestionRequest = z.infer<typeof questionRequestSchema>;

export const analysisRequestSchema = z.object({
  question: questionSchema,
  selectedIndex: z.number().int().min(0).max(2),
});

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;

export type SuccessResponse<T> = { ok: true; data: T };
export type FallbackResponse = { ok: false; fallback: true; reason: FallbackReason };

export type QuestionResponse = SuccessResponse<Question> | FallbackResponse;
export type AnalysisResponse = SuccessResponse<AnswerAnalysis> | FallbackResponse;

export const questionResponseSchema = z.union([
  z.object({ ok: z.literal(true), data: questionSchema }),
  z.object({ ok: z.literal(false), fallback: z.literal(true), reason: fallbackReasonSchema }),
]);

export const analysisResponseSchema = z.union([
  z.object({ ok: z.literal(true), data: analysisSchema }),
  z.object({ ok: z.literal(false), fallback: z.literal(true), reason: fallbackReasonSchema }),
]);
