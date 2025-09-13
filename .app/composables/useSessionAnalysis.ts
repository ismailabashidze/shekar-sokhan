import { useNuxtApp, useRuntimeConfig } from '#app'
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
      console.log('🔍 Starting session analysis generation for session:', sessionId)
      console.log('📨 Number of messages to analyze:', messages.length)
      
      // Log the first few messages for debugging
      console.log('📋 First 3 messages:', messages.slice(0, 3).map(m => ({
        role: m.role,
        content: m.content?.substring(0, 100) + '...'
      })))

      const requestBody = {
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
                  description: 'عنوان یا موضوع جلسه، بر اساس محتوا و موضوعات مطرح شده در جلسه',
                },
                summaryOfSession: {
                  type: 'string',
                  description: 'خلاصه جامعی از جلسه درمانی',
                  maxLength: 1000,
                },
                headlines: {
                  type: 'array',
                  description: 'فهرستی دقیقاً شامل ۴ تیتر که جلسه درمانی را نشان می دهد',
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
                  description: 'سطح اعتماد و صراحتی که کاربر نسبت به این روان شناس هوش مصنوعی در طول این جلسه نشان داده است',
                },
                finalTrustAndOppennessOfUserEvaluationDescription: {
                  type: 'string',
                  description: 'توضیح دقیق ارزیابی اعتماد و صراحت به همراه شواهدی درباره اعتماد و صراحت کاربر نسبت به این روان شناس هوش مصنوعی',
                },
                psychotherapistEvaluation: {
                  type: 'string',
                  description: 'ارزیابی جامع عملکرد روان شناس',
                },
                negativeScoresList: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      points: {
                        type: 'number',
                        description: 'تعداد امتیازات کسر شده برای اشتباه یا خطای روان شناس. توجه داشته باشید که این اشتباهات حرفه ای هستند و باید دقیق و محکم باشند',
                        minimum: 10,
                        maximum: 20,
                      },
                      cause: {
                        type: 'string',
                        description: 'خطای خاص یا اشتباهی که روان شناس مرتکب شده و منجر به کسر امتیاز شده است',
                      },
                    },
                    required: ['points', 'cause'],
                  },
                  description: 'فهرستی از مسائل عملکردی که امتیاز کلی درمانگر را کاهش می دهد. امتیاز نهایی (psychotherapistEvaluationScore) باید به صورت ۱۰۰ منهای مجموع تمام امتیازات کسر شده محاسبه شود.',
                  minItems: 0,
                  maxItems: 5,
                },
                psychotherapistEvaluationScorePositiveBehavior: {
                  type: 'array',
                  items: {
                    type: 'string',
                    description: 'رفتار مثبتی که توسط روان شناس نشان داده شده است',
                  },
                  description: 'فهرستی از رفتارهای مثبتی که روان شناس در طول جلسه نشان داده است. دقیقاً باید آرایه ای از رشته ها باشد',
                  minItems: 0,
                  maxItems: 5,
                },
                psychotherapistEvaluationScoreSuggestionsToImprove: {
                  type: 'array',
                  items: {
                    type: 'string',
                    description: 'پیشنهادی برای بهبود عملکرد روان شناس',
                  },
                  description: 'فهرستی از پیشنهادات برای بهبود عملکرد روان شناس. دقیقاً باید آرایه ای از رشته ها باشد',
                  minItems: 3,
                  maxItems: 5,
                },

                behavioralAnalysisSummary: {
                  type: 'string',
                  description: 'تحلیل الگوهای رفتاری بیمار و شواهد. قویاً باید بر اساس تحلیل رفتاری باشد. اگر مطمئن نیستید خالی بگذارید',
                },
                emotionalAnalysisSummary: {
                  type: 'string',
                  description: 'تحلیل حالت ها و الگوهای احساسی بیمار. قویاً باید بر اساس تحلیل احساسی باشد. اگر مطمئن نیستید خالی بگذارید',
                },
                thoughtsAndConcernsSummary: {
                  type: 'string',
                  description: 'خلاصه ای از افکار و نگرانی های اصلی بیمار. اگر مطمئن نیستید خالی بگذارید',
                },
                psychoAnalysis: {
                  type: 'string',
                  description: 'تفسیر روانکاوی جلسه. باید مفصل و از دیدگاه روانکاوی باشد. افکار، احساسات و تجربیات ناخودآگاه همراه با من، خود و فراخود',
                },
                possibleDeeperGoalsOfPatient: {
                  type: 'string',
                  description: 'تحلیل اهداف یا انگیزه های عمیق تر و پنهان بیمار که ممکن است به طور صریح بیان نشده باشد، بر اساس موضوعات مطرح شده در جلسه',
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
                        description: 'بخشی از پیام دقیق کاربر که حاوی شواهد این مکانیسم دفاعی است. باید پیام دقیق کاربر باشد، نه چیز دیگری. به عنوان شواهدی برای این مکانیسم دفاعی',
                      },
                    },
                    required: ['name', 'confidence', 'evidence'],
                  },
                  description: 'فهرستی از مکانیسم های دفاعی شناسایی شده در طول جلسه با سطوح اطمینان و شواهد پشتیبان. اگر چیزی شناسایی نشد یا مطمئن نیستید از name: no_data استفاده کنید.',
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
                        description: 'شواهد و نمونه هایی که توسط بیمار ذکر شده و این الگو را پشتیبانی می کند',
                      },
                    },
                    required: ['name', 'confidence', 'evidence'],
                  },
                  description: 'فهرستی از الگوهای شناسایی شده در طول جلسه بر اساس نظریه الگوهای یانگ با سطوح اطمینان و شواهد پشتیبان. اگر چیزی شناسایی نشد یا مطمئن نیستید از name: no_data استفاده کنید.',
                },
                demographicData: {
                  type: 'object',
                  properties: {
                    firstName: {
                      type: 'string',
                      description: 'نام کوچک بیمار، اگر ذکر نشده باشد می تواند null باشد',
                      nullable: true,
                    },
                    lastName: {
                      type: 'string',
                      description: 'نام خانوادگی بیمار، اگر ذکر نشده باشد می تواند null باشد',
                      nullable: true,
                    },
                    age: {
                      type: 'number',
                      description: 'سن بیمار، اگر ذکر نشده باشد می تواند null باشد',
                      nullable: true,
                    },
                    gender: {
                      type: 'string',
                      enum: ['male', 'female', 'other', null],
                      description: 'جنسیت بیمار، اگر نام ارائه شده باشد از روی آن استخراج کنید. اگر مطمئن نیستید از null استفاده کنید.',
                      nullable: true,
                    },
                    education: {
                      type: 'string',
                      enum: ['under diploma', 'diploma', 'bachelor', 'master', 'phd', 'other'],
                      description: 'سطح تحصیلات بیمار، اگر ذکر نشده باشد می تواند null باشد',
                      nullable: true,
                    },
                    occupation: {
                      type: 'string',
                      enum: ['student', 'employed', 'self-employed', 'unemployed', 'retired', 'householder', 'other'],
                      description: 'شغل بیمار، اگر ذکر نشده باشد می تواند null باشد',
                      nullable: true,
                    },
                    maritalStatus: {
                      type: 'string',
                      enum: ['single', 'married', 'divorced', 'widowed', null],
                      description: 'وضعیت تاهل بیمار، اگر ذکر نشده باشد می تواند null باشد',
                      nullable: true,
                    },
                  },
                  description: 'اطلاعات دموگرافیک درباره بیمار که از جلسه استخراج شده است',
                },
                suggestedNextStepsForTherapistForNextSession: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: {
                        type: 'string',
                        description: 'عنوان پیشنهاد مرحله بعدی برای درمانگر',
                      },
                      description: {
                        type: 'string',
                        description: 'توضیح مفصل پیشنهاد مرحله بعدی',
                      },
                    },
                    required: ['title', 'description'],
                  },
                  description: 'فهرستی از مراحل پیشنهادی بعدی برای درمانگر که باید در جلسه بعدی مدنظر قرار گیرد. باید منحصر به فرد و بدون تکرار باشد',
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
                        description: 'عنوان عامل ریسک شناسایی شده که نیاز به توجه بیشتر دارد',
                      },
                      description: {
                        type: 'string',
                        description: 'توضیح مفصل عامل ریسک شامل افکار، رفتارها یا باورهای نگران کننده بیمار که ممکن است نشان از آسیب به خود یا دیگران داشته باشد و نیاز به مداخله حرفه ای بیشتر دارد',
                      },
                    },
                    required: ['title', 'description'],
                  },
                  description: 'فهرستی از عوامل ریسک شناسایی شده در طول جلسه مرتبط با افکار، رفتارها یا باورهای بیمار که ممکن است نیاز به توجه یا مداخله حرفه ای بیشتر داشته باشد. باید منحصر به فرد و بدون تکرار باشد',
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
        plugins: [],
        transforms: ['middle-out'],
      };

      console.log('📤 Sending request to OpenRouter API with model:', requestBody.model);
      
      // Implement timeout mechanism similar to useOpenRouter.ts
      let response: Response | null = null;
      let attempts = 0;
      const maxAttempts = 2; // Initial attempt + 1 retry
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`⏳ Attempt ${attempts}/${maxAttempts} to generate session analysis`);
        
        try {
          response = await Promise.race([
            fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
                'HTTP-Referer': useRuntimeConfig().public.appUrl || 'http://localhost:3000',
                'X-Title': 'Session Analysis Generator',
              },
              body: JSON.stringify(requestBody),
            }),
            new Promise((_, reject) => 
              setTimeout(() => {
                console.log('⏰ Request timeout after 30 seconds');
                reject(new Error('Request timeout after 30 seconds'));
              }, 30000)
            )
          ]) as Response;
          
          console.log(`✅ Request successful on attempt ${attempts}`);
          // If we get here, the request was successful
          // Check if response is valid before breaking
          if (response && response.ok) {
            break;
          } else if (response) {
            // If response exists but is not ok, throw error to trigger retry
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }
        } catch (e) {
          console.log(`❌ Attempt ${attempts} failed:`, e);
          if (attempts >= maxAttempts) {
            // Last attempt failed, re-throw the error
            throw e;
          }
          // Retry after 1 second
          console.log('🔄 Retrying in 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Additional check to ensure we have a valid response
      if (!response) {
        throw new Error('No response received from OpenRouter API after all attempts');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OpenRouter API error response:', errorText);
        throw new Error(errorText);
      }

      console.log('📥 Received response from OpenRouter API');
      
      const data = await response.json();
      console.log('📄 Raw response data:', {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length,
        firstChoiceHasMessage: !!data.choices?.[0]?.message,
        firstMessageHasContent: !!data.choices?.[0]?.message?.content
      });
      
      const content = data.choices[0].message.content;
      console.log('📋 Response content length:', content?.length);
      
      if (!content) {
        throw new Error('Empty response content from OpenRouter API');
      }
      
      console.log('🔍 First 200 characters of response:', content.substring(0, 200) + '...');
      
      const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
      console.log('✅ Session analysis generation completed successfully');
      
      return parsedContent;
    }
    catch (e: any) {
      console.error('💥 Error in generateAnalysis:', e);
      error.value = e.message;
      throw e;
    }
    finally {
      processing.value = false;
      console.log('🏁 generateAnalysis function completed');
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
