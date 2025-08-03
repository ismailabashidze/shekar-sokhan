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

export type TherapyGoal = {
  id?: string
  session_id?: string
  user_id: string
  therapist_id: string
  goal_type: 'general' | 'specific' | 'diagnostic' | 'treatment'
  title: string
  description: string
  target_behaviors: string[]
  success_criteria: string[]
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'achieved'
  progress_percentage: number
  ai_evaluation: string
  notes: string
  target_date: string | null
  achieved_date: string | null
  sub_goals: SubGoal[]
  created?: string
  updated?: string
}

export type SubGoal = {
  id?: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  completed_date?: string
}

export function useGoal() {
  const goals = ref([])
  const nuxtApp = useNuxtApp()
  const toaster = useToaster()
  const { user } = useUser()
  
  const getGoals = async () => {
    const { items } = await nuxtApp.$pb.collection('SelectedTherapicGoals').getList(1, 500, {
      filter: 'currentDivision=' + user.value.currentDeletionDivider + ` && user.id = "${user.value.id}"`,
      sort: '+created',
      expand: 'generalTherapicGoal',
    })
    goals.value = items
    return items
  }

  const createTherapyGoal = async (goalData: Partial<TherapyGoal>) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    const goalRecord = {
      user_id: user.value.id,
      goals: {
        ...goalData,
        created: new Date().toISOString(),
        status: goalData.status || 'pending',
        progress_percentage: goalData.progress_percentage || 0
      }
    }

    try {
      return await nuxtApp.$pb.collection('goals_2').create(goalRecord)
    } catch (error) {
      console.error('Error creating therapy goal:', error)
      throw error
    }
  }

  const getTherapyGoals = async (sessionId?: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      let filter = `user_id = "${user.value.id}"`
      if (sessionId) {
        filter += ` && goals.session_id = "${sessionId}"`
      }

      const records = await nuxtApp.$pb.collection('goals_2').getFullList({
        filter,
        sort: '-created',
      })
      
      // Extract goals from the nested structure
      return records.map(record => ({
        id: record.id,
        ...record.goals,
        user_id: record.user_id
      }))
    } catch (error) {
      console.error('Error fetching therapy goals:', error)
      throw error
    }
  }

  const updateTherapyGoal = async (id: string, goalData: Partial<TherapyGoal>) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      // Get current record to preserve the nested structure
      const currentRecord = await nuxtApp.$pb.collection('goals_2').getOne(id)
      
      return await nuxtApp.$pb.collection('goals_2').update(id, {
        goals: {
          ...currentRecord.goals,
          ...goalData,
          updated: new Date().toISOString(),
        }
      })
    } catch (error) {
      console.error('Error updating therapy goal:', error)
      throw error
    }
  }

  const updateSubGoalStatus = async (goalId: string, subGoalIndex: number, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      const record = await nuxtApp.$pb.collection('goals_2').getOne(goalId)
      const subGoals = [...record.goals.sub_goals]
      
      subGoals[subGoalIndex] = {
        ...subGoals[subGoalIndex],
        status,
        completed_date: status === 'completed' ? new Date().toISOString() : undefined
      }

      // Calculate progress based on completed sub-goals
      const completedCount = subGoals.filter(sg => sg.status === 'completed').length
      const progress_percentage = subGoals.length > 0 ? Math.round((completedCount / subGoals.length) * 100) : 0

      return await updateTherapyGoal(goalId, {
        sub_goals: subGoals,
        progress_percentage,
        status: progress_percentage === 100 ? 'achieved' : 'in_progress'
      })
    } catch (error) {
      console.error('Error updating sub-goal status:', error)
      throw error
    }
  }

  return {
    goals,
    getGoals,
    createTherapyGoal,
    getTherapyGoals,
    updateTherapyGoal,
    updateSubGoalStatus,
  }
}
