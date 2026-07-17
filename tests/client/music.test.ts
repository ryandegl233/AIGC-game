import { describe, expect, it, vi } from 'vitest';

import { AudioDirector, type AudioEngine } from '../../src/client/audio/audio-director';
import { getCueNotes } from '../../src/client/audio/browser-audio-engine';
import { MUSIC_LIBRARY, getMusicPiece, midiToFrequency } from '../../src/client/audio/music-catalog';
import { createDefaultSave } from '../../src/client/state/save-store';

function createEngine(): AudioEngine {
  return {
    unlock: vi.fn(async () => undefined),
    play: vi.fn(),
    setMusicVolume: vi.fn(),
    setEffectsVolume: vi.fn(),
    setDucked: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    stop: vi.fn(),
    playCue: vi.fn(),
  };
}

describe('classical music system', () => {
  it('contains one playable public-domain theme for every level', () => {
    expect(MUSIC_LIBRARY.map((piece) => piece.levelId)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(MUSIC_LIBRARY.every((piece) => piece.events.length >= 8)).toBe(true);
    expect(getMusicPiece(2).title).toContain('四季·春');
    expect(getMusicPiece(6).title).toContain('第五交响曲');
    expect(getMusicPiece(9).title).toContain('自新大陆');
  });

  it('converts MIDI concert A to 440 Hz', () => {
    expect(midiToFrequency(69)).toBeCloseTo(440, 6);
  });

  it('uses distinct synthesized cues for success, failure, and hazards', () => {
    expect(getCueNotes('correct')).toEqual([72, 76, 79]);
    expect(getCueNotes('wrong')).toEqual([55, 51]);
    expect(getCueNotes('hazard')).toEqual([45, 42]);
  });

  it('coordinates volume, ducking, pause, resume, and feedback cues', async () => {
    const engine = createEngine();
    const director = new AudioDirector(engine);
    const settings = createDefaultSave().settings;

    director.configure(settings);
    await director.unlock();
    const piece = director.startLevel(5);
    director.startRun();
    director.showAnalysis(true);
    director.pause();
    director.resume();
    director.routePenalty();
    director.stop();

    expect(piece.levelId).toBe(5);
    expect(engine.setMusicVolume).toHaveBeenCalledWith(settings.masterVolume);
    expect(engine.setEffectsVolume).toHaveBeenCalledWith(settings.effectsVolume);
    expect(engine.play).toHaveBeenCalledWith(piece);
    expect(engine.setDucked).toHaveBeenCalledWith(true);
    expect(engine.playCue).toHaveBeenCalledWith('correct');
    expect(engine.playCue).toHaveBeenCalledWith('hazard');
    expect(engine.pause).toHaveBeenCalledTimes(1);
    expect(engine.resume).toHaveBeenCalledTimes(2);
    expect(engine.stop).toHaveBeenCalledTimes(1);
  });
});
