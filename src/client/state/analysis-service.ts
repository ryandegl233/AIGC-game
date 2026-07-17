import type { AiApi } from '../api-client';
import type { AnalysisRequest } from '../../shared/api-contract';

export interface DisplayAnalysis {
  source: 'ai' | 'offline';
  correctAnswer: string;
  reason: string;
  misconception: string;
  context: string;
  memoryTip: string;
}

export class AnalysisService {
  constructor(private readonly api: AiApi) {}

  async get(request: AnalysisRequest): Promise<DisplayAnalysis> {
    try {
      const response = await this.api.analyzeAnswer(request);
      if (response.ok) return { source: 'ai', ...response.data };
    } catch {
      // The local explanation below is always available.
    }

    const { question, selectedIndex } = request;
    const correctAnswer = question.options[question.correctIndex] ?? question.options[0];
    const selectedAnswer = question.options[selectedIndex] ?? question.options[0];
    return {
      source: 'offline',
      correctAnswer,
      reason: question.explanation,
      misconception: selectedIndex === question.correctIndex
        ? '你的选择正确。请留意解析中的时代与体裁线索。'
        : `“${selectedAnswer}”不是本题的最佳答案，请比较时代与体裁特征。`,
      context: `本题属于 ${question.era} 范围。`,
      memoryTip: question.memoryTip,
    };
  }
}
