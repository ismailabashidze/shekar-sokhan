// therapist.ts
export type Therapist = {
  name: string
  specialty: string
  shortDescription?: string
  longDescription?: string
  definingTraits?: string
  backStory?: string
  personality?: string
  appearance?: string
  approach?: string
  expertise?: string
  avatar?: File
  isActive?: boolean
}

export interface TherapistGenerateInput {
  name: string
  specialty: string
  shortDescription: string
}

export interface TherapistGenerateOutput {
  longDescription: string
  definingTraits: string
  backStory: string
  personality: string
  appearance: string
  approach: string
  expertise: string
}

export function useTherapist() {
  const nuxtApp = useNuxtApp()

  const getTherapists = async () => {
    return await nuxtApp.$pb.collection('therapists').getFullList({
      sort: '-created',
    })
  }

  const createNewTherapist = async (t: Therapist | FormData) => {
    return await nuxtApp.$pb.collection('therapists').create(t)
  }

  const updateTherapist = async (id: string, t: Therapist | FormData) => {
    return await nuxtApp.$pb.collection('therapists').update(id, t)
  }

  return {
    getTherapists,
    createNewTherapist,
    updateTherapist,
  }
}
