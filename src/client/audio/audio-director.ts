import type { SaveData } from '../state/save-store';
import { getMusicPiece, type MusicPiece } from './music-catalog';

export type AudioCue = 'start' | 'jump' | 'land' | 'correct' | 'wrong' | 'hazard';

export interface AudioEngine {
  unlock(): Promise<void>;
  play(piece: MusicPiece): void;
  setMusicVolume(value: number): void;
  setEffectsVolume(value: number): void;
  setDucked(ducked: boolean): void;
  pause(): void;
  resume(): void;
  stop(): void;
  playCue(cue: AudioCue): void;
}

export class AudioDirector {
  constructor(private readonly engine: AudioEngine) {}

  configure(settings: SaveData['settings']): void {
    this.engine.setMusicVolume(settings.masterVolume);
    this.engine.setEffectsVolume(settings.effectsVolume);
  }

  unlock(): Promise<void> {
    return this.engine.unlock();
  }

  startLevel(levelId: number): MusicPiece {
    const piece = getMusicPiece(levelId);
    this.engine.play(piece);
    this.engine.setDucked(false);
    return piece;
  }

  startRun(): void {
    this.engine.resume();
    this.engine.setDucked(false);
    this.engine.playCue('start');
  }

  showAnalysis(correct: boolean): void {
    this.engine.setDucked(true);
    this.engine.playCue(correct ? 'correct' : 'wrong');
  }

  pause(): void { this.engine.pause(); }
  resume(): void { this.engine.resume(); }
  routePenalty(): void { this.engine.playCue('hazard'); }
  jump(): void { this.engine.playCue('jump'); }
  land(): void { this.engine.playCue('land'); }
  stop(): void { this.engine.stop(); }
}
