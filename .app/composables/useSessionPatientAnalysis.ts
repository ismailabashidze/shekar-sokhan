import { useNuxtApp } from '#app'
import { ref } from 'vue'
import type {
  EmotionalJourney,
  PersonalGrowth,
  SessionProgress,
  SessionAnalysisForPatient,
} from '~/types'

// PocketBase specific interfaces (extend base types with DB fields)
export interface PBEmotionalJourney extends EmotionalJourney {
  id: string
  created: string
  updated: string
  expand?: any
}

export interface PBMainPoints {
  id: string
  session: string
  title: string
  description: string
  importance: 'high' | 'medium' | 'low'
  actionItems: string[]
  created: string
  updated: string
  expand?: any
}

export interface PBPersonalGrowth extends Omit<PersonalGrowth, 'insights' | 'achievements' | 'challenges' | 'recommendations'> {
  id: string
  insights: string[]
  learnings: string[]
  toolsAndTechniques: string[]
  created: string
  updated: string
  expand?: any
}

export interface PBSessionProgress extends Omit<SessionProgress, 'goals' | 'achievements' | 'challenges' | 'nextSteps'> {
  id: string
  strengthsIdentified: string[]
  areasForGrowth: string[]
  achievements: string[]
  nextSteps: string[]
  created: string
  updated: string
  expand?: any
}

export interface PBSessionAnalysisForPatient extends Omit<SessionAnalysisForPatient, 'emotionalJourney' | 'personalGrowth' | 'sessionProgress'> {
  id: string
  mainPoints: PBMainPoints[]
  sessionProgress: PBSessionProgress
  emotionalJourney: PBEmotionalJourney
  personalGrowth: PBPersonalGrowth
  therapeuticRelationship: string
  created: string
  updated: string
  expand?: any
}

