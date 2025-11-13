import { promises as fs } from 'fs';
import { resolve } from 'path';

interface ReleaseEntry {
	version: string;
	releaseDate: string;
	product?:
	  | {
				codename?: string;
				summary?: string;
				highlights?: string[];
		  }
		  | string;
	technical?:
	  | {
				changes?: string[];
				fixes?: string[];
		  }
		  | string;
	rollout?:
	  | {
				announcement?: string;
				checks?: string[];
		  }
		  | string[];
}

interface NormalizedReleaseEntry {
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

let cached: NormalizedReleaseEntry[] | null = null;

const dataPath = resolve(process.cwd(), '../prd/releases.json');

// Normalize release entries to handle both string and object formats
const normalizeRelease = (release: ReleaseEntry): NormalizedReleaseEntry => {
	const normalized: NormalizedReleaseEntry = {
		version: release.version,
		releaseDate: release.releaseDate,
	};

	// Handle product field
	if (typeof release.product === 'string') {
		normalized.product = { summary: release.product };
	}
 else if (release.product) {
		normalized.product = release.product;
	}

	// Handle technical field
	if (typeof release.technical === 'string') {
		normalized.technical = { changes: [release.technical] };
	}
 else if (release.technical) {
		normalized.technical = release.technical;
	}

	// Handle rollout field
	if (Array.isArray(release.rollout)) {
		normalized.rollout = { checks: release.rollout };
	}
 else if (release.rollout) {
		normalized.rollout = release.rollout;
	}

	return normalized;
};

export default defineEventHandler(async () => {
	try {
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

		// Normalize all releases to handle both formats
		cached = releases.map(normalizeRelease);
		return cached;
	}
 catch (error) {
		console.error('Error reading releases data:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to load release notes',
		});
	}
});
