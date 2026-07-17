import type { AnalysisRequest, QuestionRequest } from '../shared/api-contract';

const QUESTION_SYSTEM_PROMPT = `你是一名严谨的西方古典音乐史出题者。只输出一个 JSON 对象，不要输出 Markdown。
题目必须是中文三选一单选题，恰好一个最佳答案；不得依赖音频，不得包含学术歧义。
JSON 字段必须为 id、levelId、era、difficulty、prompt、options、correctIndex、explanation、memoryTip、source。
options 必须恰好包含三个互不相同的字符串；correctIndex 只能是 0、1 或 2；source 必须写 ai。`;

const ANALYSIS_SYSTEM_PROMPT = `你是一名严谨而简洁的古典音乐史讲解者。只输出一个 JSON 对象，不要输出 Markdown。
JSON 字段必须为 correctAnswer、reason、misconception、context、memoryTip。
不得改变题目给定的正确答案；讲解应指出玩家选择为何正确或为何容易混淆。`;

export function buildQuestionPrompts(request: QuestionRequest): {
  system: string;
  user: string;
} {
  return {
    system: QUESTION_SYSTEM_PROMPT,
    user: JSON.stringify({
      task: 'generate_classical_music_question',
      levelId: request.levelId,
      era: request.era,
      difficulty: request.difficulty,
      excludedPrompts: request.excludedPrompts,
      requirements: '题目范围必须严格匹配时代；解析需包含事实依据；记忆提示不超过一句。',
    }),
  };
}

export function buildAnalysisPrompts(request: AnalysisRequest): {
  system: string;
  user: string;
} {
  const { question, selectedIndex } = request;
  return {
    system: ANALYSIS_SYSTEM_PROMPT,
    user: JSON.stringify({
      task: 'analyze_classical_music_answer',
      prompt: question.prompt,
      options: question.options,
      correctIndex: question.correctIndex,
      selectedIndex,
      correctAnswer: question.options[question.correctIndex],
      selectedAnswer: question.options[selectedIndex],
      era: question.era,
    }),
  };
}
