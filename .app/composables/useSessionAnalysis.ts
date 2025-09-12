import { useNuxtApp } from '#app'
import { ref } from 'vue'

export interface DemographicData {
  firstName: string
  lastName: string
  age: number
  gender: 'male' | 'female' | 'other'
  education: 'under diploma' | 'diploma' | 'bachelor' | 'master' | 'phd' | 'other'
  occupation: 'student' | 'employed' | 'self-employed' | 'single' | 'married' | 'divorced' | 'widowed'
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed'
}

export interface SessionAnalysis {
  id: string
  session: string
  title: string
  summaryOfSession: string
  headlines: Array<{
    title: string
    description: string
  }>
  finalTrustAndOppennessOfUser: 'veryHigh' | 'high' | 'low' | 'veryLow'
  finalTrustAndOppennessOfUserEvaluationDescription: string
  psychotherapistEvaluation: string
  negativeScoresList: Array<{
    points: number
    cause: string
  }>
  psychotherapistEvaluationScorePositiveBehavior: string[]
  psychotherapistEvaluationScoreSuggestionsToImprove: string[]
  behavioralAnalysisSummary: string
  emotionalAnalysisSummary: string
  thoughtsAndConcernsSummary: string
  psychoAnalysis: string
  possibleDeeperGoalsOfPatient: string
  detectedDefenceMechanisms: Array<{
    name: string
    confidence: 'very_low' | 'low' | 'high' | 'very_high'
    evidence: string
  }>
  detectedSchemas: Array<{
    name: string
    confidence: 'very_low' | 'low' | 'high' | 'very_high'
    evidence: string
  }>
  demographicData: DemographicData
  suggestedNextStepsForTherapistForNextSession: Array<{
    title: string
    description: string
    suggestedMessage?: string
    schedule?: {
      label: string
      hours: number
    }
    scheduledDate?: Date
    status?: string
  }>
  possibleRiskFactorsExtracted: Array<{
    title: string
    description: string
  }>
  notificationsCreated?: boolean
  created: string
  updated: string
  expand: any
}

