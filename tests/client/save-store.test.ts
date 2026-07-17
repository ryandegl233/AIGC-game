import { describe, expect, it } from 'vitest';

import { createDefaultSave, SaveStore, type StorageLike } from '../../src/client/state/save-store';

function memoryStorage(initial?: string): StorageLike {
  let value = initial ?? null;
  return {
    getItem: () => value,
    setItem: (_key, next) => { value = next; },
  };
}

describe('SaveStore', () => {
  it('returns defaults for empty storage', () => {
    expect(new SaveStore(memoryStorage()).load()).toEqual(createDefaultSave());
  });

  it('round-trips a version one save', () => {
    const storage = memoryStorage();
    const store = new SaveStore(storage);
    const save = { ...createDefaultSave(), unlockedLevel: 4, bestScores: { 1: 420 } };
    store.save(save);
    expect(store.load()).toEqual(save);
  });

  it.each(['not json', JSON.stringify({ version: 99 })])('recovers from invalid data', (raw) => {
    expect(new SaveStore(memoryStorage(raw)).load()).toEqual(createDefaultSave());
  });
});
