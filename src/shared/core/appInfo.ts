import { readFileSync } from 'fs';
import path from 'path';

type AppInfo = {
  name: string;
  version: string;
  description?: string;
  author?: string;
};

let cachedAppInfo: AppInfo;

export function getAppInfo(): AppInfo {
  if (cachedAppInfo) return cachedAppInfo;

  const pkgPath = path.resolve(__dirname, '../../../package.json');
  const raw = readFileSync(pkgPath, 'utf-8');
  const parsed = JSON.parse(raw);

  cachedAppInfo = {
    name: parsed.name,
    version: parsed.version,
    description: parsed.description,
    author: parsed.author,
  };

  return cachedAppInfo;
}
