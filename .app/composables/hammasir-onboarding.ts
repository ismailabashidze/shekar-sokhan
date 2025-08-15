export interface RoadmapTemplate {
  id?: string
  name?: string
  description?: string
  version?: string
  stages?: TemplateStage[]
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface TemplateStage {
  id?: string
  name?: string
  description?: string
  order?: number
  estimatedDuration?: number
  tasks?: TemplateTask[]
}

export interface TemplateTask {
  id?: string
  name?: string
  description?: string
  order?: number
  taskType?: 'ASSESSMENT' | 'EDUCATION' | 'COUNSELING' | 'MILESTONE' | 'CUSTOM'
  estimatedDuration?: number
  prerequisites?: string[]
}

export interface UserRoadmap {
  id?: string
  userId?: string
  templateId?: string
  stages?: UserStage[]
  overallProgress?: number
  currentStageId?: string
  status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED'
  createdAt?: string
  updatedAt?: string
}

export interface UserStage {
  id?: string
  templateStageId?: string
  name?: string
  description?: string
  order?: number
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'
  progress?: number
  tasks?: UserTask[]
  startedAt?: string
  completedAt?: string
}

export interface UserTask {
  id?: string
  templateTaskId?: string
  name?: string
  description?: string
  order?: number
  taskType?: 'ASSESSMENT' | 'EDUCATION' | 'COUNSELING' | 'MILESTONE' | 'CUSTOM'
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'
  progress?: number
  startedAt?: string
  completedAt?: string
}

export interface JourneyView {
  userId?: string
  overallProgress?: number
  currentStage?: UserStage
  upcomingTasks?: UserTask[]
  recentCompletions?: UserTask[]
  milestones?: Milestone[]
  stats?: JourneyStats
}

export interface Milestone {
  id?: string
  name?: string
  description?: string
  achievedAt?: string
  type?: 'STAGE_COMPLETION' | 'TASK_MILESTONE' | 'CUSTOM'
}

export interface JourneyStats {
  totalTasks?: number
  completedTasks?: number
  totalStages?: number
  completedStages?: number
  daysActive?: number
  averageTaskDuration?: number
}

export interface CreateRoadmapRequest {
  templateId?: string
  customRoadmap?: UserRoadmap
}

export interface UpdateTaskRequest {
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'
  progress?: number
}

export function useHammasirOnboarding() {
  const { $fetch } = useNuxtApp()

  const getRoadmapTemplates = async (): Promise<RoadmapTemplate[]> => {
    return await $fetch('/api/v1/templates')
  }

  const createRoadmapTemplate = async (template: RoadmapTemplate): Promise<RoadmapTemplate> => {
    return await $fetch('/api/v1/templates', {
      method: 'POST',
      body: template
    })
  }

  const getRoadmapTemplateById = async (templateId: string): Promise<RoadmapTemplate> => {
    return await $fetch(`/api/v1/templates/${templateId}`)
  }

  const updateRoadmapTemplate = async (templateId: string, template: RoadmapTemplate): Promise<RoadmapTemplate> => {
    return await $fetch(`/api/v1/templates/${templateId}`, {
      method: 'PUT',
      body: template
    })
  }

  const deleteRoadmapTemplate = async (templateId: string): Promise<void> => {
    return await $fetch(`/api/v1/templates/${templateId}`, {
      method: 'DELETE'
    })
  }

  const getMyJourney = async (): Promise<JourneyView> => {
    return await $fetch('/api/v1/journey')
  }

  const updateJourneyTask = async (taskId: string, request: UpdateTaskRequest): Promise<void> => {
    return await $fetch(`/api/v1/journey/tasks/${taskId}`, {
      method: 'PATCH',
      body: request
    })
  }

  const createUserRoadmap = async (userId: string, request: CreateRoadmapRequest): Promise<UserRoadmap> => {
    return await $fetch(`/api/v1/users/${userId}/roadmap`, {
      method: 'POST',
      body: request
    })
  }

  const getUserRoadmap = async (userId: string): Promise<UserRoadmap> => {
    return await $fetch(`/api/v1/users/${userId}/roadmap`)
  }

  const updateUserRoadmap = async (userId: string, roadmap: UserRoadmap): Promise<UserRoadmap> => {
    return await $fetch(`/api/v1/users/${userId}/roadmap`, {
      method: 'PUT',
      body: roadmap
    })
  }

  const getRoadmaps = async (): Promise<UserRoadmap[]> => {
    return await $fetch('/api/v1/roadmaps')
  }

  return {
    getRoadmapTemplates,
    createRoadmapTemplate,
    getRoadmapTemplateById,
    updateRoadmapTemplate,
    deleteRoadmapTemplate,
    getMyJourney,
    updateJourneyTask,
    createUserRoadmap,
    getUserRoadmap,
    updateUserRoadmap,
    getRoadmaps,
  }
}