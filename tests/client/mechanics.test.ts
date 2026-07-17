import { describe, expect, it, vi } from 'vitest';

import { createMechanicLifecycle } from '../../src/client/game/mechanics';

describe('mechanic lifecycle', () => {
  it('previews exactly one declared period before stopping', async () => {
    const sleep = vi.fn(async () => undefined);
    const startMotion = vi.fn();
    const stopMotion = vi.fn();
    const lifecycle = createMechanicLifecycle(3_200, { sleep, startMotion, stopMotion });

    await lifecycle.preview();

    expect(startMotion).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledWith(3_200);
    expect(stopMotion).toHaveBeenCalledTimes(1);
    expect(lifecycle.isRunning()).toBe(false);
  });

  it('starts and stops without leaving the running flag set', () => {
    const lifecycle = createMechanicLifecycle(2_400, {
      sleep: async () => undefined,
      startMotion: vi.fn(),
      stopMotion: vi.fn(),
    });

    lifecycle.start();
    expect(lifecycle.isRunning()).toBe(true);
    lifecycle.stop();
    expect(lifecycle.isRunning()).toBe(false);
  });
});
