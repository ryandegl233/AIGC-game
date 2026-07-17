import { questionSchema, type Question } from '../../shared/question-schema';
import { level01Questions } from './levels/level-01';
import { level02Questions } from './levels/level-02';
import { level03Questions } from './levels/level-03';
import { level04Questions } from './levels/level-04';
import { level05Questions } from './levels/level-05';
import { level06Questions } from './levels/level-06';
import { level07Questions } from './levels/level-07';
import { level08Questions } from './levels/level-08';
import { level09Questions } from './levels/level-09';

const rawBank = {
  1: level01Questions,
  2: level02Questions,
  3: level03Questions,
  4: level04Questions,
  5: level05Questions,
  6: level06Questions,
  7: level07Questions,
  8: level08Questions,
  9: level09Questions,
} as const;

const parsedEntries = Object.entries(rawBank).map(
  ([levelId, questions]) =>
    [
      Number(levelId),
      Object.freeze(questions.map((question) => questionSchema.parse(question))),
    ] as const,
);

const allIds = parsedEntries.flatMap(([, questions]) => questions.map((question) => question.id));
if (new Set(allIds).size !== allIds.length) {
  throw new Error('Offline question ids must be unique');
}

export const offlineQuestionBank = Object.freeze(
  Object.fromEntries(parsedEntries),
) as Readonly<Record<number, readonly Question[]>>;

export function chooseOfflineQuestion(
  levelId: number,
  excludedIds: readonly string[],
  random: () => number = Math.random,
): Question {
  const level = offlineQuestionBank[levelId];
  if (!level) throw new Error(`Unknown level ${levelId}`);

  const candidates = level.filter((question) => !excludedIds.includes(question.id));
  const pool = candidates.length > 0 ? candidates : level;
  const index = Math.min(pool.length - 1, Math.max(0, Math.floor(random() * pool.length)));
  const selected = pool[index];

  if (!selected) throw new Error(`Level ${levelId} has no offline questions`);
  return selected;
}
