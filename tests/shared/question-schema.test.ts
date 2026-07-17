import { describe, expect, it } from 'vitest';

import { questionSchema } from '../../src/shared/question-schema';

const validQuestion = {
  id: 'l01-monteverdi-orfeo',
  levelId: 1,
  era: 'early-baroque',
  difficulty: 1,
  prompt: 'Which composer wrote the early opera L’Orfeo?',
  options: ['Claudio Monteverdi', 'Antonio Vivaldi', 'George Frideric Handel'],
  correctIndex: 0,
  explanation: 'Monteverdi composed L’Orfeo, first performed in Mantua in 1607.',
  memoryTip: 'Orfeo opens the Monteverdi journey.',
  source: 'offline',
};

describe('questionSchema', () => {
  it('accepts a valid three-option question', () => {
    expect(questionSchema.parse(validQuestion)).toEqual(validQuestion);
  });

  it('rejects duplicate options', () => {
    expect(() =>
      questionSchema.parse({
        ...validQuestion,
        options: ['Johann Sebastian Bach', 'Johann Sebastian Bach', 'George Frideric Handel'],
      }),
    ).toThrow();
  });

  it('rejects an answer index outside the options', () => {
    expect(() => questionSchema.parse({ ...validQuestion, correctIndex: 3 })).toThrow();
  });

  it('rejects a level outside one through nine', () => {
    expect(() => questionSchema.parse({ ...validQuestion, levelId: 10 })).toThrow();
  });
});