export const useSessionPatientAnalysis = () => {
  const nuxtApp = useNuxtApp()
  const pb = nuxtApp.$pb
  const error = ref<string | null>(null)
  const processing = ref(false)

  const createAnalysis = async (data: Partial<PBSessionAnalysisForPatient>) => {
    try {
      return await pb.collection('session_analysis_for_patient').create(data)
    }
    catch (error: any) {
      console.error('Error creating session analysis for patient:', error)
      throw error
    }
  }

  const getAnalysisById = async (id: string) => {
    try {
      return await pb.collection('session_analysis_for_patient').getOne(id, {
        expand: 'session,mainPoints,sessionProgress,emotionalJourney,personalGrowth',
      })
    }
    catch (error: any) {
      console.error('Error getting session analysis for patient:', error)
      throw error
    }
  }

  const listAnalysis = async (filter = '', sort = '-created') => {
    try {
      return await pb.collection('session_analysis_for_patient').getList(1, 50, {
        filter,
        sort,
        expand: 'session,mainPoints,sessionProgress,emotionalJourney,personalGrowth',
      })
    }
    catch (error: any) {
      console.error('Error listing session analysis for patient:', error)
      throw error
    }
  }

  const updateAnalysis = async (id: string, data: Partial<PBSessionAnalysisForPatient>) => {
    try {
      return await pb.collection('session_analysis_for_patient').update(id, data)
    }
    catch (error: any) {
      console.error('Error updating session analysis for patient:', error)
      throw error
    }
  }

  const deleteAnalysis = async (id: string) => {
    try {
      return await pb.collection('session_analysis_for_patient').delete(id)
    }
    catch (error: any) {
      console.error('Error deleting session analysis for patient:', error)
      throw error
    }
  }

  const getAnalysisForSession = async (sessionId: string): Promise<PBSessionAnalysisForPatient | null> => {
    try {
      const records = await pb.collection('session_analysis_for_patient').getList(1, 1, {
        filter: `session="${sessionId}"`,
        sort: '-created',
        expand: 'session,mainPoints,sessionProgress,emotionalJourney,personalGrowth',
      })

      if (records.items.length > 0) {
        return records.items[0] as unknown as PBSessionAnalysisForPatient
      }
      return null
    }
    catch (error) {
      console.error('Error getting analysis for session:', error)
      return null
    }
  }

  const createEmotionalJourney = async (data: Partial<PBEmotionalJourney>) => {
    try {
      return await pb.collection('emotional_journey').create(data)
    }
    catch (error: any) {
      console.error('Error creating emotional journey:', error)
      throw error
    }
  }

  const createMainPoints = async (data: Partial<PBMainPoints>) => {
    try {
      return await pb.collection('main_points').create(data)
    }
    catch (error: any) {
      console.error('Error creating main points:', error)
      throw error
    }
  }

  const createPersonalGrowth = async (data: Partial<PBPersonalGrowth>) => {
    try {
      return await pb.collection('personal_growth').create(data)
    }
    catch (error: any) {
      console.error('Error creating personal growth:', error)
      throw error
    }
  }

  const createSessionProgress = async (data: Partial<PBSessionProgress>) => {
    try {
      return await pb.collection('session_progress').create(data)
    }
    catch (error: any) {
      console.error('Error creating session progress:', error)
      throw error
    }
  }

  const generateAnalysis = async ({ sessionId, messages }: { sessionId: string, messages: any[] }) => {
    processing.value = true
    error.value = null

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'Session Analysis Generator For Patient',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا با بررسی پیام‌های جلسه، تحلیل جامعی از وضعیت مراجع برای خودش ارائه دهید.',
            },
            {
              role: 'user',
              content: `لطفا پیام‌های زیر را تحلیل کنید:
${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`,
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              type: 'object',
              properties: {
                emotionalJourney: {
                  type: 'object',
                  properties: {
                    emojis: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    overallMood: {
                      type: 'string',
                      enum: ['very_good', 'good', 'neutral', 'challe'],
                    },
                    moodDescription: { type: 'string' },
                    keyEmotions: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    copingStrategies: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                  required: ['emojis', 'overallMood', 'moodDescription', 'keyEmotions', 'copingStrategies'],
                },
                mainPoints: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' },
                      importance: {
                        type: 'string',
                        enum: ['high', 'medium', 'low'],
                      },
                      actionItems: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                    },
                    required: ['title', 'description', 'importance', 'actionItems'],
                  },
                },
                personalGrowth: {
                  type: 'object',
                  properties: {
                    insights: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    learnings: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    toolsAndTechniques: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                  required: ['insights', 'learnings', 'toolsAndTechniques'],
                },
                sessionProgress: {
                  type: 'object',
                  properties: {
                    strengthsIdentified: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    areasForGrowth: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    achievements: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    nextSteps: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                  required: ['strengthsIdentified', 'areasForGrowth', 'achievements', 'nextSteps'],
                },
                therapeuticRelationship: { type: 'string' },
              },
              required: [
                'emotionalJourney',
                'mainPoints',
                'personalGrowth',
                'sessionProgress',
                'therapeuticRelationship',
              ],
            },
          },
          temperature: 0.7,
          max_tokens: 0,
          include_reasoning: true,
          plugins: [],
          transforms: ['middle-out'],
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      const analysis = typeof content === 'string' ? JSON.parse(content) : content

      // Create all related records
      const emotionalJourney = await createEmotionalJourney({
        session: sessionId,
        ...analysis.emotionalJourney,
      })

      const mainPointsRecords = await Promise.all(
        analysis.mainPoints.map((point: any) =>
          createMainPoints({
            session: sessionId,
            ...point,
          }),
        ),
      )

      const personalGrowth = await createPersonalGrowth({
        session: sessionId,
        ...analysis.personalGrowth,
      })

      const sessionProgress = await createSessionProgress({
        session: sessionId,
        ...analysis.sessionProgress,
      })

      // Create the main analysis record
      return await createAnalysis({
        session: sessionId,
        mainPoints: mainPointsRecords.map(record => record.id),
        emotionalJourney: emotionalJourney.id,
        personalGrowth: personalGrowth.id,
        sessionProgress: sessionProgress.id,
        therapeuticRelationship: analysis.therapeuticRelationship,
      })
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
    finally {
      processing.value = false
    }
  }

  return {
    error,
    processing,
    createAnalysis,
    getAnalysisById,
    listAnalysis,
    updateAnalysis,
    deleteAnalysis,
    generateAnalysis,
    getAnalysisForSession,
    createEmotionalJourney,
    createMainPoints,
    createPersonalGrowth,
    createSessionProgress,
  }
}
