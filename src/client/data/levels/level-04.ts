import type { Question } from '../../../shared/question-schema';

export const level04Questions = [
  {
    id: 'l04-haydn-nickname', levelId: 4, era: 'classical-formation', difficulty: 4,
    prompt: '哪位作曲家常被后世称为“交响曲之父”和“弦乐四重奏之父”？',
    options: ['约瑟夫·海顿', '沃尔夫冈·阿马德乌斯·莫扎特', '克里斯托夫·维利巴尔德·格鲁克'], correctIndex: 0,
    explanation: '海顿并非这两种体裁的唯一创造者，但他以大量成熟作品确立并发展了交响曲和弦乐四重奏的古典范式。这些称号概括的是他的历史影响。',
    memoryTip: '海顿让交响曲与四重奏长成成熟的家庭。', source: 'offline',
  },
  {
    id: 'l04-string-quartet', levelId: 4, era: 'classical-formation', difficulty: 4,
    prompt: '标准弦乐四重奏由哪些乐器组成？',
    options: ['两把小提琴、中提琴和大提琴', '小提琴、长笛、圆号和钢琴', '两把中提琴与两把低音提琴'], correctIndex: 0,
    explanation: '标准弦乐四重奏由第一小提琴、第二小提琴、中提琴与大提琴组成。四个声部既能独立对话，也能形成均衡统一的合奏。',
    memoryTip: '二小提、一中提、一大提，正好四件。', source: 'offline',
  },
  {
    id: 'l04-sonata-form-order', levelId: 4, era: 'classical-formation', difficulty: 4,
    prompt: '奏鸣曲式三个主要部分的常见顺序是什么？',
    options: ['呈示部、展开部、再现部', '再现部、尾声、呈示部', '慢板、宣叙调、赋格'], correctIndex: 0,
    explanation: '奏鸣曲式通常先在呈示部提出主要主题与调性对比，再在展开部发展材料，最后由再现部让主要材料回到主调。作品还可能附带引子或尾声。',
    memoryTip: '先呈示，再展开，最后再现。', source: 'offline',
  },
  {
    id: 'l04-minuet-meter', levelId: 4, era: 'classical-formation', difficulty: 4,
    prompt: '古典交响曲中的小步舞曲乐章通常采用什么节拍？',
    options: ['三拍子', '五拍子', '没有固定拍号'], correctIndex: 0,
    explanation: '小步舞曲源于宫廷舞蹈，通常采用三拍子，并常与中段 Trio 构成复三部结构。贝多芬后来常用更活跃的谐谑曲取代它。',
    memoryTip: '小步舞三步一组，重拍先落下。', source: 'offline',
  },
  {
    id: 'l04-surprise-symphony', levelId: 4, era: 'classical-formation', difficulty: 4,
    prompt: '《惊愕交响曲》是哪位作曲家的作品？',
    options: ['约瑟夫·海顿', '路德维希·凡·贝多芬', '弗朗茨·舒伯特'], correctIndex: 0,
    explanation: '海顿的第94交响曲因慢乐章中突然出现的强奏和弦而得名“惊愕”。这部作品属于他为伦敦听众创作的交响曲。',
    memoryTip: '海顿用一个突然的强音惊醒伦敦。', source: 'offline',
  },
  {
    id: 'l04-classical-style', levelId: 4, era: 'classical-formation', difficulty: 4,
    prompt: '哪项最符合古典主义成熟风格的常见特征？',
    options: ['清晰均衡的乐句与主调织体', '持续密集的中世纪等节奏', '完全回避主题对比'], correctIndex: 0,
    explanation: '古典主义常强调清晰的周期性乐句、主调织体、主题对比与形式均衡。复调并未消失，但不再像盛期巴洛克那样持续占据核心。',
    memoryTip: '古典风格重清晰、对比与平衡。', source: 'offline',
  },
] satisfies readonly Question[];
