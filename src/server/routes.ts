import { Router } from 'express';

import { analysisRequestSchema, questionRequestSchema } from '../shared/api-contract';
import type { DeepSeekService } from './deepseek-client';
import { toFallbackReason } from './error-mapper';

export function createApiRouter(deepSeekService: DeepSeekService): Router {
  const router = Router();

  router.post('/questions/generate', async (request, response) => {
    const input = questionRequestSchema.safeParse(request.body);
    if (!input.success) {
      response.status(400).json({ ok: false, error: 'invalid_request' });
      return;
    }

    try {
      const question = await deepSeekService.generateQuestion(input.data);
      response.json({ ok: true, data: question });
    } catch (error) {
      response.json({ ok: false, fallback: true, reason: toFallbackReason(error) });
    }
  });

  router.post('/answers/analyze', async (request, response) => {
    const input = analysisRequestSchema.safeParse(request.body);
    if (!input.success) {
      response.status(400).json({ ok: false, error: 'invalid_request' });
      return;
    }

    try {
      const analysis = await deepSeekService.analyzeAnswer(input.data);
      response.json({ ok: true, data: analysis });
    } catch (error) {
      response.json({ ok: false, fallback: true, reason: toFallbackReason(error) });
    }
  });

  return router;
}
