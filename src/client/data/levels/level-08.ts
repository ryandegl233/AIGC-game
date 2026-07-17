import type { Question } from '../../../shared/question-schema';

export const level08Questions = [
  {
    id: 'l08-idee-fixe', levelId: 8, era: 'romantic-expansion', difficulty: 8,
    prompt: '柏辽兹《幻想交响曲》中的“固定乐思”主要代表什么？',
    options: ['贯穿各乐章的恋人形象', '每次演出固定不变的速度', '只在结尾出现的鼓点'], correctIndex: 0,
    explanation: '《幻想交响曲》的固定乐思是一条反复出现并不断变形的旋律，代表主人公心中的恋人。它在不同乐章随剧情和心理状态改变。',
    memoryTip: '固定乐思追随恋人形象穿过五个乐章。', source: 'offline',
  },
  {
    id: 'l08-symphonic-poem', levelId: 8, era: 'romantic-expansion', difficulty: 8,
    prompt: '“交响诗”这一单乐章标题音乐体裁主要由谁推动确立？',
    options: ['弗朗茨·李斯特', '约瑟夫·海顿', '安东尼奥·维瓦尔第'], correctIndex: 0,
    explanation: '李斯特以一系列管弦乐作品推动交响诗成为重要体裁。交响诗通常以单乐章形式表现文学、历史、绘画或哲学主题。',
    memoryTip: '李斯特把一首诗写进一整个管弦乐乐章。', source: 'offline',
  },
  {
    id: 'l08-leitmotif', levelId: 8, era: 'romantic-expansion', difficulty: 8,
    prompt: '瓦格纳乐剧中的“主导动机”通常用于什么？',
    options: ['联系人物、事物或观念并随剧情变化', '标记每场演出的票价', '让合唱团始终齐唱'], correctIndex: 0,
    explanation: '主导动机是与人物、物体、情感或观念相关的音乐材料。它会在乐剧中反复、组合和变形，帮助管弦乐参与叙事。',
    memoryTip: '听见动机，就像看见人物或观念再次出现。', source: 'offline',
  },
  {
    id: 'l08-verdi-opera', levelId: 8, era: 'romantic-expansion', difficulty: 8,
    prompt: '下列哪部歌剧由朱塞佩·威尔第创作？',
    options: ['《茶花女》', '《特里斯坦与伊索尔德》', '《费加罗的婚礼》'], correctIndex: 0,
    explanation: '《茶花女》是威尔第的重要意大利歌剧，1853年首演。《特里斯坦与伊索尔德》属于瓦格纳，《费加罗的婚礼》属于莫扎特。',
    memoryTip: '威尔第让《茶花女》在意大利歌剧舞台上歌唱。', source: 'offline',
  },
  {
    id: 'l08-program-music', levelId: 8, era: 'romantic-expansion', difficulty: 8,
    prompt: '“标题音乐”最准确的定义是什么？',
    options: ['与文学、故事、景象或观念等音乐外内容相关的器乐作品', '所有带作品编号的音乐', '只为舞蹈节拍而写的音乐'], correctIndex: 0,
    explanation: '标题音乐通过标题、文字说明或可辨认的叙事构想与音乐之外的内容发生联系。交响诗和《幻想交响曲》都是常见例子。',
    memoryTip: '标题音乐的标题为耳朵提供一幅画或一个故事。', source: 'offline',
  },
  {
    id: 'l08-new-german-school', levelId: 8, era: 'romantic-expansion', difficulty: 8,
    prompt: '与“新德意志乐派”关系最密切的是哪组作曲家？',
    options: ['李斯特与瓦格纳', '海顿与莫扎特', '科雷利与维瓦尔第'], correctIndex: 0,
    explanation: '李斯特与瓦格纳常被视为新德意志乐派的核心人物，他们推动标题音乐、乐剧和更大胆的和声语言。这一立场常与强调传统器乐形式的阵营相对照。',
    memoryTip: '新德意志乐派向交响诗与乐剧的未来推进。', source: 'offline',
  },
] satisfies readonly Question[];
