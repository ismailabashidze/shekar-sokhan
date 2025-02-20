// patient.ts
export type Patient = {
  name: string
  age: number
  shortDescription?: string
  longDescription?: string
  definingTraits?: string
  backStory?: string
  personality?: string
  appearance?: string
  motivation?: string
  moodAndCurrentEmotions?: string
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
