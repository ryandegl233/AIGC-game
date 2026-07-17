import type { Question } from '../../../shared/question-schema';

export const level09Questions = [
  {
    id: 'l09-brahms-symphonies', levelId: 9, era: 'late-romantic', difficulty: 9,
    prompt: '勃拉姆斯完成了多少部编号交响曲？',
    options: ['四部', '九部', '十二部'], correctIndex: 0,
    explanation: '勃拉姆斯完成了四部编号交响曲。他在贝多芬传统压力下谨慎进入这一体裁，并以严密结构和动机发展延续古典传统。',
    memoryTip: '勃拉姆斯的交响曲数量是四。', source: 'offline',
  },
  {
    id: 'l09-swan-lake', levelId: 9, era: 'late-romantic', difficulty: 9,
    prompt: '芭蕾舞剧《天鹅湖》的作曲家是谁？',
    options: ['彼得·伊里奇·柴可夫斯基', '安东宁·德沃夏克', '古斯塔夫·马勒'], correctIndex: 0,
    explanation: '《天鹅湖》是柴可夫斯基三部著名芭蕾舞剧之一，另外两部是《睡美人》和《胡桃夹子》。他的芭蕾音乐具有鲜明交响性与旋律表现力。',
    memoryTip: '柴可夫斯基让天鹅、睡美人与胡桃夹子起舞。', source: 'offline',
  },
  {
    id: 'l09-new-world', levelId: 9, era: 'late-romantic', difficulty: 9,
    prompt: '《自新大陆》交响曲是哪位作曲家的作品？',
    options: ['安东宁·德沃夏克', '约翰内斯·勃拉姆斯', '理查·施特劳斯'], correctIndex: 0,
    explanation: '德沃夏克在美国任职期间创作第九交响曲《自新大陆》。作品结合他对美国音乐材料的感受与自身捷克音乐语言。',
    memoryTip: '德沃夏克从捷克来到“新大陆”。', source: 'offline',
  },
  {
    id: 'l09-mahler-scale', levelId: 9, era: 'late-romantic', difficulty: 9,
    prompt: '马勒交响曲常以哪种特征著称？',
    options: ['庞大编制与包容多样声音世界', '只为独奏羽管键琴创作', '严格限制为两分钟以内'], correctIndex: 0,
    explanation: '马勒的交响曲常使用庞大乐队，有时加入声乐，并容纳民歌、进行曲、自然声音和深刻哲思。他把交响曲理解为能够包容一个世界的体裁。',
    memoryTip: '马勒的交响曲试图容纳整个世界。', source: 'offline',
  },
  {
    id: 'l09-also-sprach-zarathustra', levelId: 9, era: 'late-romantic', difficulty: 9,
    prompt: '交响诗《查拉图斯特拉如是说》的作曲家是谁？',
    options: ['理查·施特劳斯', '约翰·施特劳斯二世', '弗朗茨·舒伯特'], correctIndex: 0,
    explanation: '《查拉图斯特拉如是说》是理查·施特劳斯根据尼采思想创作的交响诗。不要把他与“圆舞曲之王”约翰·施特劳斯二世混淆。',
    memoryTip: '写交响诗的是理查，写蓝色多瑙河的是约翰二世。', source: 'offline',
  },
  {
    id: 'l09-national-schools', levelId: 9, era: 'late-romantic', difficulty: 9,
    prompt: '十九世纪民族乐派作曲家常如何建立民族风格？',
    options: ['吸收本民族舞曲、民歌、传说或语言节奏', '统一模仿同一首意大利歌剧', '完全禁止使用地方题材'], correctIndex: 0,
    explanation: '民族乐派作曲家常从民歌、舞曲、历史传说、语言节奏和地方景观中寻找材料，再用专业作曲技法加以重塑。不同国家的实践并不完全相同。',
    memoryTip: '民族风格把地方的声音带进音乐厅。', source: 'offline',
  },
] satisfies readonly Question[];
