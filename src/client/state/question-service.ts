import type { AiApi } from '../api-client';
import { chooseOfflineQuestion } from '../data/offline-bank';
import { questionSchema, type Question } from '../../shared/question-schema';

export class QuestionService {
  constructor(
    private readonly api: AiApi,
    private readonly random: () => number = Math.random,
  ) {}

  async next(
    levelId: number,
    era: string,
    difficulty: number,
    excludedIds: readonly string[],
    excludedPrompts: readonly string[],
  ): Promise<Question> {
    try {
      const response = await this.api.generateQuestion({
        levelId,
        era,
        difficulty,
        excludedPrompts: [...excludedPrompts],
      });
      if (response.ok) {
        const parsed = questionSchema.safeParse(response.data);
        if (parsed.success && parsed.data.levelId === levelId) return parsed.data;
      }
    } catch {
      // Offline content is the normal fallback path.
    }

    return chooseOfflineQuestion(levelId, excludedIds, this.random);
  }
}
