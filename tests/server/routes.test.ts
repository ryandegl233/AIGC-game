import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../../src/server/app';
import { DeepSeekError, type DeepSeekService } from '../../src/server/deepseek-client';

const question = {
  id: 'ai-l1-route', levelId: 1, era: 'early-baroque', difficulty: 1,
  prompt: '哪位作曲家创作了早期歌剧《奥菲欧》？',
  options: ['蒙特威尔第', '维瓦尔第', '亨德尔'] as [string, string, string], correctIndex: 0,
  explanation: '《奥菲欧》是蒙特威尔第在1607年首演的早期歌剧代表作。',
  memoryTip: '奥菲欧属于蒙特威尔第。', source: 'ai' as const,
};

describe('DeepSeek API routes', () => {
  it('returns a generated question', async () => {
    const service: DeepSeekService = {
      generateQuestion: async () => question,
      analyzeAnswer: async () => ({
        correctAnswer: '蒙特威尔第', reason: '他创作了《奥菲欧》。',
        misconception: '维瓦尔第活跃于更晚的巴洛克时期。',
        context: '作品于1607年在曼图亚首演。', memoryTip: '奥菲欧属于蒙特威尔第。',
      }),
    };

    const response = await request(createApp({ deepSeekService: service }))
      .post('/api/questions/generate')
      .send({ levelId: 1, era: 'early-baroque', difficulty: 1, excludedPrompts: [] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, data: question });
  });

  it('returns 400 for malformed client input', async () => {
    const response = await request(createApp())
      .post('/api/questions/generate')
      .send({ levelId: 99 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ ok: false, error: 'invalid_request' });
  });

  it('returns an intentional fallback response for a timeout', async () => {
    const service: DeepSeekService = {
      generateQuestion: async () => { throw new DeepSeekError('timeout'); },
      analyzeAnswer: async () => { throw new DeepSeekError('timeout'); },
    };

    const response = await request(createApp({ deepSeekService: service }))
      .post('/api/questions/generate')
      .send({ levelId: 1, era: 'early-baroque', difficulty: 1, excludedPrompts: [] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: false, fallback: true, reason: 'timeout' });
  });

  it('does not leak upstream errors or secrets', async () => {
    const service: DeepSeekService = {
      generateQuestion: async () => { throw new Error('Bearer secret-key upstream exploded'); },
      analyzeAnswer: async () => { throw new Error('Bearer secret-key upstream exploded'); },
    };

    const response = await request(createApp({ deepSeekService: service }))
      .post('/api/questions/generate')
      .send({ levelId: 1, era: 'early-baroque', difficulty: 1, excludedPrompts: [] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: false, fallback: true, reason: 'upstream_error' });
    expect(response.text).not.toContain('secret-key');
  });
});
