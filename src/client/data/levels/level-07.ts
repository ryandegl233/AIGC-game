import type { Question } from '../../../shared/question-schema';

export const level07Questions = [
  {
    id: 'l07-erlkonig', levelId: 7, era: 'early-romantic', difficulty: 7,
    prompt: '艺术歌曲《魔王》（Erlkönig）的作曲家是谁？',
    options: ['弗朗茨·舒伯特', '弗雷德里克·肖邦', '罗伯特·舒曼'], correctIndex: 0,
    explanation: '舒伯特根据歌德诗歌创作《魔王》，由一位歌者表现叙述者、父亲、孩子和魔王等角色。钢琴急促的三连音营造奔马般的紧张感。',
    memoryTip: '舒伯特的钢琴像马蹄，载着《魔王》的故事飞奔。', source: 'offline',
  },
  {
    id: 'l07-lied', levelId: 7, era: 'early-romantic', difficulty: 7,
    prompt: '德语艺术歌曲 Lied 的典型编制是什么？',
    options: ['独唱与钢琴', '铜管五重奏', '无伴奏打击乐'], correctIndex: 0,
    explanation: '浪漫主义艺术歌曲通常由独唱者与钢琴共同诠释诗歌。钢琴不是被动伴奏，而会描绘环境、心理或诗歌中的象征。',
    memoryTip: 'Lied 是诗、人声与钢琴的三方对话。', source: 'offline',
  },
  {
    id: 'l07-chopin-nocturne', levelId: 7, era: 'early-romantic', difficulty: 7,
    prompt: '哪位作曲家以富于歌唱性的钢琴夜曲著称？',
    options: ['弗雷德里克·肖邦', '赫克托·柏辽兹', '朱塞佩·威尔第'], correctIndex: 0,
    explanation: '肖邦把夜曲发展成精致而富于歌唱性的钢琴体裁，常见装饰性的旋律和流动伴奏。他几乎把创作中心全部放在钢琴上。',
    memoryTip: '肖邦的夜曲，让钢琴在夜色中歌唱。', source: 'offline',
  },
  {
    id: 'l07-schumann-carnaval', levelId: 7, era: 'early-romantic', difficulty: 7,
    prompt: '舒曼的钢琴套曲《狂欢节》主要由什么构成？',
    options: ['一组短小的性格小品', '一部四幕意大利歌剧', '一套巴洛克大协奏曲'], correctIndex: 0,
    explanation: '《狂欢节》由一系列短小钢琴性格小品组成，各段描绘人物、面具或不同心理侧面。它体现了浪漫主义碎片化而富于想象的钢琴写作。',
    memoryTip: '《狂欢节》的每一首小品都是一张音乐面具。', source: 'offline',
  },
  {
    id: 'l07-song-cycle', levelId: 7, era: 'early-romantic', difficulty: 7,
    prompt: '“声乐套曲”与单独艺术歌曲相比，最重要的区别是什么？',
    options: ['多首歌曲由共同诗意或叙事线索连接', '必须由完整交响乐团演奏', '完全没有文字'], correctIndex: 0,
    explanation: '声乐套曲把多首歌曲按诗意、故事、人物或调性关系组织成整体。舒伯特的《冬之旅》和舒曼的《诗人之恋》都是代表。',
    memoryTip: '一首 Lied 是一页，声乐套曲是一册诗集。', source: 'offline',
  },
  {
    id: 'l07-romantic-miniature', levelId: 7, era: 'early-romantic', difficulty: 7,
    prompt: '早期浪漫主义钢琴小品为何受到重视？',
    options: ['短小形式能集中呈现个人情绪与诗意意象', '它们只能用于机械练习', '它们拒绝任何旋律表达'], correctIndex: 0,
    explanation: '浪漫主义作曲家常用夜曲、即兴曲、间奏曲和性格小品等短小形式捕捉瞬间情绪。有限篇幅反而适合高度凝练的个人表达。',
    memoryTip: '浪漫主义小品像一瞬被保存下来的情绪。', source: 'offline',
  },
] satisfies readonly Question[];
