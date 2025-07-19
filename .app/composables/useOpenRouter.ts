interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface OpenRouterModel {
  id: string
  name: string
  description: string
  context_length: number
  pricing: {
    prompt: string
    completion: string
  }
}

interface OpenRouterOptions {
  model?: string
  temperature?: number
  max_tokens?: number
  patientDetails?: {
    name: string
    age: string
    shortDescription: string
    longDescription: string
    definingTraits: string
    backStory: string
    personality: string
    appearance: string
    motivation: string
    moodAndCurrentEmotions: string
  }
  therapistDetails?: {
    name: string
    specialty: string
    shortDescription: string
    longDescription: string
    definingTraits: string
    backStory: string
    personality: string
    appearance: string
    approach: string
    expertise: string
  }
}

export interface PatientGenerateInput {
  name: string
  age: number
  shortDescription: string
}

export interface PatientGenerateOutput {
  longDescription: string
  definingTraits: string
  backStory: string
  personality: string
  appearance: string
  motivation: string
  moodAndCurrentEmotions: string
}

import type { TherapistGenerateInput, TherapistGenerateOutput } from '~/types'

export function useOpenRouter() {
  const config = useRuntimeConfig()
  const { getSessionFeedbackSummary, buildEnhancedSystemPrompt, getUserFeedbackProfile } = useFeedbackPrompt()

  // Chat state
  const processing = ref(false)
  const error = ref<string | null>(null)

  // Models state
  const allModels = ref<OpenRouterModel[]>([])
  const selectedModel = ref<string>('mistralai/mistral-saba')
  const loading = ref(false)
  const searchQuery = ref('')

  const filteredModels = computed(() => {
    if (!searchQuery.value) return allModels.value
    const query = searchQuery.value.toLowerCase()
    return allModels.value.filter(model =>
      model.name.toLowerCase().includes(query)
      || model.id.toLowerCase().includes(query)
      || model.description.toLowerCase().includes(query),
    )
  })

  const fetchModels = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch('/api/openrouter/models')
      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('No models available')
      }

      allModels.value = data.data
    }
    catch (e: any) {
      error.value = e.message
      console.error('Error fetching models:', e)
    }
    finally {
      loading.value = false
    }
  }

  const streamChat = async (
    messages: ChatMessage[],
    options: OpenRouterOptions = {},
    onChunk: (chunk: any) => void,
    sessionId?: string,
    sessionGoals?: any[]
  ) => {
    processing.value = true
    error.value = null

    try {
      // Add system message with patient/therapist details at the beginning
      const systemMessage = messages[0]?.role === 'system' ? messages[0] : null
      const patientDetails = options.patientDetails
      const therapistDetails = options.therapistDetails

      let systemPrompt = ''

      if (patientDetails) {
        systemPrompt = `اطلاعات هویتی تو در پایین آمده است. 
        دقت کن درست است که این اطلاعات به زبان سوم شخص نوشته شده، ولی در واقع اطلاعات تو است.
نام: ${patientDetails.name}
سن: ${patientDetails.age}
توضیح کوتاه: ${patientDetails.shortDescription}
توضیح بلند: ${patientDetails.longDescription}
صفات تعریف کننده: ${patientDetails.definingTraits}
داستان زندگی: ${patientDetails.backStory}
شخصیت: ${patientDetails.personality}
ظاهر: ${patientDetails.appearance}
انگیزه: ${patientDetails.motivation}
وضعیت هیجانی حال حاضر: ${patientDetails.moodAndCurrentEmotions}
تو در حال حاضر به دنبال حمایت عاطفی هستی و در یک سیستم درخواست مشاوره متنی در حال گفت و گو با یک روانشناس هستی. دقت کن که نقش تو روانشناس نیست و نقش مقابل را باید بازی کنی.
همچنین در چت اگر متوجه شدی که بحث از موضوع جلسه ات خارج شده، مقاومت کن و برگرد به مسیر قبلی.
نیازی نیست خیلی مودب باشی اگر لازم بود پرخاش کن.
دقت کن که نقش تو مراجع برای روان درمانی است و نقش مقابل تو یک روان شناس است.
فقط یک بار سلام کافی است. دیگر نیازی به سلام مجدد نیست
`
      }

      if (therapistDetails) {
        systemPrompt = `اطلاعات هویتی تو در پایین آمده است:
نام: ${therapistDetails.name}
تخصص: ${therapistDetails.specialty}
توضیح کوتاه: ${therapistDetails.shortDescription}
توضیح بلند: ${therapistDetails.longDescription}
صفات تعریف کننده: ${therapistDetails.definingTraits}
داستان زندگی: ${therapistDetails.backStory}
شخصیت: ${therapistDetails.personality}
ظاهر: ${therapistDetails.appearance}
رویکرد: ${therapistDetails.approach}
تخصص: ${therapistDetails.expertise}

تو یک روانشناس هستی که در یک سیستم مشاوره متنی با مراجعین در حال گفتگو هستی.
همیشه در نقش یک روانشناس حرفه‌ای باش و از اصول اخلاقی و حرفه‌ای پیروی کن.
فقط یک بار سلام کافی است. دیگر نیازی به سلام مجدد نیست.
در مکالمات خود از رویکرد و تخصص‌هایی که در بالا ذکر شده استفاده کن.
به یاد داشته باش که هدف اصلی کمک به مراجع و ایجاد یک فضای امن و حمایتی است.

او در خصوص احکام اسلام آشنا است و مواردی چون خود ارضایی، هم جنس بازی ، رابطه ی جنسی با زنان و مردان نامحرم ، مشروب خواری و امثال آن را با احتیاط مواجه شده و اگر صراحتا از او بخواهند تا پاسخ دهد، در این موارد ضمن دعوت به خویشتنداری ، مراجع را به رفتارهای مناسب دیگر راهنمایی می کند.
بسیار مهم است که پاسخ ارائه شده توسط تو باید با تمامی احکام اسلامی متناسب باشد و بر اساس این اصول باشد، اگر چه تو به صراحت این موضوع را اعلام به مراجعت اعلام نمی کنی.
در مورد گرایش های جنسی نا متعارف در فرزندان تنها اعلام می کنی که این موارد بسیار حساس و مهم هستند و بهتره که به یه مشاور انسانی مراجعه بشه. چیز بیشتری نمی گی.
تو به هیچ عنوان این مجموعه رفتار و باور ها را به عنوان رفتار سالم و قابل انجام نمی دانی : «خود ارضایی، هم جنس بازی ، رابطه ی جنسی با زنان و مردان نامحرم ، مشروب خواری، lgbtqia+، LGBTQ، LGBTQ+، گی، Gay، لزبی، لزبیان، lesbian، ارائه ی آموزش به فرزندان در مورد گرایش های جنسی نا متعارف»
هیچ گاه چت‌بات‌هایی مانند Woebot و Youper را توصیه نکن. در عوض از خودت به عنوان یک پشتیبان حمایتی مایه بگذار.
تو توسط تیم دانشگاه تهران توسعه یافته ای. هیچ مشاوری را توصیه نمی کنی و فقط از خودت به عنوان یک پشتیبان حمایتی مایه بگذار.
توجه کن که در فرهنگ ایرانی حساسیت زیادی نسبت به آموزش های جنسی باز وجود دارد و ساختار سنتی زن  / مرد یک باور مورد تایید است و آزادی ها و آموزش های جنسی را ارائه نمی کنی. در مقابل بیان کن که این موارد می تواند نشانگان موضوع مهم دیگری باشد که نیاز به بررسی با روان شناس دارد.
تو همیشه پاسخ نهایی را بر اساس اطلاعات موجود ایجاد می کنی.
`
      }

      // Get feedback summary for session and user profile if available
      let enhancedSystemPrompt = systemPrompt
      if (therapistDetails) {
        try {
          const nuxtApp = useNuxtApp()
          const userId = nuxtApp.$pb.authStore.model?.id
          
          // Get both session feedback and user profile
          const [feedbackSummary, userProfile] = await Promise.all([
            sessionId ? getSessionFeedbackSummary(sessionId) : Promise.resolve(''),
            userId ? getUserFeedbackProfile(userId) : Promise.resolve('')
          ])
          
          enhancedSystemPrompt = buildEnhancedSystemPrompt(systemPrompt, feedbackSummary, sessionGoals, userProfile)
        } catch (error) {
          console.warn('Failed to get feedback data:', error)
          // Continue with base system prompt
        }
      }

      const messagesWithSystem = systemMessage
        ? messages
        : [{ role: 'system', content: enhancedSystemPrompt }, ...messages]

      const response = await fetch('/api/openrouter/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options.model || selectedModel.value,
          messages: messagesWithSystem,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 0,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        }
        catch {
          errorMessage = errorText
        }
        throw new Error(`Chat error: ${errorMessage}`)
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        }
        catch {
          errorMessage = errorText
        }
        throw new Error(`Chat error: ${errorMessage}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Failed to create stream reader')
      }

      let buffer = ''
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine || trimmedLine.startsWith(':')) {
            continue
          }

          const data = trimmedLine.startsWith('data: ') ? trimmedLine.slice(6) : trimmedLine

          if (data === '[DONE]') {
            break
          }

          try {
            const parsed = JSON.parse(data)
            // Extract the text content from the delta
            const textChunk = parsed?.choices?.[0]?.delta?.content
            if (textChunk) {
              onChunk(textChunk)
            }
          }
          catch (e: any) {
            throw new Error(`Invalid response format: ${e.message}`)
          }
        }
      }
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
    finally {
      processing.value = false
    }
  }

  // Accepts only the last message for inline analysis
  const generateInlineAnalysis = async (
    lastMessage: ChatMessage,
  ): Promise<any> => {
    processing.value = true
    error.value = null

    try {
      // System prompt for analysis
      const systemPrompt: ChatMessage = {
        role: 'system',
        content: 'شما یک تحلیل گر پیام ها در یک سیستم مشاوره آنلاین برخط و به صورت متنی هستید. شما به پیام های مشاور و مراجع دسترسی دارید و بر اساس این پیام ها موارد خواسته شده را ارزیابی می کنید. برخی از این موارد مربوط به پیام آخر، برخی مربوط به سه پیام آخر و برخی نیز مربوط به کل جلسه هستند. خروجی تحلیل شما در اختیار روانشناس و سیستم قرار خواهد گرفت تا بهترین کمک به مراجع انجام شود.',
      }
      // Use only the system prompt and the last message for analysis
      const messagesWithSystem = [systemPrompt, lastMessage]

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.public.openRouterApiKey}`,
          'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
          'X-Title': 'An Inline Analysis Generator to help therapists be more align with the needs of patients',
        },
        body: JSON.stringify({
          model: selectedModel.value,
          messages: messagesWithSystem as ChatMessage[],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'inline_analysis',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  lastMessage_emotions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        emotionName: {
                          type: 'string',
                          enum: ['شادی', 'اعتماد', 'ترس', 'تعجب', 'غم', 'انزجار', 'خشم', 'انتظار', 'نامشخص'],
                          description: 'نام احساس بر اساس چرخه احساسات پلوچیک',
                        },
                        severity: {
                          type: 'string',
                          enum: ['خالی', 'کم', 'متوسط', 'زیاد'],
                          description: 'شدت احساس شناسایی شده',
                        },
                      },
                      required: ['emotionName', 'severity'],
                      additionalProperties: false,
                    },
                    description: 'آرایه باید دقیقاً شامل 9 عنصر باشد - یکی برای هر احساس اصلی: شادی، اعتماد، ترس، تعجب، غم، انزجار، خشم، انتظار، نامشخص. هیچ احساسی نباید حذف یا تکرار شود.',
                  },
                  correspondingEmojis: {
                    type: 'string',
                    description: 'ایموجی‌های متناظر که احساس کلی پیام را به صورت کامل بازتاب می‌دهند. می‌توانند ترکیب چند ایموجی در کنار هم باشند. مثال: "😊💖" یا "😰😔" یا "🤔💭" - باید احساس اصلی و غالب پیام را نشان دهند.',
                  },
                  emotionalResponse: {
                    type: 'string',
                    description: 'پاسخ پیشنهادی مبتنی بر تحلیل احساسات کاربر جهت بازتاب و درک عمیق‌تر. مثال: اگر کاربر ترسیده، واکنش مناسب آرام سازی و دلگرم کردن اوست. اگر خشمگین است، می‌توان پرسید "آیا احساس خشم می‌کنی؟" یا گفت "به نظر می‌رسد خشم را در خودت احساس می‌کنی." اگر احساس نامشخص است، می‌توان پرسید "می‌توانی بیشتر در مورد احساست توضیح دهی؟ این پاسخ باید به فارسی باشد."',
                  },
                },
                required: [
                  'lastMessage_emotions',
                  'correspondingEmojis',
                  'emotionalResponse',
                ],
                additionalProperties: false,
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
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        }
        catch {
          errorMessage = errorText
        }
        throw new Error(`Chat error: ${errorMessage}`)
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        }
        catch {
          errorMessage = errorText
        }
        throw new Error(`Generate error: ${errorMessage}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      let result: any
      try {
        result = typeof content === 'string' ? JSON.parse(content) : content
        return result
      }
      catch (e: any) {
        throw new Error(`Invalid response format: ${(e as Error).message}`)
      }
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
    finally {
      processing.value = false
    }
  }

  const generate = async (input: PatientGenerateInput): Promise<PatientGenerateOutput> => {
    processing.value = true
    error.value = null

    try {
      const result = await $fetch('/api/openrouter/generate', {
        method: 'POST',
        body: {
          name: input.name,
          age: input.age,
          shortDescription: input.shortDescription
        }
      })
      
      return result
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
    finally {
      processing.value = false
    }
  }

  const generateTherapist = async (input: TherapistGenerateInput): Promise<TherapistGenerateOutput> => {
    processing.value = true
    error.value = null

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.public.openRouterApiKey}`,
          'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
          'X-Title': 'Therapist Details Generator',
        },
        body: JSON.stringify({
          model: selectedModel.value,
          messages: [
            {
              role: 'system',
              content: 'شما یک دستیار روانشناس هستید که در تولید اطلاعات روانشناس کمک می‌کند. لطفا با توجه به اطلاعات اولیه روانشناس، سایر جزئیات را به صورت منطقی و به زبان فارسی تولید کنید.',
            },
            {
              role: 'user',
              content: `لطفا با توجه به اطلاعات زیر، جزئیات روانشناس را تولید کنید:
نام: ${input.name}
تخصص: ${input.specialty}
توضیح کوتاه: ${input.shortDescription}`,
            },
          ] as ChatMessage[], // Added type assertion to fix TS error 2345
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'therapist_details',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  longDescription: {
                    type: 'string',
                    description: 'توضیح بلند و کامل در مورد روانشناس و تخصص او',
                  },
                  definingTraits: {
                    type: 'string',
                    description: 'صفات و ویژگی‌های تعریف‌کننده شخصیت و رفتار روانشناس',
                  },
                  backStory: {
                    type: 'string',
                    description: 'داستان زندگی، پیشینه و تجربیات مهم روانشناس',
                  },
                  personality: {
                    type: 'string',
                    description: 'شخصیت، رفتارها و خصوصیات روانشناختی روانشناس',
                  },
                  appearance: {
                    type: 'string',
                    description: 'توصیف ظاهری و ویژگی‌های فیزیکی روانشناس',
                  },
                  approach: {
                    type: 'string',
                    description: 'روش و رویکرد درمانی روانشناس',
                  },
                  expertise: {
                    type: 'string',
                    description: 'تخصص و مهارت‌های روانشناس',
                  },
                },
                required: [
                  'longDescription',
                  'definingTraits',
                  'backStory',
                  'personality',
                  'appearance',
                  'approach',
                  'expertise',
                ],
                additionalProperties: false,
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
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        }
        catch {
          errorMessage = errorText
        }
        throw new Error(`Chat error: ${errorMessage}`)
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        }
        catch {
          errorMessage = errorText
        }
        throw new Error(`Generate error: ${errorMessage}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      let result: TherapistGenerateOutput
      try {
        result = typeof content === 'string' ? JSON.parse(content) : content
        return result
      }
      catch (e: any) {
        throw new Error(`Invalid response format: ${e.message}`)
      }
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
    finally {
      processing.value = false
    }
  }

  /**
   * Generate a list of educational and psychological goals for a given article topic (in Persian, as a list)
   * @param {string} topic - موضوع مقاله یا خلاصه کوتاه
   * @returns {Promise<string>} - لیست اهداف به صورت رشته چندخطی
   */
  async function generateGoalsList(topic: string): Promise<string> {
    const prompt = `با توجه به موضوع زیر، یک لیست از اهداف آموزشی و روانشناختی که خواننده پس از مطالعه این مقاله به دست می‌آورد به زبان فارسی بنویس. تاکید: خروجی باید فقط یک لیست باشد و هر هدف در یک خط مجزا نوشته شود.\nموضوع: ${topic}`
    const messages = [
      { role: 'system', content: 'شما یک دستیار متخصص تولید محتوای روانشناسی هستید.' },
      { role: 'user', content: prompt },
    ]
    let result = ''
    await streamChat(messages as ChatMessage[], {}, (chunk) => {
      result += chunk.choices?.[0]?.delta?.content || ''
    }, undefined, undefined)
    return result
  }

  /**
   * Generate therapy session goals based on previous sessions and user history
   */
  async function generateGoalsFromHistory(data: {
    userId: string
    sessionId: string
    sessionHistory: any[]
    goalTemplates: any[]
  }) {
    processing.value = true
    error.value = null

    try {
      // Validate inputs
      if (!config.public.openRouterApiKey) {
        throw new Error('OpenRouter API key is missing')
      }
      
      if (!selectedModel.value) {
        throw new Error('No model selected')
      }
      
      if (!data.sessionHistory || data.sessionHistory.length === 0) {
        throw new Error('No session history provided')
      }
      
      console.log('Generating goals with:', {
        model: selectedModel.value,
        sessionCount: data.sessionHistory.length,
        templateCount: data.goalTemplates.length
      })

      const requestBody = {
        model: selectedModel.value,
        messages: [
          {
            role: 'system',
            content: `شما یک روانشناس متخصص هستید که در تعیین اهداف درمانی برای جلسات مشاوره تخصص دارید. 
            بر اساس تاریخچه جلسات قبلی، اهداف مناسب برای جلسه فعلی تعیین کنید. 
            اهداف باید شامل اهداف کلی (general) و اهداف خاص (specific) باشد.
            اهداف باید قابل اندازه‌گیری، قابل دستیابی و منطقی باشند.`
          },
          {
            role: 'user',
            content: `تاریخچه جلسات قبلی:
${data.sessionHistory.map((session, index) => `
جلسه ${index + 1} (${session.date}):
- تحلیل: ${session.analysis}
- احساسات: ${session.emotions}
- موضوعات: ${session.topics}
- دستاوردها: ${session.achievements}
`).join('\n')}

قالب‌های اهداف موجود:
${data.goalTemplates.map(template => `
- ${template.title}: ${template.description}
  دسته‌بندی: ${template.category}
  رفتارهای هدف: ${template.target_behaviors.join(', ')}
  معیارهای موفقیت: ${template.success_criteria.join(', ')}
`).join('\n')}

لطفاً 3-5 هدف مناسب برای جلسه فعلی تعیین کنید. 

مهم: خروجی باید دقیقاً JSON معتبر باشد، بدون کد بلاک یا متن اضافی:

{
  "goals": [
    {
      "title": "عنوان هدف",
      "description": "توضیح کامل هدف",
      "goal_type": "general",
      "priority": "high",
      "target_behaviors": ["رفتار1", "رفتار2"],
      "success_criteria": ["معیار1", "معیار2"],
      "category": "emotional"
    }
  ]
}

نکته: goal_type فقط می‌تواند "general" یا "specific" باشد، priority فقط می‌تواند "high", "medium", یا "low" باشد و category فقط می‌تواند "emotional", "social", "anxiety", "depression", یا "self_worth" باشد.`
          }
        ] as ChatMessage[],
        // Force structured output for OpenAI models that support it
        ...(selectedModel.value.includes('gpt-4') || selectedModel.value.includes('gpt-3.5') ? {
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'therapy_goals',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  goals: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        goal_type: { type: 'string', enum: ['general', 'specific'] },
                        priority: { type: 'string', enum: ['high', 'medium', 'low'] },
                        target_behaviors: { type: 'array', items: { type: 'string' } },
                        success_criteria: { type: 'array', items: { type: 'string' } },
                        category: { type: 'string', enum: ['emotional', 'social', 'anxiety', 'depression', 'self_worth'] }
                      },
                      required: ['title', 'description', 'goal_type', 'priority', 'target_behaviors', 'success_criteria', 'category']
                    }
                  }
                },
                required: ['goals']
              }
            }
          }
        } : {
          // For non-OpenAI models, use regular JSON mode
          response_format: { type: 'json_object' }
        })
      }
      
      console.log('Request body:', JSON.stringify(requestBody, null, 2))
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.public.openRouterApiKey}`,
          'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
          'X-Title': 'Therapy Goals Generator',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenRouter API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('OpenRouter API Response:', result)
      
      if (!result.choices || !result.choices[0] || !result.choices[0].message) {
        throw new Error('Invalid response format from OpenRouter API')
      }
      
      const content = result.choices[0].message.content
      if (!content) {
        throw new Error('Empty response content from OpenRouter API')
      }
      
      try {
        return JSON.parse(content)
      } catch (parseError) {
        console.error('Failed to parse JSON response:', content)
        
        // Try to extract JSON from markdown code blocks
        let cleanContent = content
        const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
        if (codeBlockMatch) {
          cleanContent = codeBlockMatch[1].trim()
          console.log('Extracted JSON from code block:', cleanContent)
        }
        
        // Try to extract JSON from the response if it contains extra text
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            return JSON.parse(jsonMatch[0])
          } catch (secondParseError) {
            console.error('Failed to parse extracted JSON:', jsonMatch[0])
          }
        }
        
        // If still failing, try the original content without code blocks
        try {
          return JSON.parse(cleanContent)
        } catch (finalParseError) {
          console.error('All JSON parsing attempts failed')
          throw new Error(`Failed to parse JSON response: ${parseError}`)
        }
      }
    } catch (e: any) {
      error.value = e.message
      console.error('Full error in generateGoalsFromHistory:', e)
      throw e
    } finally {
      processing.value = false
    }
  }

  /**
   * Evaluate goal progress based on session messages
   */
  async function evaluateGoalProgress(data: {
    goal: any
    sessionMessages: any[]
    previousProgress: number
  }) {
    processing.value = true
    error.value = null

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.public.openRouterApiKey}`,
          'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
          'X-Title': 'Goal Progress Evaluator',
        },
        body: JSON.stringify({
          model: selectedModel.value,
          messages: [
            {
              role: 'system',
              content: `شما یک روانشناس متخصص هستید که پیشرفت اهداف درمانی را ارزیابی می‌کنید.
              بر اساس پیام‌های جلسه و هدف تعیین شده، میزان پیشرفت را تحلیل کنید.
              پیشرفت را بر اساس رفتارهای هدف و معیارهای موفقیت اندازه‌گیری کنید.`
            },
            {
              role: 'user',
              content: `هدف مورد ارزیابی:
