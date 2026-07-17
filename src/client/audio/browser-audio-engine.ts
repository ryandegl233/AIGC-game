import type { AudioCue, AudioEngine } from './audio-director';
import { midiToFrequency, type MusicPiece } from './music-catalog';

const CUE_NOTES: Record<AudioCue, readonly number[]> = {
  start: [60, 67],
  jump: [60, 72],
  land: [48],
  correct: [72, 76, 79],
  wrong: [55, 51],
  hazard: [45, 42],
};

export function getCueNotes(cue: AudioCue): readonly number[] {
  return CUE_NOTES[cue];
}

export class BrowserAudioEngine implements AudioEngine {
  private context?: AudioContext;
  private musicBus?: GainNode;
  private effectsBus?: GainNode;
  private musicVolume = 0.7;
  private effectsVolume = 0.8;
  private ducked = false;
  private currentPiece?: MusicPiece;
  private pendingPiece?: MusicPiece;
  private loopTimer?: ReturnType<typeof setTimeout>;
  private scheduled = new Set<OscillatorNode>();

  constructor(private readonly contextFactory: () => AudioContext = () => new AudioContext()) {}

  async unlock(): Promise<void> {
    try {
      const context = this.ensureContext();
      if (context.state === 'suspended') await context.resume();
    } catch {
      // Audio is an optional enhancement; gameplay remains fully functional.
    }
  }

  play(piece: MusicPiece): void {
    this.pendingPiece = piece;
    void this.unlock().then(() => {
      if (!this.context || this.pendingPiece !== piece) return;
      this.pendingPiece = undefined;
      this.startPiece(piece);
    });
  }

  setMusicVolume(value: number): void {
    this.musicVolume = Math.max(0, Math.min(1, value));
    this.applyMusicGain();
  }

  setEffectsVolume(value: number): void {
    this.effectsVolume = Math.max(0, Math.min(1, value));
    if (this.context && this.effectsBus) {
      this.effectsBus.gain.setTargetAtTime(this.effectsVolume * 0.24, this.context.currentTime, 0.03);
    }
  }

  setDucked(ducked: boolean): void {
    this.ducked = ducked;
    this.applyMusicGain();
  }

  pause(): void {
    void this.context?.suspend();
  }

  resume(): void {
    void this.context?.resume();
  }

  stop(): void {
    this.pendingPiece = undefined;
    this.currentPiece = undefined;
    this.stopScheduledMusic();
  }

  playCue(cue: AudioCue): void {
    void this.unlock().then(() => {
      const context = this.context;
      const bus = this.effectsBus;
      if (!context || !bus) return;
      const start = context.currentTime + 0.015;
      getCueNotes(cue).forEach((midi, index) => {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        const noteStart = start + index * 0.085;
        const noteEnd = noteStart + (cue === 'land' ? 0.09 : 0.16);
        oscillator.type = cue === 'wrong' || cue === 'hazard' ? 'square' : 'triangle';
        oscillator.frequency.setValueAtTime(midiToFrequency(midi), noteStart);
        envelope.gain.setValueAtTime(0.0001, noteStart);
        envelope.gain.exponentialRampToValueAtTime(0.28, noteStart + 0.018);
        envelope.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
        oscillator.connect(envelope).connect(bus);
        oscillator.start(noteStart);
        oscillator.stop(noteEnd + 0.02);
      });
    });
  }

  private ensureContext(): AudioContext {
    if (this.context) return this.context;
    const context = this.contextFactory();
    this.context = context;
    this.musicBus = context.createGain();
    this.effectsBus = context.createGain();
    this.musicBus.connect(context.destination);
    this.effectsBus.connect(context.destination);
    this.applyMusicGain();
    this.effectsBus.gain.setValueAtTime(this.effectsVolume * 0.24, context.currentTime);
    return context;
  }

  private startPiece(piece: MusicPiece): void {
    this.stopScheduledMusic();
    this.currentPiece = piece;
    this.scheduleLoop();
  }

  private scheduleLoop(): void {
    const context = this.context;
    const bus = this.musicBus;
    const piece = this.currentPiece;
    if (!context || !bus || !piece) return;
    const secondsPerBeat = 60 / piece.tempo;
    const loopSeconds = piece.loopBeats * secondsPerBeat;
    const loopStart = context.currentTime + 0.04;

    piece.events.forEach((event) => {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      const noteStart = loopStart + event.beat * secondsPerBeat;
      const noteEnd = noteStart + event.duration * secondsPerBeat;
      oscillator.type = event.voice === 'bass' ? 'sine' : piece.waveform;
      oscillator.frequency.setValueAtTime(midiToFrequency(event.midi), noteStart);
      envelope.gain.setValueAtTime(0.0001, noteStart);
      envelope.gain.exponentialRampToValueAtTime(event.gain, noteStart + 0.025);
      envelope.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
      oscillator.connect(envelope).connect(bus);
      oscillator.start(noteStart);
      oscillator.stop(noteEnd + 0.03);
      this.scheduled.add(oscillator);
      oscillator.onended = () => this.scheduled.delete(oscillator);
    });

    this.loopTimer = setTimeout(() => this.scheduleLoop(), loopSeconds * 1_000);
  }

  private applyMusicGain(): void {
    if (!this.context || !this.musicBus) return;
    const target = this.musicVolume * (this.ducked ? 0.055 : 0.18);
    this.musicBus.gain.setTargetAtTime(target, this.context.currentTime, 0.08);
  }

  private stopScheduledMusic(): void {
    if (this.loopTimer !== undefined) clearTimeout(this.loopTimer);
    this.loopTimer = undefined;
    this.scheduled.forEach((oscillator) => {
      try { oscillator.stop(); } catch { /* already stopped */ }
    });
    this.scheduled.clear();
  }
}
