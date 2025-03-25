import { useNuxtApp } from '#app'
import { ref } from 'vue'

export interface DemographicData {
  firstName: string
  lastName: string
  age: number
  gender: 'male' | 'female' | 'other'
  education: string
  occupation: string
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed'
}

export interface SessionAnalysis {
  id: string
  session: string
  summaryOfSession: string
  headlines: Array<{
    title: string
    description: string
  }>
  finalTrustAndOppennessOfUser: 'veryHigh' | 'high' | 'low' | 'veryLow'
  finalTrustAndOppennessOfUserEvaluationDescription: string
  psychotherapistEvaluation: string
  psychotherapistEvaluationScore: number
  psychotherapistEvaluationScoreDescription: string
  behavioralAnalysisSummary: string
  emotionalAnalysisSummary: string
  thoughtsAndConcernsSummary: string
  psychoAnalysis: string
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
  socialValues: Record<string, any>
  created: string
  updated: string
  expand: Session
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
          model: 'mistralai/mistral-saba',
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
                    description: 'The level of trust and openness shown by the user about AI Therapist during the session',
                  },
                  finalTrustAndOppennessOfUserEvaluationDescription: {
                    type: 'string',
                    description: 'Detailed explanation of the trust and openness evaluation and evidences about trust and openness of user to AI Therapist',
                  },
                  psychotherapistEvaluation: {
                    type: 'string',
                    description: 'Comprehensive evaluation of the psychotherapist performance',
                  },
                  psychotherapistEvaluationScore: {
                    type: 'number',
                    minimum: 0,
                    maximum: 100,
                    description: 'Numerical score of the psychotherapist performance',
                  },
                  psychotherapistEvaluationScoreDescription: {
                    type: 'string',
                    description: 'Explanation of the psychotherapist performance score',
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
                          description: 'Evidence and examples mentioned by the patient that demonstrate this defense mechanism',
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
                },
                required: [
                  'summaryOfSession',
                  'headlines',
                  'finalTrustAndOppennessOfUser',
                  'finalTrustAndOppennessOfUserEvaluationDescription',
                  'psychotherapistEvaluation',
                  'psychotherapistEvaluationScore',
                  'psychotherapistEvaluationScoreDescription',
                  'behavioralAnalysisSummary',
                  'emotionalAnalysisSummary',
                  'thoughtsAndConcernsSummary',
                  'psychoAnalysis',
                  'detectedDefenceMechanisms',
                  'detectedSchemas',
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

  return {
    error,
    processing,
    createAnalysis,
    getAnalysisById,
    listAnalysis,
    updateAnalysis,
    deleteAnalysis,
    generateAnalysis,
  }
}
