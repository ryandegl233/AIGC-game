import type { FallbackReason } from '../shared/api-contract';
import { DeepSeekError } from './deepseek-client';

export function toFallbackReason(error: unknown): FallbackReason {
  return error instanceof DeepSeekError ? error.reason : 'upstream_error';
}
