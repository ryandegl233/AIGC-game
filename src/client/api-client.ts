import {
  analysisResponseSchema,
  questionResponseSchema,
  type AnalysisRequest,
  type AnalysisResponse,
  type QuestionRequest,
  type QuestionResponse,
} from '../shared/api-contract';

export interface AiApi {
  generateQuestion(request: QuestionRequest): Promise<QuestionResponse>;
  analyzeAnswer(request: AnalysisRequest): Promise<AnalysisResponse>;
}

async function postJson<T>(
  path: string,
  body: unknown,
  timeoutMs: number,
  parse: (value: unknown) => T,
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`API request failed with ${response.status}`);
    return parse(await response.json());
  } finally {
    window.clearTimeout(timeout);
  }
}

export const aiApi: AiApi = {
  generateQuestion(request) {
    return postJson('/api/questions/generate', request, 9_000, (value) =>
      questionResponseSchema.parse(value));
  },
  analyzeAnswer(request) {
    return postJson('/api/answers/analyze', request, 7_000, (value) =>
      analysisResponseSchema.parse(value));
  },
};
