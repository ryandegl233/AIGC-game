import { describe, expect, it } from 'vitest';

import { chooseOfflineQuestion, offlineQuestionBank } from '../../src/client/data/offline-bank';
import { questionSchema } from '../../src/shared/question-schema';

describe('offlineQuestionBank', () => {
  it('contains nine levels with six valid questions each', () => {
    expect(Object.keys(offlineQuestionBank)).toHaveLength(9);

    for (let levelId = 1; levelId <= 9; levelId += 1) {
      expect(offlineQuestionBank[levelId]).toHaveLength(6);
      for (const question of offlineQuestionBank[levelId] ?? []) {
        expect(questionSchema.safeParse(question).success).toBe(true);
        expect(question.levelId).toBe(levelId);
        expect(question.source).toBe('offline');
      }
    }
  });

  it('uses unique ids across all levels', () => {
    const ids = Object.values(offlineQuestionBank).flatMap((questions) =>
      questions.map((question) => question.id),
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('avoids excluded ids when another question is available', () => {
    const level = offlineQuestionBank[1] ?? [];
    const excluded = level.slice(0, 5).map((question) => question.id);

    expect(chooseOfflineQuestion(1, excluded, () => 0).id).toBe(level[5]?.id);
  });

  it('reuses the full level when every id is excluded', () => {
    const level = offlineQuestionBank[1] ?? [];
    const excluded = level.map((question) => question.id);

    expect(chooseOfflineQuestion(1, excluded, () => 0).id).toBe(level[0]?.id);
  });

  it('rejects an unknown level', () => {
    expect(() => chooseOfflineQuestion(10, [], () => 0)).toThrow('Unknown level 10');
  });
});
