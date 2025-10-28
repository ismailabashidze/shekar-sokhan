interface ReleaseNote {
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

export const useReleaseNotes = async () => {
  const { data, error } = await useFetch<ReleaseNote[]>('/api/releases', {
    default: () => [],
  });

  if (error.value) {
    console.error('Failed to load release notes', error.value);
  }

  const releases = computed(() => data.value ?? []);
  const latestRelease = computed(() => releases.value[0] ?? null);

  return {
    releases,
    latestRelease,
    error,
  };
};
