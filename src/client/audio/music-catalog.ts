export interface MusicEvent {
  beat: number;
  duration: number;
  midi: number;
  gain: number;
  voice: 'melody' | 'bass';
}

export interface MusicPiece {
  levelId: number;
  composer: string;
  title: string;
  tempo: number;
  waveform: OscillatorType;
  loopBeats: number;
  events: readonly MusicEvent[];
}

function sequence(notes: readonly number[], duration = 0.5): MusicEvent[] {
  return notes.map((midi, index) => ({
    beat: index * duration,
    duration: duration * 0.88,
    midi,
    gain: 0.15,
    voice: 'melody',
  }));
}

function withBass(notes: readonly number[], roots: readonly number[], duration = 0.5): MusicEvent[] {
  const melody = sequence(notes, duration);
  const loopBeats = notes.length * duration;
  const bass = Array.from({ length: Math.ceil(loopBeats / 2) }, (_, index) => ({
    beat: index * 2,
    duration: 1.65,
    midi: roots[index % roots.length]!,
    gain: 0.075,
    voice: 'bass' as const,
  }));
  return [...melody, ...bass];
}

const pieces = [
  { levelId:1, composer:'克劳迪奥·蒙特威尔第', title:'《奥菲欧》托卡塔·主题编曲', tempo:104, waveform:'square', notes:[67,67,69,71,72,71,69,67,64,67,69,67,64,62,60,67], roots:[48,55] },
  { levelId:2, composer:'安东尼奥·维瓦尔第', title:'《四季·春》第一乐章·主题编曲', tempo:126, waveform:'sawtooth', notes:[76,76,76,75,73,71,71,70,68,66,64,68,71,73,71,68], roots:[52,59,57,59] },
  { levelId:3, composer:'约翰·塞巴斯蒂安·巴赫', title:'《C大调前奏曲》BWV 846·主题编曲', tempo:92, waveform:'triangle', notes:[60,64,67,72,64,67,72,76,60,62,69,74,62,69,74,77], roots:[48,48,50,50] },
  { levelId:4, composer:'约瑟夫·海顿', title:'《惊愕交响曲》第二乐章·主题编曲', tempo:104, waveform:'triangle', notes:[60,60,64,64,67,67,64,65,65,62,62,59,59,60,72,60], roots:[48,55,53,55] },
  { levelId:5, composer:'沃尔夫冈·阿玛多伊斯·莫扎特', title:'《小夜曲》K.525·主题编曲', tempo:132, waveform:'sawtooth', notes:[67,62,67,62,67,62,67,71,74,71,67,66,64,64,66,67], roots:[43,50,48,50] },
  { levelId:6, composer:'路德维希·范·贝多芬', title:'《第五交响曲》第一乐章·主题编曲', tempo:108, waveform:'square', notes:[67,67,67,63,65,65,65,62,67,67,67,63,68,68,68,65], roots:[43,39,41,38] },
  { levelId:7, composer:'弗雷德里克·肖邦', title:'《降E大调夜曲》Op.9 No.2·主题编曲', tempo:72, waveform:'sine', notes:[67,67,65,67,72,71,69,67,65,64,62,64,65,67,72,71], roots:[51,58,55,58] },
  { levelId:8, composer:'理查德·瓦格纳', title:'《女武神的骑行》·主题编曲', tempo:116, waveform:'sawtooth', notes:[62,67,71,62,67,71,74,71,67,62,64,69,72,76,72,69], roots:[38,43,40,45] },
  { levelId:9, composer:'安东宁·德沃夏克', title:'《自新大陆交响曲》第二乐章·主题编曲', tempo:78, waveform:'triangle', notes:[64,67,67,64,62,60,62,64,67,64,62,60,59,62,64,60], roots:[48,43,45,48] },
] as const;

export const MUSIC_LIBRARY: readonly MusicPiece[] = pieces.map((piece) => ({
  levelId: piece.levelId,
  composer: piece.composer,
  title: piece.title,
  tempo: piece.tempo,
  waveform: piece.waveform,
  loopBeats: piece.notes.length * 0.5,
  events: withBass(piece.notes, piece.roots),
}));

export function getMusicPiece(levelId: number): MusicPiece {
  const piece = MUSIC_LIBRARY.find((candidate) => candidate.levelId === levelId);
  if (!piece) throw new Error(`Unknown music level ${levelId}`);
  return piece;
}

export function midiToFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}
