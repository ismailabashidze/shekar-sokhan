export type SelectedTherapicGoals = {
  user: string
  currentDivision: number
  generalTherapicGoal: string
  progress: 'not started' | 'initialized' | 'in progress' | 'completed' | 'closed'
  title: string
  shortDescription: string
  description: string
  generalPriority: number
  values: string[]
  titleFa: string
  shortDescriptionFa: string
  descriptionFa: string
  valuesFa: string[]
}

export function useGoal() {
  const goals = ref([])
  const nuxtApp = useNuxtApp()
  const toaster = useToaster()
  const { user } = useUser()
  const getGoals = async () => {
    const { items } = await nuxtApp.$pb.collection('SelectedTherapicGoals').getList(1, 500, {
      filter: 'currentDivision=' + user.value.record.currentDeletionDivider + ` && user.id = "${user.value.record.id}"`,
      sort: '+created',
      expand: 'generalTherapicGoal',
    })
    goals.value = items
    return items
  }

  return {
    goals,
    getGoals,
  }
}
