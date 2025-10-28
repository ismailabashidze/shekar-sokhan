// therapist.ts
export type Therapist = {
  name: string;
  specialty: string;
  shortDescription?: string;
  longDescription?: string;
  definingTraits?: string;
  backStory?: string;
  personality?: string;
  appearance?: string;
  approach?: string;
  expertise?: string;
  avatar?: File;
  isActive?: boolean;
};

import type { TherapistGenerateInput, TherapistGenerateOutput } from '~/types';

export function useTherapist() {
  const nuxtApp = useNuxtApp();

  const getTherapists = async () => {
    return await nuxtApp.$pb.collection('therapists').getFullList({
      sort: '-created',
    });
  };

  const getTherapist = async (id: string) => {
    return await nuxtApp.$pb.collection('therapists').getOne(id);
  };

  const createNewTherapist = async (t: Therapist | FormData) => {
    return await nuxtApp.$pb.collection('therapists').create(t);
  };

  const updateTherapist = async (id: string, t: Therapist | FormData) => {
    return await nuxtApp.$pb.collection('therapists').update(id, t);
  };

  return {
    getTherapists,
    getTherapist,
    createNewTherapist,
    updateTherapist,
  };
}