export const useSessionAnalysis = () => {
  const nuxtApp = useNuxtApp()
  const pb = nuxtApp.$pb
  const error = ref<string | null>(null)
  const processing = ref(false)

  const createAnalysis = async (data: Partial<SessionAnalysis>) => {
    try {
      return await pb.collection('session_analysis_for_system').create(data)
    }
    catch (error: any) {
      console.error('Error creating session analysis:', error)
      throw error
    }
  }

  const getAnalysisById = async (id: string) => {
    try {
      return await pb.collection('session_analysis_for_system').getOne(id, {
        expand: 'session, session.user, session.therapist',
      })
    }
    catch (error: any) {
      console.error('Error getting session analysis:', error)
      throw error
    }
  }

  const listAnalysis = async (filter = '', sort = '-created') => {
    try {
      return await pb.collection('session_analysis_for_system').getList(1, 50, {
        filter,
        sort,
      })
    }
    catch (error: any) {
      console.error('Error listing session analysis:', error)
      throw error
    }
  }

  const updateAnalysis = async (id: string, data: Partial<SessionAnalysis>) => {
    try {
      return await pb.collection('session_analysis_for_system').update(id, data)
    }
    catch (error: any) {
      console.error('Error updating session analysis:', error)
      throw error
    }
  }

  const deleteAnalysis = async (id: string) => {
    try {
      return await pb.collection('session_analysis_for_system').delete(id)
    }
    catch (error: any) {
      console.error('Error deleting session analysis:', error)
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
          'X-Title': 'Session Analysis Generator',
        },
        body: JSON.stringify({
          model: 'google/gemma-3-27b-it',
          messages: [
            {
              role: 'system',
              content: 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا با بررسی پیام‌های جلسه، تحلیل جامعی از وضعیت مراجع ارائه دهید.',
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
              name: 'session_analysis',
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'Title or topic of the session, based on content and topics raised in the session',
                  },
                  summaryOfSession: {
                    type: 'string',
                    description: 'A comprehensive summary of the therapy session',
                    maxLength: 1000,
                  },
                  headlines: {
                    type: 'array',
                    description: 'A list of exactly 4 headlines representing the therapy session',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                      },
                      required: ['title', 'description'],
                    },
                    minItems: 4,
                    maxItems: 4,
                  },
                  finalTrustAndOppennessOfUser: {
                    type: 'string',
                    enum: ['veryHigh', 'high', 'low', 'veryLow'],
                    description: 'The level of trust and openness shown by the user about this AI Therapist during this session',
                  },
                  finalTrustAndOppennessOfUserEvaluationDescription: {
                    type: 'string',
                    description: 'Detailed explanation of the trust and openness evaluation and evidences about trust and openness of user to this AI Therapist',
                  },
                  psychotherapistEvaluation: {
                    type: 'string',
                    description: 'Comprehensive evaluation of the psychotherapist performance',
                  },
                  negativeScoresList: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        points: {
                          type: 'number',
                          description: 'Number of points to deduct for psychotherapist fault or mistake. Note that these mistakes are proffessional mistakes and should be precise and accurate',
                          minimum: 10,
                          maximum: 20,
                        },
                        cause: {
                          type: 'string',
                          description: 'Specific fault or mistake made by the psychotherapist that led to point deduction',
                        },
                      },
                      required: ['points', 'cause'],
                    },
                    description: 'List of performance issues that reduce the therapist\'s overall score. The final score (psychotherapistEvaluationScore) should be calculated as 100 minus the sum of all deducted points.',
                    minItems: 0,
                    maxItems: 5,
                  },
                  psychotherapistEvaluationScorePositiveBehavior: {
                    type: 'array',
                    items: {
                      type: 'string',
                      description: 'A positive behavior exhibited by the psychotherapist',
                    },
                    description: 'List of positive behaviors demonstrated by the psychotherapist during the session. should be exactly an array of strings',
                    minItems: 0,
                    maxItems: 5,
                  },
                  psychotherapistEvaluationScoreSuggestionsToImprove: {
                    type: 'array',
                    items: {
                      type: 'string',
                      description: 'A suggestion to improve the psychotherapist performance',
                    },
                    description: 'List of suggestions to improve the psychotherapist performance. should be exactly an array of strings',
                    minItems: 3,
                    maxItems: 5,
                  },

                  behavioralAnalysisSummary: {
                    type: 'string',
                    description: 'Analysis of patient\'s behavioral patterns and evidences. Strongly should be based on behavioral analysis.should be empty if you are not sure',
                  },
                  emotionalAnalysisSummary: {
                    type: 'string',
                    description: 'Analysis of patient\'s emotional states and patterns. Strongly should be based on emotional analysis.should be empty if you are not sure',
                  },
                  thoughtsAndConcernsSummary: {
                    type: 'string',
                    description: 'Summary of patient\'s main thoughts and concerns.should be empty if you are not sure',
                  },
                  psychoAnalysis: {
                    type: 'string',
                    description: 'Psychoanalytic interpretation of the session. Should be detailed and in terms of psychoanalysis. Unconscious thoughts, feelings, and experiences, also id, ego, and superego.',
                  },
                  possibleDeeperGoalsOfPatient: {
                    type: 'string',
                    description: 'Analysis of possible deeper, underlying goals or motivations of the patient that may not be explicitly stated, based on the topics raised in the meeting',
                  },
                  detectedDefenceMechanisms: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          enum: [
                            'انکار', // denial
                            'فرافکنی', // projection
                            'عقلانی سازی', // rationalization
                            'پسرفت', // regression
                            'جابجایی', // displacement
                            'سرکوب', // repression
                            'واکنش وارونه', // reaction formation
                            'والایش', // sublimation
                            'عقلانی کردن', // intellectualization
                            'جداسازی', // isolation
                            'باطل سازی', // undoing
                            'همانندسازی', // identification
                            'فرونشانی', // suppression
                            'جداسازی ذهنی', // compartmentalization
                            'منفعل پرخاشگر', // passive aggressive
                            'عمل گرایی', // acting out
                            'خیال پردازی', // fantasy
                            'شوخی', // humor
                            'گسستگی', // dissociation
                            'اجتناب', // avoidance
                            'قربانی کردن', // scapegoating
                            'بدون داده', // no_data
                          ],
                        },
                        confidence: {
                          type: 'string',
                          enum: ['very_low', 'low', 'high', 'very_high'],
                        },
                        evidence: {
                          type: 'string',
                          description: 'part of exact message of user which contains this defense mechanism evidence. should be exact message of user, not anything else. as a evidence for this defense mechanism',
                        },
                      },
                      required: ['name', 'confidence', 'evidence'],
                    },
                    description: 'List of defense mechanisms detected during the session with confidence levels and supporting evidence. Use name: no_data if none are detected or unsure.',
                  },
                  detectedSchemas: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          enum: [
                            'رهاشدگی', // abandonment
                            'بی اعتمادی و بدرفتاری', // mistrust abuse
                            'محرومیت هیجانی', // emotional deprivation
                            'نقص', // defectiveness
                            'انزوای اجتماعی', // social isolation
                            'وابستگی', // dependence
                            'آسیب پذیری', // vulnerability
                            'گرفتاری', // enmeshment
                            'شکست', // failure
                            'استحقاق', // entitlement
                            'خویشتن داری ناکافی', // insufficient self control
                            'اطاعت', // subjugation
                            'ایثار', // self sacrifice
                            'تایید جویی', // approval seeking
                            'منفی گرایی', // negativity
                            'بازداری هیجانی', // emotional inhibition
                            'معیارهای سرسختانه', // unrelenting standards
                            'تنبیه', // punitiveness
                            'بدون داده', // no data
                          ],
                        },
                        confidence: {
                          type: 'string',
                          enum: ['very_low', 'low', 'high', 'very_high'],
                        },
                        evidence: {
                          type: 'string',
                          description: 'Evidence and examples mentioned by the patient that support this schema',
                        },
                      },
                      required: ['name', 'confidence', 'evidence'],
                    },
                    description: 'List of schemas detected during the session based on Young\'s Schema Theory with confidence levels and supporting evidence. Use name: no_data if none are detected or unsure.',
                  },
                  demographicData: {
                    type: 'object',
                    properties: {
                      firstName: {
                        type: 'string',
                        description: 'Patient\'s first name, can be null if not mentioned',
                        nullable: true,
                      },
                      lastName: {
                        type: 'string',
                        description: 'Patient\'s last name, can be null if not mentioned',
                        nullable: true,
                      },
                      age: {
                        type: 'number',
                        description: 'Patient\'s age, can be null if not mentioned',
                        nullable: true,
                      },
                      gender: {
                        type: 'string',
                        enum: ['male', 'female', 'other', null],
                        description: 'Patient\'s gender, extract it from the name if provided. if not sure, use null.',
                        nullable: true,
                      },
                      education: {
                        type: 'string',
                        enum: ['under diploma', 'diploma', 'bachelor', 'master', 'phd', 'other'],
                        description: 'Patient\'s education level, can be null if not mentioned',
                        nullable: true,
                      },
                      occupation: {
                        type: 'string',
                        enum: ['student', 'employed', 'self-employed', 'unemployed', 'retired', 'householder', 'other'],
                        description: 'Patient\'s occupation, can be null if not mentioned',
                        nullable: true,
                      },
                      maritalStatus: {
                        type: 'string',
                        enum: ['single', 'married', 'divorced', 'widowed', null],
                        description: 'Patient\'s marital status, can be null if not mentioned',
                        nullable: true,
                      },
                    },
                    description: 'Demographic information about the patient extracted from the session',
                  },
                  suggestedNextStepsForTherapistForNextSession: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          description: 'Title of the suggested next step for the therapist',
                        },
                        description: {
                          type: 'string',
                          description: 'Detailed description of the suggested next step',
                        },
                      },
                      required: ['title', 'description'],
                    },
                    description: 'List of suggested next steps for the therapist to consider in the next session. should be unique and not repeated',
                    minItems: 3,
                    maxItems: 5,
                  },

                  possibleRiskFactorsExtracted: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          description: 'Title of the identified risk factor that requires more attention',
                        },
                        description: {
                          type: 'string',
                          description: 'Detailed description of the risk factor including concerning thoughts, behaviors, or beliefs of the patient that may indicate potential harm to self or others, and requires more professional intervention',
                        },
                      },
                      required: ['title', 'description'],
                    },
                    description: 'List of risk factors identified during the session related to patient\'s thoughts, behaviors, or beliefs that may require more professional attention or intervention. should be unique and not repeated',
                    minItems: 1,
                    maxItems: 5,
                  },
                },
                required: [
                  'title',
                  'summaryOfSession',
                  'headlines',
                  'finalTrustAndOppennessOfUser',
                  'finalTrustAndOppennessOfUserEvaluationDescription',
                  'psychotherapistEvaluation',
                  'negativeScoresList',
                  'psychotherapistEvaluationScorePositiveBehavior',
                  'psychotherapistEvaluationScoreSuggestionsToImprove',
                  'behavioralAnalysisSummary',
                  'emotionalAnalysisSummary',
                  'thoughtsAndConcernsSummary',
                  'psychoAnalysis',
                  'possibleDeeperGoalsOfPatient',
                  'detectedDefenceMechanisms',
                  'detectedSchemas',
                  'demographicData',
                  'suggestedNextStepsForTherapistForNextSession',
                  'possibleRiskFactorsExtracted',
                ],
              },
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
      return typeof content === 'string' ? JSON.parse(content) : content
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
    finally {
      processing.value = false
    }
  }

  const getAnalysisForSession = async (sessionId: string): Promise<SessionAnalysis | null> => {
    try {
      const nuxtApp = useNuxtApp()
      const records = await nuxtApp.$pb.collection('session_analysis_for_system').getList(1, 1, {
        filter: `session="${sessionId}"`,
        sort: '-created',
        expand: 'session',
      })

      if (records.items.length > 0) {
        return records.items[0] as unknown as SessionAnalysis
      }
      return null
    }
    catch (error: any) {
      if (error?.status === 404) {
        return null
      }
      console.error('Error getting analysis for session:', error)
      throw error
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
  }
}
