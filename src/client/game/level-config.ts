export type MechanicType =
  | 'static'
  | 'horizontal'
  | 'vertical'
  | 'phrase-lift'
  | 'scroll'
  | 'pulse'
  | 'mixed'
  | 'final';

export interface MechanicConfig {
  type: MechanicType;
  periodMs: number;
  amplitude: number;
  scrollSpeed?: number;
}

export interface LevelConfig {
  id: number;
  title: string;
  dateLabel: string;
  era: string;
  difficulty: number;
  timeLimit: number;
  requiredQuestions: 3;
  verticalOffsets: readonly [number, number, number];
  mechanic: MechanicConfig;
}

export const LEVELS = [
  { id:1, title:'歌剧的黎明', dateLabel:'约 1600–1650', era:'early-baroque', difficulty:1, timeLimit:30, requiredQuestions:3, verticalOffsets:[12,-18,6], mechanic:{type:'static',periodMs:0,amplitude:0} },
  { id:2, title:'威尼斯的四季', dateLabel:'意大利巴洛克', era:'italian-baroque', difficulty:2, timeLimit:28, requiredQuestions:3, verticalOffsets:[30,-24,14], mechanic:{type:'static',periodMs:0,amplitude:0} },
  { id:3, title:'赋格与清唱剧', dateLabel:'盛期巴洛克', era:'high-baroque', difficulty:3, timeLimit:26, requiredQuestions:3, verticalOffsets:[18,-20,10], mechanic:{type:'horizontal',periodMs:3200,amplitude:72} },
  { id:4, title:'海顿的乐章', dateLabel:'古典主义形成', era:'classical-formation', difficulty:4, timeLimit:24, requiredQuestions:3, verticalOffsets:[26,-28,12], mechanic:{type:'vertical',periodMs:3000,amplitude:54} },
  { id:5, title:'莫扎特的剧场', dateLabel:'维也纳古典乐派', era:'viennese-classical', difficulty:5, timeLimit:22, requiredQuestions:3, verticalOffsets:[22,-30,14], mechanic:{type:'phrase-lift',periodMs:2800,amplitude:48} },
  { id:6, title:'英雄的转调', dateLabel:'古典至浪漫', era:'classical-romantic-transition', difficulty:6, timeLimit:21, requiredQuestions:3, verticalOffsets:[24,-34,8], mechanic:{type:'scroll',periodMs:2600,amplitude:42,scrollSpeed:34} },
  { id:7, title:'诗人与夜曲', dateLabel:'早期浪漫主义', era:'early-romantic', difficulty:7, timeLimit:19, requiredQuestions:3, verticalOffsets:[30,-32,18], mechanic:{type:'pulse',periodMs:2400,amplitude:38} },
  { id:8, title:'幻想交响与乐剧', dateLabel:'浪漫主义扩张', era:'romantic-expansion', difficulty:8, timeLimit:18, requiredQuestions:3, verticalOffsets:[34,-38,20], mechanic:{type:'mixed',periodMs:2300,amplitude:46,scrollSpeed:42} },
  { id:9, title:'世纪末的交响迷宫', dateLabel:'晚期浪漫主义', era:'late-romantic', difficulty:9, timeLimit:16, requiredQuestions:3, verticalOffsets:[36,-40,22], mechanic:{type:'final',periodMs:2200,amplitude:52,scrollSpeed:48} },
] as const satisfies readonly LevelConfig[];

export function getLevelConfig(levelId: number): LevelConfig {
  const level = LEVELS.find((candidate) => candidate.id === levelId);
  if (!level) throw new Error(`Unknown level ${levelId}`);
  return level;
}
