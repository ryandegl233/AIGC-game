import dotenv from 'dotenv';

dotenv.config();

export interface ServerConfig {
  port: number;
  deepseekApiKey?: string;
  deepseekModel: string;
}

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): ServerConfig {
  const parsedPort = Number(environment.PORT ?? 3001);
  return {
    port: Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3001,
    deepseekApiKey: environment.DEEPSEEK_API_KEY?.trim() || undefined,
    deepseekModel: environment.DEEPSEEK_MODEL?.trim() || 'deepseek-v4-flash',
  };
}
