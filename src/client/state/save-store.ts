import { z } from 'zod';

const SAVE_KEY = 'golden-clef-save';

const saveSchema = z.object({
  version: z.literal(1),
  unlockedLevel: z.number().int().min(1).max(9),
  bestScores: z.record(z.string(), z.number().int().nonnegative()),
  recentQuestionIds: z.array(z.string()).max(36),
  settings: z.object({
    masterVolume: z.number().min(0).max(1),
    effectsVolume: z.number().min(0).max(1),
    reducedMotion: z.boolean(),
    keys: z.object({ left: z.string(), right: z.string(), jump: z.string() }),
  }),
});

export type SaveData = z.infer<typeof saveSchema>;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function createDefaultSave(): SaveData {
  return {
    version: 1,
    unlockedLevel: 1,
    bestScores: {},
    recentQuestionIds: [],
    settings: {
      masterVolume: 0.7,
      effectsVolume: 0.8,
      reducedMotion: false,
      keys: { left: 'KeyA', right: 'KeyD', jump: 'Space' },
    },
  };
}

export class SaveStore {
  constructor(private readonly storage: StorageLike = window.localStorage) {}

  load(): SaveData {
    try {
      const raw = this.storage.getItem(SAVE_KEY);
      if (!raw) return createDefaultSave();
      const parsed = saveSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : createDefaultSave();
    } catch {
      return createDefaultSave();
    }
  }

  save(data: SaveData): void {
    this.storage.setItem(SAVE_KEY, JSON.stringify(saveSchema.parse(data)));
  }
}
