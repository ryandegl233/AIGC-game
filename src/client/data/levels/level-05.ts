import type { Question } from '../../../shared/question-schema';

export const level05Questions = [
  {
    id: 'l05-figaro', levelId: 5, era: 'viennese-classical', difficulty: 5,
    prompt: '歌剧《费加罗的婚礼》的作曲家是谁？',
    options: ['沃尔夫冈·阿马德乌斯·莫扎特', '约瑟夫·海顿', '路德维希·凡·贝多芬'], correctIndex: 0,
    explanation: '莫扎特与脚本作家达·蓬特合作完成《费加罗的婚礼》，1786年在维也纳首演。作品以复杂重唱和鲜明人物刻画推动喜剧冲突。',
    memoryTip: '费加罗的婚礼由莫扎特奏响。', source: 'offline',
  },
  {
    id: 'l05-opera-buffa', levelId: 5, era: 'viennese-classical', difficulty: 5,
    prompt: '意大利语“opera buffa”通常指哪种歌剧？',
    options: ['喜歌剧', '严肃歌剧', '无声舞剧'], correctIndex: 0,
    explanation: 'Opera buffa 指意大利喜歌剧，人物常来自日常生活，情节富于机智和社会讽刺。它与以英雄、神话题材为主的 opera seria 形成对照。',
    memoryTip: 'buffa 听起来活泼，记作喜歌剧。', source: 'offline',
  },
  {
    id: 'l05-piano-concerto', levelId: 5, era: 'viennese-classical', difficulty: 5,
    prompt: '古典时期钢琴协奏曲最核心的表演关系是什么？',
    options: ['钢琴独奏与管弦乐队对话', '两支合唱团无伴奏对唱', '弦乐四重奏内部齐奏'], correctIndex: 0,
    explanation: '钢琴协奏曲让独奏钢琴与管弦乐队交替、对话并共同发展主题。莫扎特在维也纳创作的协奏曲尤其丰富了这种戏剧性关系。',
    memoryTip: '协奏不是钢琴独白，而是钢琴与乐队对话。', source: 'offline',
  },
  {
    id: 'l05-not-mozart-opera', levelId: 5, era: 'viennese-classical', difficulty: 5,
    prompt: '以下哪一部歌剧不是莫扎特创作的？',
    options: ['《费德里奥》', '《唐璜》', '《魔笛》'], correctIndex: 0,
    explanation: '《费德里奥》是贝多芬唯一完成的歌剧。《唐璜》和《魔笛》均为莫扎特晚期重要舞台作品。',
    memoryTip: '贝多芬只有一部完成歌剧：《费德里奥》。', source: 'offline',
  },
  {
    id: 'l05-mozart-ensembles', levelId: 5, era: 'viennese-classical', difficulty: 5,
    prompt: '莫扎特歌剧中的重唱段落常具有什么戏剧功能？',
    options: ['让多个人物同时表达不同立场并推进冲突', '停止剧情只展示舞步', '让所有角色永远唱同一旋律'], correctIndex: 0,
    explanation: '莫扎特善于在二重唱、三重唱和大型终曲中让多个角色同时表达不同情绪与意图。音乐结构因此直接服务于人物关系和戏剧推进。',
    memoryTip: '多人同时唱，戏剧矛盾同时生长。', source: 'offline',
  },
  {
    id: 'l05-viennese-school', levelId: 5, era: 'viennese-classical', difficulty: 5,
    prompt: '哪一组最常被视为维也纳古典乐派的核心作曲家？',
    options: ['海顿、莫扎特、贝多芬', '巴赫、亨德尔、维瓦尔第', '肖邦、李斯特、瓦格纳'], correctIndex: 0,
    explanation: '海顿、莫扎特和贝多芬通常被视为维也纳古典乐派的核心人物。他们在交响曲、奏鸣曲、四重奏与协奏曲等体裁上建立并扩展古典范式。',
    memoryTip: '维也纳古典三人组：海顿、莫扎特、贝多芬。', source: 'offline',
  },
] satisfies readonly Question[];
