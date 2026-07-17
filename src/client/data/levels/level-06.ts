import type { Question } from '../../../shared/question-schema';

export const level06Questions = [
  {
    id: 'l06-eroica-number', levelId: 6, era: 'classical-romantic-transition', difficulty: 6,
    prompt: '贝多芬的《英雄交响曲》是他的第几交响曲？',
    options: ['第三交响曲', '第五交响曲', '第九交响曲'], correctIndex: 0,
    explanation: '《英雄交响曲》即降E大调第三交响曲，作品以显著扩大的篇幅和强烈的发展动力标志着贝多芬“英雄时期”的成熟。',
    memoryTip: '第三交响曲打开英雄时期的大门。', source: 'offline',
  },
  {
    id: 'l06-ninth-chorus', levelId: 6, era: 'classical-romantic-transition', difficulty: 6,
    prompt: '贝多芬第九交响曲末乐章最具突破性的做法是什么？',
    options: ['加入独唱与合唱', '完全取消弦乐器', '只使用一架钢琴'], correctIndex: 0,
    explanation: '第九交响曲末乐章引入独唱者与合唱团，演唱席勒《欢乐颂》的文本。这在大型交响曲传统中具有开创性影响。',
    memoryTip: '第九交响曲让交响乐开口歌唱。', source: 'offline',
  },
  {
    id: 'l06-fifth-motif', levelId: 6, era: 'classical-romantic-transition', difficulty: 6,
    prompt: '贝多芬第五交响曲开头的四音动机体现了什么写作特点？',
    options: ['从短小动机持续发展大型结构', '每个乐章完全不用重复材料', '只依赖即兴装饰音'], correctIndex: 0,
    explanation: '第五交响曲以极短的节奏动机建立强烈辨识度，并在不同声部、调性和结构层次中持续发展。它展示了贝多芬高度集中的动机写作。',
    memoryTip: '短短四音，推动整座交响建筑。', source: 'offline',
  },
  {
    id: 'l06-heroic-period', levelId: 6, era: 'classical-romantic-transition', difficulty: 6,
    prompt: '贝多芬中期“英雄风格”常表现出哪种特征？',
    options: ['扩大的形式与强烈戏剧冲突', '回到单纯文艺复兴无伴奏合唱', '放弃主题发展'], correctIndex: 0,
    explanation: '贝多芬中期作品常扩大篇幅、强化动机发展、动态对比和戏剧冲突。第三、第五交响曲与《热情》奏鸣曲都是常见例证。',
    memoryTip: '英雄风格把古典形式的边界向外推。', source: 'offline',
  },
  {
    id: 'l06-transition-role', levelId: 6, era: 'classical-romantic-transition', difficulty: 6,
    prompt: '为什么贝多芬常被视为连接古典主义与浪漫主义的人物？',
    options: ['他继承古典形式并显著扩大个人表达与结构张力', '他只写中世纪圣咏', '他拒绝使用奏鸣曲和交响曲'], correctIndex: 0,
    explanation: '贝多芬以海顿、莫扎特发展出的古典体裁为基础，却显著扩大作品规模、动态范围和主体性表达。后来的浪漫主义作曲家从这种突破中获得重要启发。',
    memoryTip: '贝多芬一脚站在古典形式，一脚迈向浪漫表达。', source: 'offline',
  },
  {
    id: 'l06-late-quartets', levelId: 6, era: 'classical-romantic-transition', difficulty: 6,
    prompt: '贝多芬晚期弦乐四重奏通常以什么特点著称？',
    options: ['结构大胆、表达内省且对位复杂', '全部是轻松舞会音乐', '只保留一个乐章和一条旋律'], correctIndex: 0,
    explanation: '贝多芬晚期四重奏常突破常规乐章布局，结合复杂对位、遥远调性关系与深刻内省表达。它们对后世室内乐产生了持久影响。',
    memoryTip: '晚期四重奏把向外的英雄转为向内的探索。', source: 'offline',
  },
] satisfies readonly Question[];
