import { AsyncLocalStorage } from 'async_hooks';

export const tracer = new AsyncLocalStorage<Map<string, any>>();

export function getTracer() {
  return tracer.getStore();
}
