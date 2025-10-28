import { promises as fs } from 'fs';
import { resolve } from 'path';

interface ReleaseEntry {
  version: string;
  releaseDate: string;
  product?: {
    codename?: string;
    summary?: string;
    highlights?: string[];
  };
  technical?: {
    changes?: string[];
    fixes?: string[];
  };
  rollout?: {
    announcement?: string;
    checks?: string[];
  };
}

let cached: ReleaseEntry[] | null = null;

const dataPath = resolve(process.cwd(), '../prd/releases.json');

export default defineEventHandler(async () => {
  if (cached && process.env.NODE_ENV === 'production') {
    return cached;
  }

  const raw = await fs.readFile(dataPath, 'utf-8');
  const releases = JSON.parse(raw) as ReleaseEntry[];

  if (!Array.isArray(releases)) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid release data format',
    });
  }

  cached = releases;
  return releases;
});
