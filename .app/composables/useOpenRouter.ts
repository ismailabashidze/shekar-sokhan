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

export interface TherapistGenerateInput {
  name: string
  specialty: string
  shortDescription: string
}

export interface TherapistGenerateOutput {
  longDescription: string
  definingTraits: string
  backStory: string
  personality: string
  appearance: string
  approach: string
  expertise: string
}

export function useOpenRouter() {
  const config = useRuntimeConfig()

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
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${config.public.openRouterApiKey}`,
          'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
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

      const messagesWithSystem = systemMessage
        ? messages
        : [{ role: 'system', content: systemPrompt }, ...messages]

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.public.openRouterApiKey}`,
          'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
          'X-Title': 'Therapist Chat',
        },
        body: JSON.stringify({
          model: options.model || selectedModel.value,
          messages: messagesWithSystem,
          stream: true,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 0,
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
                 
                  lastMessage_primaryEmotions: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: ['شادی', 'اعتماد', 'ترس', 'تعجب', 'غم', 'انزجار', 'خشم', 'انتظار', 'نامشخص'],
                    },
                    description: 'Primary emotions identified in the last message based on Plutchik\'s wheel (e.g., Joy, Trust, Fear).',
                  },
                  lastMessage_nuancedEmotions: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: [
                        'Ecstasy', 'Serenity', 'Admiration', 'Acceptance', 'Terror', 'Apprehension',
                        'Amazement', 'Distraction', 'Grief', 'Pensiveness', 'Loathing', 'Boredom',
                        'Rage', 'Annoyance', 'Vigilance', 'Interest', 'Love', 'Submission', 'Awe',
                        'Disapproval', 'Remorse', 'Contempt', 'Aggressiveness', 'Optimism', 'Unspecified',
                      ],
                    },
                    description: 'Nuanced emotions identified in the last message based on Plutchik\'s wheel (e.g., Ecstasy, Admiration, Terror).',
                  },
                  lastMessage_emotionIntensity: {
                    type: 'string',
                    enum: ['High', 'Medium', 'Low'],
                    description: 'Overall intensity of the detected emotions in the last message.',
                  },
                  emotionalResponse: {
                    type: 'string',
                    description: 'پاسخ پیشنهادی مبتنی بر تحلیل احساسات کاربر جهت بازتاب و درک عمیق‌تر. مثال: اگر کاربر ترسیده، واکنش مناسب آرام سازی و دلگرم کردن اوست. اگر خشمگین است، می‌توان پرسید "آیا احساس خشم می‌کنی؟" یا گفت "به نظر می‌رسد خشم را در خودت احساس می‌کنی." اگر احساس نامشخص است، می‌توان پرسید "می‌توانی بیشتر در مورد احساست توضیح دهی؟ این پاسخ باید به فارسی باشد."',
                  },
                },
                required: [
                  'lastMessage_primaryEmotions',
                  'lastMessage_nuancedEmotions',
                  'lastMessage_emotionIntensity',
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
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.public.openRouterApiKey}`,
          'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
          'X-Title': 'Patient Details Generator',
        },
        body: JSON.stringify({
          model: selectedModel.value,
          messages: [
            {
              role: 'system',
              content: 'شما یک دستیار روانشناس هستید که در تولید اطلاعات بیمار کمک می‌کند. لطفا با توجه به اطلاعات اولیه بیمار، سایر جزئیات را به صورت منطقی و به زبان فارسی تولید کنید.',
            },
            {
              role: 'user',
              content: `اطلاعات اولیه بیمار:
نام: ${input.name}
سن: ${input.age}
توضیح کوتاه: ${input.shortDescription}

لطفا جزئیات زیر را تولید کنید:
- توضیح بلند
- صفات تعریف کننده
- داستان زندگی
- شخصیت
- ظاهر
- انگیزه
- وضعیت هیجانی حال حاضر

خروجی باید به صورت یک آبجکت JSON با کلیدهای زیر باشد:
longDescription, definingTraits, backStory, personality, appearance, motivation, moodAndCurrentEmotions
`,
            },
          ] as ChatMessage[], // Add type assertion here
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'patient_details',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  longDescription: {
                    type: 'string',
                    description: 'توضیح بلند و کامل در مورد بیمار و وضعیت او',
                  },
                  definingTraits: {
                    type: 'string',
                    description: 'صفات و ویژگی‌های تعریف‌کننده شخصیت و رفتار بیمار',
                  },
                  backStory: {
                    type: 'string',
                    description: 'داستان زندگی، پیشینه و تجربیات مهم بیمار',
                  },
                  personality: {
                    type: 'string',
                    description: 'شخصیت، رفتارها و خصوصیات روانشناختی بیمار',
                  },
                  appearance: {
                    type: 'string',
                    description: 'توصیف ظاهری و ویژگی‌های فیزیکی بیمار',
                  },
                  motivation: {
                    type: 'string',
                    description: 'انگیزه‌ها، اهداف و خواسته‌های اصلی بیمار',
                  },
                  moodAndCurrentEmotions: {
                    type: 'string',
                    description: 'حالت روحی، احساسات و وضعیت عاطفی فعلی بیمار',
                  },
                },
                required: [
                  'longDescription',
                  'definingTraits',
                  'backStory',
                  'personality',
                  'appearance',
                  'motivation',
                  'moodAndCurrentEmotions',
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

      let result: PatientGenerateOutput
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
    })
    return result
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
  }
}
