import { describe, expect, it, vi } from 'vitest';

import {
  createDeepSeekClient,
  DeepSeekError,
  type FetchLike,
} from '../../src/server/deepseek-client';

const validQuestion = {
  id: 'ai-l1-1', levelId: 1, era: 'early-baroque', difficulty: 1,
  prompt: '哪位作曲家创作了早期歌剧《奥菲欧》？',
  options: ['蒙特威尔第', '维瓦尔第', '亨德尔'], correctIndex: 0,
  explanation: '《奥菲欧》是蒙特威尔第在1607年首演的早期歌剧代表作。',
  memoryTip: '奥菲欧属于蒙特威尔第。', source: 'ai',
};

function deepSeekResponse(content: string): Response {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

describe('DeepSeekClient', () => {
  it('returns a validated AI question and sends the DeepSeek chat request', async () => {
    const fetchImpl = vi.fn<FetchLike>().mockResolvedValue(
      deepSeekResponse(JSON.stringify(validQuestion)),
    );
    const client = createDeepSeekClient({ apiKey: 'secret-key', fetchImpl });

    const question = await client.generateQuestion({
      levelId: 1, era: 'early-baroque', difficulty: 1, excludedPrompts: [],
    });

    expect(question).toEqual(validQuestion);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0]?.[0]).toBe('https://api.deepseek.com/chat/completions');
    const init = fetchImpl.mock.calls[0]?.[1];
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer secret-key' });
    expect(JSON.parse(String(init?.body))).toMatchObject({ model: 'deepseek-v4-flash' });
  });

  it('retries once after invalid model output', async () => {
    const fetchImpl = vi.fn<FetchLike>()
      .mockResolvedValueOnce(deepSeekResponse('not json'))
      .mockResolvedValueOnce(deepSeekResponse(JSON.stringify(validQuestion)));
    const client = createDeepSeekClient({ apiKey: 'secret-key', fetchImpl });

    await expect(client.generateQuestion({
      levelId: 1, era: 'early-baroque', difficulty: 1, excludedPrompts: [],
    })).resolves.toEqual(validQuestion);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('reports invalid output after both attempts fail', async () => {
    const fetchImpl = vi
      .fn<FetchLike>()
      .mockImplementation(async () => deepSeekResponse('{}'));
    const client = createDeepSeekClient({ apiKey: 'secret-key', fetchImpl });

    await expect(client.generateQuestion({
      levelId: 1, era: 'early-baroque', difficulty: 1, excludedPrompts: [],
    })).rejects.toMatchObject({ reason: 'invalid_output' });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('maps an aborted request to timeout without exposing the key', async () => {
    const fetchImpl = vi.fn<FetchLike>().mockRejectedValue(
      new DOMException('The operation was aborted', 'AbortError'),
    );
    const client = createDeepSeekClient({ apiKey: 'secret-key', fetchImpl, maxAttempts: 1 });

    const error = await client.generateQuestion({
      levelId: 1, era: 'early-baroque', difficulty: 1, excludedPrompts: [],
    }).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(DeepSeekError);
    expect(error).toMatchObject({ reason: 'timeout' });
    expect(String(error)).not.toContain('secret-key');
  });

  it('reports missing_key without making a network request', async () => {
    const fetchImpl = vi.fn<FetchLike>();
    const client = createDeepSeekClient({ fetchImpl });

    await expect(client.generateQuestion({
      levelId: 1, era: 'early-baroque', difficulty: 1, excludedPrompts: [],
    })).rejects.toMatchObject({ reason: 'missing_key' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
