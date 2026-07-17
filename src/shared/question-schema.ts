import { z } from 'zod';

export const questionSchema = z.object({
  id: z.string().trim().min(1).max(100),
  levelId: z.number().int().min(1).max(9),
  era: z.string().trim().min(2).max(60),
  difficulty: z.number().int().min(1).max(9),
  prompt: z.string().trim().min(8).max(240),
  options: z
    .tuple([
      z.string().trim().min(1).max(90),
      z.string().trim().min(1).max(90),
      z.string().trim().min(1).max(90),
    ])
    .refine(
      (items) => new Set(items.map((item) => item.toLocaleLowerCase())).size === 3,
      'Options must be unique',
    ),
  correctIndex: z.number().int().min(0).max(2),
  explanation: z.string().trim().min(12).max(700),
  memoryTip: z.string().trim().min(4).max(160),
  source: z.enum(['ai', 'offline']),
});

export type Question = z.infer<typeof questionSchema>;

export const analysisSchema = z.object({
  correctAnswer: z.string().trim().min(1).max(90),
  reason: z.string().trim().min(12).max(700),
  misconception: z.string().trim().min(8).max(500),
  context: z.string().trim().min(8).max(500),
  memoryTip: z.string().trim().min(4).max(160),
});

export type AnswerAnalysis = z.infer<typeof analysisSchema>;
