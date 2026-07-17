import express, { type Express } from 'express';
import path from 'node:path';

import { loadConfig } from './config';
import { createDeepSeekClient, type DeepSeekService } from './deepseek-client';
import { createApiRouter } from './routes';

interface AppDependencies {
  deepSeekService?: DeepSeekService;
}

export function createApp(dependencies: AppDependencies = {}): Express {
  const config = loadConfig();
  const deepSeekService = dependencies.deepSeekService ?? createDeepSeekClient({
    apiKey: config.deepseekApiKey,
    model: config.deepseekModel,
  });
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));
  app.get('/api/health', (_request, response) => {
    response.json({ ok: true, aiConfigured: Boolean(config.deepseekApiKey) });
  });
  app.use('/api', createApiRouter(deepSeekService));
  app.use(express.static(path.resolve(process.cwd(), 'dist')));

  return app;
}
