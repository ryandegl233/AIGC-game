import { z, type ZodType } from 'zod';

import type { AnalysisRequest, FallbackReason, QuestionRequest } from '../shared/api-contract';
import {
  analysisSchema,
  questionSchema,
  type AnswerAnalysis,
  type Question,
} from '../shared/question-schema';
import { buildAnalysisPrompts, buildQuestionPrompts } from './prompts';

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

const completionSchema = z.object({
  choices: z.array(z.object({ message: z.object({ content: z.string().nullable() }) })).min(1),
});

export type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export class DeepSeekError extends Error {
  constructor(public readonly reason: FallbackReason) {
    super(`DeepSeek request failed: ${reason}`);
    this.name = 'DeepSeekError';
  }
}

export interface DeepSeekService {
  generateQuestion(request: QuestionRequest): Promise<Question>;
  analyzeAnswer(request: AnalysisRequest): Promise<AnswerAnalysis>;
}

interface DeepSeekClientOptions {
  apiKey?: string;
  model?: string;
  fetchImpl?: FetchLike;
  questionTimeoutMs?: number;
  analysisTimeoutMs?: number;
  maxAttempts?: number;
}

interface PromptPair {
  system: string;
  user: string;
}

export function createDeepSeekClient(options: DeepSeekClientOptions = {}): DeepSeekService {
  const apiKey = options.apiKey?.trim();
  const model = options.model?.trim() || 'deepseek-v4-flash';
  const fetchImpl = options.fetchImpl ?? fetch;
  const questionTimeoutMs = options.questionTimeoutMs ?? 8_000;
  const analysisTimeoutMs = options.analysisTimeoutMs ?? 6_000;
  const maxAttempts = options.maxAttempts ?? 2;

  async function callJson<T>(prompts: PromptPair, schema: ZodType<T>, timeoutMs: number): Promise<T> {
    if (!apiKey) throw new DeepSeekError('missing_key');

    let lastReason: FallbackReason = 'upstream_error';
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetchImpl(DEEPSEEK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: prompts.system },
              { role: 'user', content: prompts.user },
            ],
            thinking: { type: 'disabled' },
            response_format: { type: 'json_object' },
            temperature: 0.5,
            max_tokens: 900,
            stream: false,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          lastReason = 'upstream_error';
          continue;
        }

        const envelope = completionSchema.parse(await response.json());
        const content = envelope.choices[0]?.message.content;
        if (!content) {
          lastReason = 'invalid_output';
          continue;
        }

        return schema.parse(JSON.parse(content));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          lastReason = 'timeout';
        } else if (
          error instanceof SyntaxError ||
          error instanceof z.ZodError ||
          (error instanceof Error && error.name === 'ZodError')
        ) {
          lastReason = 'invalid_output';
        } else {
          lastReason = 'upstream_error';
        }
      } finally {
        clearTimeout(timeout);
      }
    }

    throw new DeepSeekError(lastReason);
  }

  return {
    async generateQuestion(request) {
      const rawSchema = questionSchema.omit({ source: true });
      const parsed = await callJson(buildQuestionPrompts(request), rawSchema, questionTimeoutMs);
      return questionSchema.parse({ ...parsed, source: 'ai' });
    },
    async analyzeAnswer(request) {
      return callJson(buildAnalysisPrompts(request), analysisSchema, analysisTimeoutMs);
    },
  };
}
