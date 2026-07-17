import { describe, expect, it } from 'vitest';

import { AnalysisService } from '../../src/client/state/analysis-service';
import { QuestionService, shuffleQuestionOptions } from '../../src/client/state/question-service';
import { offlineQuestionBank } from '../../src/client/data/offline-bank';
import type { AiApi } from '../../src/client/api-client';

const aiQuestion = {
  ...offlineQuestionBank[1]![0]!,
  id: 'ai-question',
  source: 'ai' as const,
};

describe('QuestionService', () => {
  it('shuffles answer positions while keeping the correct answer aligned', () => {
    const randomValues = [0.99, 0.1];
    const question = shuffleQuestionOptions(aiQuestion, () => randomValues.shift() ?? 0);

    expect(question.options).toEqual([
      aiQuestion.options[1],
      aiQuestion.options[0],
      aiQuestion.options[2],
    ]);
    expect(question.correctIndex).toBe(1);
    expect(question.options[question.correctIndex]).toBe(aiQuestion.options[aiQuestion.correctIndex]);
    expect(aiQuestion.correctIndex).toBe(0);
  });

  it('randomizes AI questions before returning them', async () => {
    const api: AiApi = {
      generateQuestion: async () => ({ ok: true, data: aiQuestion }),
      analyzeAnswer: async () => ({ ok: false, fallback: true, reason: 'missing_key' }),
    };
    const randomValues = [0.99, 0.1];
    const service = new QuestionService(api, () => randomValues.shift() ?? 0);

    const question = await service.next(1, 'early-baroque', 1, [], []);
    expect(question.correctIndex).toBe(1);
    expect(question.options[question.correctIndex]).toBe(aiQuestion.options[aiQuestion.correctIndex]);
  });

  it('returns a valid AI question', async () => {
    const api: AiApi = {
      generateQuestion: async () => ({ ok: true, data: aiQuestion }),
      analyzeAnswer: async () => ({ ok: false, fallback: true, reason: 'missing_key' }),
    };
    const service = new QuestionService(api, () => 0.99);

    await expect(service.next(1, 'early-baroque', 1, [], [])).resolves.toEqual(aiQuestion);
  });

  it.each(['fallback response', 'network rejection', 'invalid AI level'])('%s uses offline content', async (caseName) => {
    const api: AiApi = {
      generateQuestion: caseName === 'network rejection'
        ? async () => { throw new Error('offline'); }
        : async () => caseName === 'invalid AI level'
          ? { ok: true, data: { ...aiQuestion, levelId: 2 } }
          : { ok: false, fallback: true, reason: 'missing_key' },
      analyzeAnswer: async () => ({ ok: false, fallback: true, reason: 'missing_key' }),
    };
    const service = new QuestionService(api, () => 0);

    const question = await service.next(1, 'early-baroque', 1, [], []);
    expect(question.source).toBe('offline');
    expect(question.levelId).toBe(1);
  });
});

describe('AnalysisService', () => {
  it('uses offline explanation when analysis fails', async () => {
    const api: AiApi = {
      generateQuestion: async () => ({ ok: false, fallback: true, reason: 'missing_key' }),
      analyzeAnswer: async () => { throw new Error('offline'); },
    };
    const service = new AnalysisService(api);
    const question = offlineQuestionBank[1]![0]!;

    await expect(service.get({ question, selectedIndex: 1 })).resolves.toMatchObject({
      source: 'offline', reason: question.explanation, memoryTip: question.memoryTip,
    });
  });
});
