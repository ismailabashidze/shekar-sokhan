// patient.ts
export type Patient = {
  name: string
  nameFa?: string
  age: number
  shortDescription?: string
  shortDescriptionFa?: string
  longDescription?: string
  longDescriptionFa?: string
  definingTraits?: string
  definingTraitsFa?: string
  backStory?: string
  backStoryFa?: string
  personality?: string
  personalityFa?: string
  appearance?: string
  appearanceFa?: string
  motivation?: string
  motivationFa?: string
  moodAndCurrentEmotions?: string
  moodAndCurrentEmotionsFa?: string
  avatar?: File
  isActive?: boolean
}

export function usePatient() {
  const nuxtApp = useNuxtApp()

  const getPatients = async () => {
    return await nuxtApp.$pb.collection('patients').getFullList({
      sort: '-created',
    })
  }

  const createNewPatient = async (p: Patient | FormData) => {
    return await nuxtApp.$pb.collection('patients').create(p)
  }

  const updatePatient = async (id: string, p: Patient | FormData) => {
    return await nuxtApp.$pb.collection('patients').update(id, p)
  }

  return {
    getPatients,
    createNewPatient,
    updatePatient,
  }
}
