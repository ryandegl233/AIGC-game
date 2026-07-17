import type { Question } from '../../../shared/question-schema';

export const level01Questions = [
  {
    id: 'l01-orfeo-composer', levelId: 1, era: 'early-baroque', difficulty: 1,
    prompt: '早期歌剧《奥菲欧》（L’Orfeo）的作曲家是谁？',
    options: ['克劳迪奥·蒙特威尔第', '安东尼奥·维瓦尔第', '乔治·弗里德里克·亨德尔'], correctIndex: 0,
    explanation: '蒙特威尔第的《奥菲欧》于1607年在曼图亚上演，是早期歌剧史上的里程碑。它综合运用了宣叙调、咏叹性段落、合唱和器乐色彩。',
    memoryTip: '奥菲欧回望爱人，蒙特威尔第回望文艺复兴。', source: 'offline',
  },
  {
    id: 'l01-basso-continuo', levelId: 1, era: 'early-baroque', difficulty: 1,
    prompt: '巴洛克音乐中的“数字低音”主要承担什么作用？',
    options: ['提供持续的低音与和声基础', '只负责演奏最高旋律', '取代所有声乐声部'], correctIndex: 0,
    explanation: '数字低音由低音乐器与和弦乐器共同构成持续的低音和和声框架。谱面上的数字提示键盘或拨弦乐器应构成的和弦。',
    memoryTip: '数字写在低音上，撑起整座和声建筑。', source: 'offline',
  },
  {
    id: 'l01-monody', levelId: 1, era: 'early-baroque', difficulty: 1,
    prompt: '早期巴洛克“单声歌曲”（monody）的典型织体是什么？',
    options: ['独唱旋律配器乐伴奏', '无伴奏多声合唱', '三支小号齐奏'], correctIndex: 0,
    explanation: '单声歌曲突出一条富于表现力的独唱旋律，并由数字低音等器乐伴奏支撑。它帮助歌词表达变得更直接，也推动了歌剧的发展。',
    memoryTip: '一条人声在前，低音和声在后。', source: 'offline',
  },
  {
    id: 'l01-seconda-pratica', levelId: 1, era: 'early-baroque', difficulty: 1,
    prompt: '蒙特威尔第所说的“第二实践”更强调什么？',
    options: ['音乐服从歌词情感表达', '严格禁止不协和音', '所有作品必须纯器乐化'], correctIndex: 0,
    explanation: '第二实践允许作曲家为了突出歌词与情感而更自由地处理不协和音。它与更强调传统对位规范的第一实践形成对照。',
    memoryTip: '第二实践让规则为文字的情感让路。', source: 'offline',
  },
  {
    id: 'l01-orfeo-premiere', levelId: 1, era: 'early-baroque', difficulty: 1,
    prompt: '《奥菲欧》于1607年首次上演的意大利城市是哪一座？',
    options: ['曼图亚', '威尼斯', '那不勒斯'], correctIndex: 0,
    explanation: '《奥菲欧》为曼图亚的宫廷环境而作，并于1607年在那里首演。威尼斯后来成为公共歌剧院蓬勃发展的重要中心。',
    memoryTip: '1607年的奥菲欧先在曼图亚歌唱。', source: 'offline',
  },
  {
    id: 'l01-recitative', levelId: 1, era: 'early-baroque', difficulty: 1,
    prompt: '早期歌剧中的“宣叙调”主要用于什么？',
    options: ['模仿说话节奏并推动剧情', '展示固定舞步', '让乐队停止演奏'], correctIndex: 0,
    explanation: '宣叙调接近日常语言的节奏与重音，适合快速传达对白和推进剧情。它通常与更抒情、更封闭的咏叹性段落形成对比。',
    memoryTip: '宣叙调像带着音高说话。', source: 'offline',
  },
] satisfies readonly Question[];
