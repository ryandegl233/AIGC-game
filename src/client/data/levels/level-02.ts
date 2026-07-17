import type { Question } from '../../../shared/question-schema';

export const level02Questions = [
  {
    id: 'l02-four-seasons', levelId: 2, era: 'italian-baroque', difficulty: 2,
    prompt: '小提琴协奏曲集《四季》的作曲家是谁？',
    options: ['安东尼奥·维瓦尔第', '阿尔坎杰罗·科雷利', '多梅尼科·斯卡拉蒂'], correctIndex: 0,
    explanation: '《四季》是维瓦尔第最著名的四首小提琴协奏曲，每首对应一个季节并附有相关十四行诗。音乐以鲜明的器乐描写呈现自然景象。',
    memoryTip: '红发神父维瓦尔第，让四季在小提琴上轮转。', source: 'offline',
  },
  {
    id: 'l02-corelli-genres', levelId: 2, era: 'italian-baroque', difficulty: 2,
    prompt: '科雷利对哪一组巴洛克器乐体裁影响尤其重要？',
    options: ['三重奏鸣曲与大协奏曲', '交响诗与艺术歌曲', '钢琴夜曲与叙事曲'], correctIndex: 0,
    explanation: '科雷利的三重奏鸣曲、独奏奏鸣曲和大协奏曲成为后世的重要范本。他的弦乐写作对意大利及欧洲器乐风格影响深远。',
    memoryTip: '科雷利把弦乐合奏的道路修得又直又稳。', source: 'offline',
  },
  {
    id: 'l02-concerto-grosso', levelId: 2, era: 'italian-baroque', difficulty: 2,
    prompt: '大协奏曲（concerto grosso）的核心对比是什么？',
    options: ['小独奏组与大合奏组', '男高音与女高音', '钢琴左手与右手'], correctIndex: 0,
    explanation: '大协奏曲让小型独奏组 concertino 与较大的合奏组 ripieno 形成对话和对比。这种编制区别于突出单一独奏者的独奏协奏曲。',
    memoryTip: '小组 concertino 对话大组 ripieno。', source: 'offline',
  },
  {
    id: 'l02-solo-concerto', levelId: 2, era: 'italian-baroque', difficulty: 2,
    prompt: '巴洛克独奏协奏曲通常突出怎样的关系？',
    options: ['一位独奏者与乐队的对比', '两个合唱团完全齐唱', '没有任何伴奏的独唱'], correctIndex: 0,
    explanation: '独奏协奏曲围绕一位独奏者与乐队之间的交替、竞争和呼应展开。维瓦尔第推动了这一体裁及其快慢快三乐章布局的发展。',
    memoryTip: '一位独奏者站在乐队之前展开对话。', source: 'offline',
  },
  {
    id: 'l02-ritornello', levelId: 2, era: 'italian-baroque', difficulty: 2,
    prompt: '协奏曲中的“利托奈罗”通常指什么？',
    options: ['反复回归的乐队段落', '只出现一次的华彩段', '没有节奏的朗诵'], correctIndex: 0,
    explanation: '利托奈罗是反复回归的乐队段落，常与独奏段落交替出现。每次回归可以缩短、转调或改变，从而既统一乐章又推动调性进程。',
    memoryTip: 'ritornello 的关键词是“回来”。', source: 'offline',
  },
  {
    id: 'l02-ospedale-pieta', levelId: 2, era: 'italian-baroque', difficulty: 2,
    prompt: '维瓦尔第长期任教并创作大量协奏曲的机构是？',
    options: ['威尼斯慈善院皮耶塔', '莱比锡圣托马斯学校', '维也纳宫廷歌剧院'], correctIndex: 0,
    explanation: '维瓦尔第长期与威尼斯的皮耶塔慈善院合作，为其中技术出色的女子乐团教学并创作。这个环境促进了他大量器乐协奏曲的产生。',
    memoryTip: '威尼斯的皮耶塔，孕育维瓦尔第的协奏曲。', source: 'offline',
  },
] satisfies readonly Question[];
