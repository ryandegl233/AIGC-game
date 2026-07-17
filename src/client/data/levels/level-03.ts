import type { Question } from '../../../shared/question-schema';

export const level03Questions = [
  {
    id: 'l03-well-tempered-clavier', levelId: 3, era: 'high-baroque', difficulty: 3,
    prompt: '《平均律键盘曲集》的作曲家是谁？',
    options: ['约翰·塞巴斯蒂安·巴赫', '乔治·弗里德里克·亨德尔', '让-菲利普·拉莫'], correctIndex: 0,
    explanation: '巴赫的《平均律键盘曲集》由两卷前奏曲与赋格组成，每卷遍历二十四个大小调。它集中展示了键盘写作、调性组织与复调技巧。',
    memoryTip: '二十四个大小调，两卷巴赫的键盘宇宙。', source: 'offline',
  },
  {
    id: 'l03-messiah', levelId: 3, era: 'high-baroque', difficulty: 3,
    prompt: '清唱剧《弥赛亚》的作曲家是谁？',
    options: ['乔治·弗里德里克·亨德尔', '约翰·塞巴斯蒂安·巴赫', '亨利·珀塞尔'], correctIndex: 0,
    explanation: '亨德尔于1741年创作英语清唱剧《弥赛亚》。作品以独唱、合唱和乐队呈现宗教文本，其中“哈利路亚”合唱尤为著名。',
    memoryTip: '《弥赛亚》的哈利路亚属于亨德尔。', source: 'offline',
  },
  {
    id: 'l03-fugue-subject', levelId: 3, era: 'high-baroque', difficulty: 3,
    prompt: '赋格开始时首先陈述并在各声部模仿进入的核心材料称为什么？',
    options: ['主题', '尾声', '固定低音舞曲'], correctIndex: 0,
    explanation: '赋格围绕主题展开，主题先由一个声部陈述，随后其他声部按一定音程关系依次进入。插部和再现会继续发展这一核心材料。',
    memoryTip: '赋格的声部追逐同一个主题。', source: 'offline',
  },
  {
    id: 'l03-dance-suite', levelId: 3, era: 'high-baroque', difficulty: 3,
    prompt: '巴洛克器乐组曲通常由什么构成？',
    options: ['若干风格化舞曲乐章', '一首连续的歌剧咏叹调', '三段无节拍朗诵'], correctIndex: 0,
    explanation: '巴洛克组曲常把阿勒曼德、库朗特、萨拉班德和吉格等风格化舞曲组合在一起。各乐章通常保持同一调性，但速度、节拍和性格不同。',
    memoryTip: '组曲像一场由多种舞步组成的宴会。', source: 'offline',
  },
  {
    id: 'l03-oratorio-staging', levelId: 3, era: 'high-baroque', difficulty: 3,
    prompt: '清唱剧与歌剧相比，通常缺少哪一项？',
    options: ['完整的舞台表演与服装布景', '独唱与合唱', '乐队伴奏'], correctIndex: 0,
    explanation: '清唱剧和歌剧都可以使用独唱、合唱与乐队，但清唱剧通常以音乐会形式演出，不依赖完整舞台动作、服装和布景。其题材经常具有宗教性质。',
    memoryTip: '清唱剧有戏剧的声音，却通常没有戏剧的舞台。', source: 'offline',
  },
  {
    id: 'l03-bach-handel-careers', levelId: 3, era: 'high-baroque', difficulty: 3,
    prompt: '哪项最准确地区分巴赫与亨德尔的主要职业轨迹？',
    options: ['巴赫深耕德国教会与宫廷，亨德尔长期活跃于伦敦剧场', '两人都终身担任威尼斯小提琴教师', '两人都主要创作法国芭蕾'], correctIndex: 0,
    explanation: '巴赫的职业生涯主要在德国的宫廷、教会与学校展开，晚年任职莱比锡。亨德尔出生于德国，却在伦敦建立歌剧和清唱剧事业。',
    memoryTip: '巴赫在莱比锡，亨德尔在伦敦。', source: 'offline',
  },
] satisfies readonly Question[];
