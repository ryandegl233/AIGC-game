import type { AiApi } from '../api-client';
import { chooseOfflineQuestion } from '../data/offline-bank';
import { questionSchema, type Question } from '../../shared/question-schema';

export function shuffleQuestionOptions(
  question: Question,
  random: () => number = Math.random,
): Question {
  const options = question.options.map((text, index) => ({
    text,
    correct: index === question.correctIndex,
  }));

  for (let index = options.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(random() * (index + 1));
    [options[index], options[targetIndex]] = [options[targetIndex]!, options[index]!];
  }

  return {
    ...question,
    options: [options[0]!.text, options[1]!.text, options[2]!.text],
    correctIndex: options.findIndex((option) => option.correct),
  };
}

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
        if (parsed.success && parsed.data.levelId === levelId) {
          return shuffleQuestionOptions(parsed.data, this.random);
        }
      }
    } catch {
      // Offline content is the normal fallback path.
    }

    return shuffleQuestionOptions(
      chooseOfflineQuestion(levelId, excludedIds, this.random),
      this.random,
    );
  }
}
