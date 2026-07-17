# 金色谱号：古典音乐闯关

一款将古典音乐史知识问答与二维跑酷结合的 HTML5 小游戏。玩家操控金色高音谱号，在限时关卡中跳上正确答案的平台。游戏从早期巴洛克延伸至晚期浪漫主义，共 9 关、每关 3 道题。

DeepSeek 负责动态出题和答案分析。没有 API Key、断网、请求超时或模型输出不合格时，游戏会自动使用内置的 54 道离线题和离线解析，仍可完整通关。

完整规则和操作方式见 [玩法说明](./玩法说明.md)。

## 环境要求

- Node.js 20 或更高版本
- npm 10 或更高版本
- 支持 WebGL 或 Canvas 的现代浏览器

## 安装与启动

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

浏览器访问 `http://127.0.0.1:5173`。开发模式会同时启动 Vite 前端和端口 `3001` 上的 Express 服务。

### 配置 DeepSeek

用文本编辑器打开项目根目录的 `.env`：

```dotenv
DEEPSEEK_API_KEY=你的密钥
DEEPSEEK_MODEL=deepseek-v4-flash
PORT=3001
```

`.env` 已被 Git 忽略。不要把 API Key 写入 `src/client`、`index.html`、截图、聊天记录或提交记录。

当前默认模型依据 2026 年 DeepSeek V4 API 设置为 `deepseek-v4-flash`。如后续模型名称变化，只需修改 `.env` 的 `DEEPSEEK_MODEL`，无需改动代码。

### 完全离线运行

不创建 `.env`，或让 `DEEPSEEK_API_KEY` 保持为空，然后执行：

```powershell
npm run dev
```

服务端会正常启动，前端自动显示离线题目和“离线乐谱档案”解析。

## 操作

- 左移：`A` 或 `←`
- 右移：`D` 或 `→`
- 跳跃：`W`、`↑` 或空格
- 暂停/继续：`Esc`
- 触屏：使用舞台下方的左、跳跃、右按钮

动态平台会先演示一个完整运动周期。预演完成后点击“开始跑酷”，倒计时才会启动。

## 九个关卡

1. 歌剧的黎明：蒙特威尔第、数字低音、单声歌曲与早期歌剧
2. 威尼斯的四季：维瓦尔第、科雷利、协奏曲与利托奈罗
3. 赋格与清唱剧：巴赫、亨德尔、赋格、组曲与清唱剧
4. 海顿的乐章：交响曲、弦乐四重奏与奏鸣曲式
5. 莫扎特的剧场：歌剧类型、钢琴协奏曲与古典均衡
6. 英雄的转调：贝多芬三个时期及古典至浪漫的转型
7. 诗人与夜曲：舒伯特、肖邦、舒曼与浪漫主义小品
8. 幻想交响与乐剧：柏辽兹、李斯特、瓦格纳与威尔第
9. 世纪末的交响迷宫：勃拉姆斯、柴可夫斯基、德沃夏克、马勒与理查·施特劳斯

## 测试与构建

```powershell
npm test
npm run typecheck
npm run lint
npm run build
npm run e2e
```

首次运行浏览器测试时需要安装 Chromium：

```powershell
npx playwright install chromium
```

生产构建输出到 `dist` 和 `dist-server`。构建完成后启动：

```powershell
npm start
```

然后访问 `http://127.0.0.1:3001`。

## API

- `POST /api/questions/generate`：按关卡、时代与难度生成三选一题目
- `POST /api/answers/analyze`：分析玩家选择并给出历史背景与记忆提示
- `GET /api/health`：返回服务状态及是否配置 AI

正确性判定、计分、生命值和关卡解锁全部在本地完成。AI 输出不会修改游戏判定。

## 常见问题

### 页面显示“离线乐谱档案”

这是正常降级状态。检查 `.env` 是否位于项目根目录、Key 是否有效，以及终端是否有网络连接。即使不处理，也能继续完整游玩。

### API Key 修改后没有生效

停止并重新执行 `npm run dev`。环境变量只在服务端启动时读取。

### 移动平台看起来太快

每关计时和平台周期写在 `src/client/game/level-config.ts`。平台预演期间不计时，玩家可以先观察完整规律。

## 安全说明

- API Key 只由 Node 服务读取。
- 前端只向同源 `/api` 发请求。
- 服务端不会把上游错误、Authorization 请求头或完整模型响应返回给浏览器。
- 交付前应搜索 `dist` 和 `src/client`，确认不存在密钥。