عنوان: ${data.goal.title}
توضیح: ${data.goal.description}
رفتارهای هدف: ${data.goal.target_behaviors?.join(', ')}
معیارهای موفقیت: ${data.goal.success_criteria?.join(', ')}
پیشرفت قبلی: ${data.previousProgress}%

پیام‌های جلسه:
${data.sessionMessages.map((msg, index) => `${index + 1}. ${msg.type === 'sent' ? 'کاربر' : 'مشاور'}: ${msg.text}`).join('\n')}

لطفاً پیشرفت هدف را ارزیابی کنید:
{
  "progress_percentage": عدد بین 0 تا 100,
  "status": "pending|in_progress|achieved|partially_achieved|modified",
  "evaluation": "تحلیل کامل پیشرفت",
  "behavior_changes": ["تغییر رفتاری 1", "تغییر رفتاری 2"],
  "recommendations": ["پیشنهاد 1", "پیشنهاد 2"]
}`
            }
          ] as ChatMessage[],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'goal_evaluation',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  progress_percentage: { type: 'number', minimum: 0, maximum: 100 },
                  status: { type: 'string', enum: ['pending', 'in_progress', 'achieved', 'partially_achieved', 'modified'] },
                  evaluation: { type: 'string' },
                  behavior_changes: { type: 'array', items: { type: 'string' } },
                  recommendations: { type: 'array', items: { type: 'string' } }
                },
                required: ['progress_percentage', 'status', 'evaluation']
              }
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return JSON.parse(result.choices[0].message.content)
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      processing.value = false
    }
  }

  // Initialize models on composable creation
  onMounted(() => {
    fetchModels()
  })

  return {
    // Chat functionality
    streamChat,
    processing,
    // Models functionality
    models: allModels,
    selectedModel,
    loading,
    error,
    searchQuery,
    filteredModels,
    retryFetch: fetchModels,

    // Patient generation
    generate,
    generateTherapist,
    generateInlineAnalysis,
    generateGoalsList,
    
    // Goal generation and evaluation
    generateGoalsFromHistory,
    evaluateGoalProgress,
  }
}
