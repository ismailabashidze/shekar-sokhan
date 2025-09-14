import { useNuxtApp, useRuntimeConfig } from '#app'
import { ref } from 'vue'

export interface DemographicData {
  firstName: string
  lastName: string
  age: number
  gender: 'male' | 'female' | 'other'
  education:
    | 'under diploma'
    | 'diploma'
    | 'bachelor'
    | 'master'
    | 'phd'
    | 'other'
  occupation:
    | 'student'
    | 'employed'
    | 'self-employed'
    | 'single'
    | 'married'
    | 'divorced'
    | 'widowed'
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
    } catch (error: any) {
      console.error('Error creating session analysis:', error)
      throw error
    }
  }

  const getAnalysisById = async (id: string) => {
    try {
      return await pb.collection('session_analysis_for_system').getOne(id, {
        expand: 'session, session.user, session.therapist',
      })
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Error listing session analysis:', error)
      throw error
    }
  }

  const updateAnalysis = async (id: string, data: Partial<SessionAnalysis>) => {
    try {
      return await pb.collection('session_analysis_for_system').update(id, data)
    } catch (error: any) {
      console.error('Error updating session analysis:', error)
      throw error
    }
  }

  const deleteAnalysis = async (id: string) => {
    try {
      return await pb.collection('session_analysis_for_system').delete(id)
    } catch (error: any) {
      console.error('Error deleting session analysis:', error)
      throw error
    }
  }

  // Helper function to make API requests to OpenRouter
  const makeOpenRouterRequest = async (
    messages: any[],
    schema: any,
    maxTokens = 1000,
  ) => {
    // Try a more reliable model first
    const models = ['google/gemma-3-27b-it']
    let currentModelIndex = 0
    
    const requestBody = (model: string) => ({
      model,
      messages,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'session_analysis_part',
          strict: true,
          schema,
        },
      },
      temperature: 0.7,
      // Increase max_tokens significantly and add a buffer
      max_tokens: maxTokens * 2, // Double the tokens to prevent truncation
      plugins: [],
      transforms: ['middle-out'],
    })

    // Implement timeout mechanism similar to useOpenRouter.ts
    let response: Response | null = null
    let attempts = 0
    const maxAttempts = 3 // Initial attempt + 2 retries
    const startTime = Date.now()

    while (attempts < maxAttempts) {
      attempts++
      const attemptStartTime = Date.now()
      const elapsedSinceStart = Math.round(
        (attemptStartTime - startTime) / 1000,
      )
      console.log(
        `⏳ Attempt ${attempts}/${maxAttempts} to generate session analysis part (Elapsed: ${elapsedSinceStart}s)`,
      )

      try {
        // Use a custom HTTP agent to handle HTTP2 protocol issues
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 120000) // 120 second timeout

        const currentModel = models[currentModelIndex]
        console.log(`🔄 Trying model: ${currentModel} with max_tokens: ${maxTokens * 2}`)
        
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
              useRuntimeConfig().public.openRouterApiKey
            }`,
            'HTTP-Referer':
              useRuntimeConfig().public.appUrl || 'http://localhost:3000',
            'X-Title': 'Session Analysis Generator',
          },
          body: JSON.stringify(requestBody(currentModel)),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        console.log(`✅ Request successful on attempt ${attempts}`)
        // If we get here, the request was successful
        // Check if response is valid before breaking
        if (response && response.ok) {
          break
        } else if (response) {
          // If response exists but is not ok, throw error to trigger retry
          const errorText = await response.text()
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }
      } catch (e: any) {
        console.log(`❌ Attempt ${attempts} failed:`, e)
        
        // Handle specific network errors
        if (e.name === 'AbortError') {
          console.log('⏰ Request timeout after 120 seconds')
          throw new Error('Request timeout after 120 seconds')
        }
        
        // Handle network errors that might be related to HTTP2
        if (e.message && (e.message.includes('HTTP2') || e.message.includes('net::'))) {
          console.log('🔄 HTTP/2 protocol error detected, trying different model...')
          // Try with a different model on HTTP2 errors
          if (currentModelIndex < models.length - 1) {
            currentModelIndex++
            console.log(`🔄 Switching to model: ${models[currentModelIndex]}`)
            attempts = 0 // Reset attempts when switching models
            continue
          }
        }
        
        if (attempts >= maxAttempts) {
          // Last attempt failed, re-throw the error
          throw e
        }
        // Retry after 1 second
        console.log('🔄 Retrying in 1 second...')
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Additional check to ensure we have a valid response
    if (!response) {
      throw new Error('No response received from OpenRouter API after all attempts')
    }

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage: string
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData?.error?.message || errorData?.message || errorText
      } catch {
        errorMessage = errorText
      }
      throw new Error(`OpenRouter API error: ${errorMessage}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    // Validate that we have content to parse
    if (!content) {
      console.error('No content in response:', data)
      throw new Error('Empty response content from OpenRouter API')
    }

    // Parse the JSON response with better error handling
    try {
      // Handle case where content might be wrapped in markdown code blocks
      let cleanedContent = content.trim()
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.substring(7).trim()
      }
      if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.substring(3).trim()
      }
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.slice(0, -3).trim()
      }
      
      // Handle truncated JSON responses
      let parsed
      try {
        parsed = typeof cleanedContent === 'string' ? JSON.parse(cleanedContent) : cleanedContent
      } catch (parseError: any) {
        // If JSON parsing fails due to truncation, try to fix common truncation issues
        console.warn('JSON parsing failed, attempting to fix truncated response...')
        
        // Try to fix truncated strings by closing them
        let fixedContent = cleanedContent
        
        // Check if we have an unterminated string (most common issue)
        const quoteCount = (fixedContent.match(/"/g) || []).length
        if (quoteCount % 2 !== 0) {
          // We have an odd number of quotes, likely an unterminated string
          console.log('Detected unterminated string, attempting to fix...')
          
          // Find the last quote and see if it's properly closed
          const lastQuoteIndex = fixedContent.lastIndexOf('"')
          if (lastQuoteIndex > 0) {
            // Check if there's a comma or closing brace/bracket after the last quote
            const afterQuote = fixedContent.substring(lastQuoteIndex + 1)
            if (afterQuote.trim() === '' || 
                (afterQuote.trim().startsWith('}') && !afterQuote.includes('{')) ||
                (afterQuote.trim().startsWith(']') && !afterQuote.includes('['))) {
              // Likely an unterminated string, try to close it
              fixedContent = fixedContent.substring(0, lastQuoteIndex + 1) + 
                            '"' + 
                            fixedContent.substring(lastQuoteIndex + 1)
            }
          }
        }
        
        // Try to find the last complete object or array and close it properly
        const braceStack: string[] = []
        let inString = false
        let escapeNext = false
        
        for (let i = 0; i < fixedContent.length; i++) {
          const char = fixedContent[i]
          
          if (escapeNext) {
            escapeNext = false
            continue
          }
          
          if (char === '\\\\') {
            escapeNext = true
            continue
          }
          
          if (char === '"' && !escapeNext) {
            inString = !inString
            continue
          }
          
          if (inString) continue
          
          if (char === '{' || char === '[') {
            braceStack.push(char)
          } else if (char === '}' || char === ']') {
            if (braceStack.length > 0) {
              braceStack.pop()
            }
          }
        }
        
        // Close any unclosed braces/brackets
        while (braceStack.length > 0) {
          const lastOpen = braceStack.pop()
          if (lastOpen === '{') {
            fixedContent += '}'
          } else if (lastOpen === '[') {
            fixedContent += ']'
          }
        }
        
        // Try parsing the fixed content
        try {
          parsed = JSON.parse(fixedContent)
          console.log('✅ Successfully parsed fixed JSON response')
        } catch (fixedParseError) {
          console.error('Failed to parse fixed JSON response:', fixedContent)
          throw new Error(`Invalid JSON response even after fixing: ${fixedParseError.message}. Original error: ${parseError.message}`)
        }
      }
      
      return parsed
    } catch (e: any) {
      console.error('Failed to parse JSON response:', content)
      console.error('Cleaned content:', cleanedContent)
      // Return a default structure to prevent complete failure
      throw new Error(`Invalid JSON response: ${e.message}. Response content: ${content.substring(0, 200)}...`)
    }
  }

  // Individual analysis functions
  const getSessionOverview = async (messages: any[]) => {
    const systemMessage =
      'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا با بررسی پیام‌های جلسه، عنوان، خلاصه و تیترهای جلسه را استخراج کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن باشند.'

    const schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description:
            'عنوان یا موضوع جلسه، بر اساس محتوا و موضوعات مطرح شده در جلسه',
        },
        summaryOfSession: {
          type: 'string',
          description: 'خلاصه جامعی از جلسه درمانی',
          maxLength: 1000,
        },
        headlines: {
          type: 'array',
          description:
            'فهرستی دقیقاً شامل ۴ تیتر که جلسه درمانی را نشان می دهد',
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
      },
      required: ['title', 'summaryOfSession', 'headlines'],
    }

    // Reduce max tokens to prevent truncation
    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      500, // Reduced from 800 to 500 to prevent truncation
    )
  }

  const getTrustAndOpennessAnalysis = async (messages: any[]) => {
    const systemMessage =
      'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا سطح اعتماد و صراحت کاربر را نسبت به روان شناس هوش مصنوعی تحلیل کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن باشند.'

    const schema = {
      type: 'object',
      properties: {
        finalTrustAndOppennessOfUser: {
          type: 'string',
          enum: ['veryHigh', 'high', 'low', 'veryLow'],
          description:
            'سطح اعتماد و صراحتی که کاربر نسبت به این روان شناس هوش مصنوعی در طول این جلسه نشان داده است',
        },
        finalTrustAndOppennessOfUserEvaluationDescription: {
          type: 'string',
          description:
            'توضیح دقیق ارزیابی اعتماد و صراحت به همراه شواهدی درباره اعتماد و صراحت کاربر نسبت به این روان شناس هوش مصنوعی',
        },
      },
      required: [
        'finalTrustAndOppennessOfUser',
        'finalTrustAndOppennessOfUserEvaluationDescription',
      ],
    }

    // Reduce token limit to prevent truncation and allow buffer
    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      400, // Significantly reduced from 800 to 400 to prevent truncation
    )
  }

  const getTherapistEvaluation = async (messages: any[]) => {
    const systemMessage =
      'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا عملکرد روان شناس را ارزیابی کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن باشند.'

    const schema = {
      type: 'object',
      properties: {
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
                description:
                  'تعداد امتیازات کسر شده برای اشتباه یا خطای روان شناس. توجه داشته باشید که این اشتباهات حرفه ای هستند و باید دقیق و محکم باشند',
                minimum: 10,
                maximum: 20,
              },
              cause: {
                type: 'string',
                description:
                  'خطای خاص یا اشتباهی که روان شناس مرتکب شده و منجر به کسر امتیاز شده است',
              },
            },
            required: ['points', 'cause'],
          },
          description:
            'فهرستی از مسائل عملکردی که امتیاز کلی درمانگر را کاهش می دهد. امتیاز نهایی (psychotherapistEvaluationScore) باید به صورت ۱۰۰ منهای مجموع تمام امتیازات کسر شده محاسبه شود.',
          minItems: 0,
          maxItems: 5,
        },
        psychotherapistEvaluationScorePositiveBehavior: {
          type: 'array',
          items: {
            type: 'string',
            description: 'رفتار مثبتی که توسط روان شناس نشان داده شده است',
          },
          description:
            'فهرستی از رفتارهای مثبتی که روان شناس در طول جلسه نشان داده است. دقیقاً باید آرایه ای از رشته ها باشد',
          minItems: 0,
          maxItems: 5,
        },
        psychotherapistEvaluationScoreSuggestionsToImprove: {
          type: 'array',
          items: {
            type: 'string',
            description: 'پیشنهادی برای بهبود عملکرد روان شناس',
          },
          description:
            'فهرستی از پیشنهادات برای بهبود عملکرد روان شناس. دقیقاً باید آرایه ای از رشته ها باشد',
          minItems: 3,
          maxItems: 5,
        },
      },
      required: [
        'psychotherapistEvaluation',
        'negativeScoresList',
        'psychotherapistEvaluationScorePositiveBehavior',
        'psychotherapistEvaluationScoreSuggestionsToImprove',
      ],
    }

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      600, // Reduced from 1200 to 600 to prevent truncation
    )
  }

  const getBehavioralAnalysis = async (messages: any[]) => {
    const systemMessage =
      'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا الگوهای رفتاری بیمار و شواهد را تحلیل کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن باشند.'

    const schema = {
      type: 'object',
      properties: {
        behavioralAnalysisSummary: {
          type: 'string',
          description:
            'تحلیل الگوهای رفتاری بیمار و شواهد. قویاً باید بر اساس تحلیل رفتاری باشد. اگر مطمئن نیستید خالی بگذارید',
        },
      },
      required: ['behavioralAnalysisSummary'],
    }

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      400, // Reduced from 800 to 400 to prevent truncation
    )
  }

  const getEmotionalAnalysis = async (messages: any[]) => {
    const systemMessage =
      'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا حالت ها و الگوهای احساسی بیمار را تحلیل کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن باشند.'

    const schema = {
      type: 'object',
      properties: {
        emotionalAnalysisSummary: {
          type: 'string',
          description:
            'تحلیل حالت ها و الگوهای احساسی بیمار. قویاً باید بر اساس تحلیل احساسی باشد. اگر مطمئن نیستید خالی بگذارید',
        },
      },
      required: ['emotionalAnalysisSummary'],
    }

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      800,
    )
  }

  const getThoughtsAndConcerns = async (messages: any[]) => {
    const systemMessage =
      'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا افکار و نگرانی های اصلی بیمار را خلاصه کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد.'

    const schema = {
      type: 'object',
      properties: {
        thoughtsAndConcernsSummary: {
          type: 'string',
          description:
            'خلاصه ای از افکار و نگرانی های اصلی بیمار. اگر مطمئن نیستید خالی بگذارید',
        },
      },
      required: ['thoughtsAndConcernsSummary'],
    }

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      800,
    )
  }

  const getPsychoAnalysis = async (messages: any[]) => {
    const systemMessage =
      'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا تفسیر روانکاوی جلسه را ارائه دهید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد.'

    const schema = {
      type: 'object',
      properties: {
        psychoAnalysis: {
          type: 'string',
          description:
            'تفسیر روانکاوی جلسه. باید مفصل و از دیدگاه روانکاوی باشد. افکار، احساسات و تجربیات ناخودآگاه همراه با من، خود و فراخود. این تحلیل باید به زبان فارسی باشد.',
        },
        possibleDeeperGoalsOfPatient: {
          type: 'string',
          description:
            'تحلیل اهداف یا انگیزه های عمیق تر و پنهان بیمار که ممکن است به طور صریح بیان نشده باشد، بر اساس موضوعات مطرح شده در جلسه. این توضیح باید به زبان فارسی باشد.',
        },
      },
      required: ['psychoAnalysis', 'possibleDeeperGoalsOfPatient'],
    }

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      1200,
    )
  }

  const getDefenseMechanisms = async (messages: any[]) => {
    const systemMessage =
      'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا مکانیسم های دفاعی شناسایی شده در طول جلسه را تحلیل کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد.'

    const schema = {
      type: 'object',
      properties: {
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
                description:
                  'بخشی از پیام دقیق کاربر که حاوی شواهد این مکانیسم دفاعی است. باید پیام دقیق کاربر باشد، نه چیز دیگری. به عنوان شواهدی برای این مکانیسم دفاعی',
              },
            },
            required: ['name', 'confidence', 'evidence'],
          },
          description:
            'فهرستی از مکانیسم های دفاعی شناسایی شده در طول جلسه با سطوح اطمینان و شواهد پشتیبان. اگر چیزی شناسایی نشد یا مطمئن نیستید از name: no_data استفاده کنید.',
        },
      },
      required: ['detectedDefenceMechanisms'],
    }

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      1000,
    )
  }

  const getSchemas = async (messages: any[]) => {
    const systemMessage =
      'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا الگوهای شناسایی شده در طول جلسه بر اساس نظریه الگوهای یانگ را تحلیل کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد.'

    const schema = {
      type: 'object',
      properties: {
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
                description:
                  'شواهد و نمونه هایی که توسط بیمار ذکر شده و این الگو را پشتیبانی می کند',
              },
            },
            required: ['name', 'confidence', 'evidence'],
          },
          description:
            'فهرستی از الگوهای شناسایی شده در طول جلسه بر اساس نظریه الگوهای یانگ با سطوح اطمینان و شواهد پشتیبان. اگر چیزی شناسایی نشد یا مطمئن نیستید از name: no_data استفاده کنید.',
        },
      },
      required: ['detectedSchemas'],
    }

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      1000,
    )
  }

  const getDemographicData = async (messages: any[]) => {
    const systemMessage =
      'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا اطلاعات دموگرافیک بیمار را از جلسه استخراج کنید.خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد.'

    const schema = {
      type: 'object',
      properties: {
        demographicData: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              description:
                'نام کوچک بیمار، اگر ذکر نشده باشد می تواند null باشد',
              nullable: true,
            },
            lastName: {
              type: 'string',
              description:
                'نام خانوادگی بیمار، اگر ذکر نشده باشد می تواند null باشد',
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
              description:
                'جنسیت بیمار، اگر نام ارائه شده باشد از روی آن استخراج کنید. اگر مطمئن نیستید از null استفاده کنید.',
              nullable: true,
            },
            education: {
              type: 'string',
              enum: [
                'under diploma',
                'diploma',
                'bachelor',
                'master',
                'phd',
                'other',
              ],
              description:
                'سطح تحصیلات بیمار، اگر ذکر نشده باشد می تواند null باشد',
              nullable: true,
            },
            occupation: {
              type: 'string',
              enum: [
                'student',
                'employed',
                'self-employed',
                'unemployed',
                'retired',
                'householder',
                'other',
              ],
              description: 'شغل بیمار، اگر ذکر نشده باشد می تواند null باشد',
              nullable: true,
            },
            maritalStatus: {
              type: 'string',
              enum: ['single', 'married', 'divorced', 'widowed', null],
              description:
                'وضعیت تاهل بیمار، اگر ذکر نشده باشد می تواند null باشد',
              nullable: true,
            },
          },
          description:
            'اطلاعات دموگرافیک درباره بیمار که از جلسه استخراج شده است',
        },
      },
      required: ['demographicData'],
    }

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      800,
    )
  }

  const getNextSteps = async (messages: any[]) => {
    const systemMessage =
      'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا مراحل پیشنهادی بعدی برای درمانگر را ارائه دهید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد.'

    const schema = {
      type: 'object',
      properties: {
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
          description:
            'فهرستی از مراحل پیشنهادی بعدی برای درمانگر که باید در جلسه بعدی مدنظر قرار گیرد. باید منحصر به فرد و بدون تکرار باشد',
          minItems: 3,
          maxItems: 5,
        },
      },
      required: ['suggestedNextStepsForTherapistForNextSession'],
    }

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      1000,
    )
  }

  const getRiskFactors = async (messages: any[]) => {
    const systemMessage =
      'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا عوامل ریسک شناسایی شده در طول جلسه را تحلیل کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد.'

    const schema = {
      type: 'object',
      properties: {
        possibleRiskFactorsExtracted: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description:
                  'عنوان عامل ریسک شناسایی شده که نیاز به توجه بیشتر دارد',
              },
              description: {
                type: 'string',
                description:
                  'توضیح مفصل عامل ریسک شامل افکار، رفتارها یا باورهای نگران کننده بیمار که ممکن است نشان از آسیب به خود یا دیگران داشته باشد و نیاز به مداخله حرفه ای بیشتر دارد',
              },
            },
            required: ['title', 'description'],
          },
          description:
            'فهرستی از عوامل ریسک شناسایی شده در طول جلسه مرتبط با افکار، رفتارها یا باورهای بیمار که ممکن است نیاز به توجه یا مداخله حرفه ای بیشتر داشته باشد. باید منحصر به فرد و بدون تکرار باشد',
          minItems: 1,
          maxItems: 5,
        },
      },
      required: ['possibleRiskFactorsExtracted'],
    }

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      1000,
    )
  }

  const generateAnalysis = async ({
    sessionId,
    messages,
  }: {
    sessionId: string
    messages: any[]
  }) => {
    processing.value = true
    error.value = null

    try {
      console.log(
        '🔍 Starting session analysis generation for session:',
        sessionId,
      )
      console.log('📨 Number of messages to analyze:', messages.length)

      // Log the first few messages for debugging
      console.log(
        '📋 First 3 messages:',
        messages.slice(0, 3).map((m) => ({
          role: m.role,
          content: m.content?.substring(0, 100) + '...',
        })),
      )

      // Run all analysis functions with individual error handling
      console.log('🔄 Starting analysis requests...')
      
      // Run critical analysis functions first
      const [
        overview,
        trustAndOpenness,
        therapistEvaluation,
        behavioralAnalysis,
        emotionalAnalysis,
        thoughtsAndConcerns,
        psychoAnalysis,
        defenseMechanisms,
        schemas,
        demographicData,
        nextSteps,
        riskFactors,
      ] = await Promise.allSettled([
        getSessionOverview(messages),
        getTrustAndOpennessAnalysis(messages),
        getTherapistEvaluation(messages),
        getBehavioralAnalysis(messages),
        getEmotionalAnalysis(messages),
        getThoughtsAndConcerns(messages),
        getPsychoAnalysis(messages),
        getDefenseMechanisms(messages),
        getSchemas(messages),
        getDemographicData(messages),
        getNextSteps(messages),
        getRiskFactors(messages),
      ])

      // Process results and handle errors
      const results: any = {}
      
      // Helper function to process Promise.allSettled results
      const processResult = (result: PromiseSettledResult<any>, key: string, defaultValue: any = {}) => {
        if (result.status === 'fulfilled') {
          console.log(`✅ ${key} analysis completed successfully`)
          return result.value
        } else {
          console.error(`❌ ${key} analysis failed:`, result.reason)
          // Return a default structure to prevent complete failure
          return defaultValue
        }
      }

      // Process each analysis with appropriate default values
      results.overview = processResult(overview, 'Session overview', {
        title: 'جلسه مشاوره',
        summaryOfSession: 'به دلیل خطای تحلیل، خلاصه جلسه در دسترس نیست',
        headlines: []
      })
      
      results.trustAndOpenness = processResult(trustAndOpenness, 'Trust and openness', {
        finalTrustAndOppennessOfUser: 'unknown',
        finalTrustAndOppennessOfUserEvaluationDescription: 'به دلیل خطای تحلیل، ارزیابی سطح اعتماد در دسترس نیست',
        trustLevelProgression: [],
        opennessLevelProgression: []
      })
      
      results.therapistEvaluation = processResult(therapistEvaluation, 'Therapist evaluation', {
        psychotherapistEvaluation: 'به دلیل خطای تحلیل، ارزیابی عملکرد روانشناس در دسترس نیست',
        negativeScoresList: [],
        psychotherapistEvaluationScorePositiveBehavior: [],
        psychotherapistEvaluationScoreSuggestionsToImprove: []
      })
      
      results.behavioralAnalysis = processResult(behavioralAnalysis, 'Behavioral analysis', {
        behavioralAnalysisSummary: 'به دلیل خطای تحلیل، تحلیل رفتاری در دسترس نیست'
      })
      
      results.emotionalAnalysis = processResult(emotionalAnalysis, 'Emotional analysis', {
        emotionalAnalysisSummary: 'به دلیل خطای تحلیل، تحلیل احساسی در دسترس نیست'
      })
      
      results.thoughtsAndConcerns = processResult(thoughtsAndConcerns, 'Thoughts and concerns', {
        thoughtsAndConcernsSummary: 'به دلیل خطای تحلیل، خلاصه افکار و نگرانی‌ها در دسترس نیست'
      })
      
      results.psychoAnalysis = processResult(psychoAnalysis, 'Psycho analysis', {
        psychoAnalysis: 'به دلیل خطای تحلیل، تحلیل روانکاوی در دسترس نیست',
        possibleDeeperGoalsOfPatient: 'به دلیل خطای تحلیل، اهداف عمیق‌تر بیمار در دسترس نیست'
      })
      
      results.defenseMechanisms = processResult(defenseMechanisms, 'Defense mechanisms', {
        detectedDefenceMechanisms: []
      })
      
      results.schemas = processResult(schemas, 'Schemas', {
        detectedSchemas: []
      })
      
      results.demographicData = processResult(demographicData, 'Demographic data', {
        demographicData: {
          firstName: null,
          lastName: null,
          age: null,
          gender: null,
          education: null,
          occupation: null,
          maritalStatus: null
        }
      })
      
      results.nextSteps = processResult(nextSteps, 'Next steps', {
        suggestedNextStepsForTherapistForNextSession: []
      })
      
      results.riskFactors = processResult(riskFactors, 'Risk factors', {
        possibleRiskFactorsExtracted: []
      })

      // Combine all results into a single object
      console.log('🔄 Combining analysis results...')
      const combinedResult = {
        ...results.overview,
        ...results.trustAndOpenness,
        ...results.therapistEvaluation,
        ...results.behavioralAnalysis,
        ...results.emotionalAnalysis,
        ...results.thoughtsAndConcerns,
        ...results.psychoAnalysis,
        ...results.defenseMechanisms,
        ...results.schemas,
        ...results.demographicData,
        ...results.nextSteps,
        ...results.riskFactors,
      }

      // Validate required fields and provide defaults if missing
      const validatedResult = {
        title: combinedResult.title || 'جلسه مشاوره',
        summaryOfSession: combinedResult.summaryOfSession || 'به دلیل خطای تحلیل، خلاصه جلسه در دسترس نیست',
        headlines: combinedResult.headlines || [],
        finalTrustAndOppennessOfUser: combinedResult.finalTrustAndOppennessOfUser || 'unknown',
        finalTrustAndOppennessOfUserEvaluationDescription: combinedResult.finalTrustAndOppennessOfUserEvaluationDescription || 'به دلیل خطای تحلیل، ارزیابی سطح اعتماد در دسترس نیست',
        trustLevelProgression: combinedResult.trustLevelProgression || [],
        opennessLevelProgression: combinedResult.opennessLevelProgression || [],
        psychotherapistEvaluation: combinedResult.psychotherapistEvaluation || 'به دلیل خطای تحلیل، ارزیابی عملکرد روانشناس در دسترس نیست',
        negativeScoresList: combinedResult.negativeScoresList || [],
        psychotherapistEvaluationScorePositiveBehavior: combinedResult.psychotherapistEvaluationScorePositiveBehavior || [],
        psychotherapistEvaluationScoreSuggestionsToImprove: combinedResult.psychotherapistEvaluationScoreSuggestionsToImprove || [],
        behavioralAnalysisSummary: combinedResult.behavioralAnalysisSummary || 'به دلیل خطای تحلیل، تحلیل رفتاری در دسترس نیست',
        emotionalAnalysisSummary: combinedResult.emotionalAnalysisSummary || 'به دلیل خطای تحلیل، تحلیل احساسی در دسترس نیست',
        thoughtsAndConcernsSummary: combinedResult.thoughtsAndConcernsSummary || 'به دلیل خطای تحلیل، خلاصه افکار و نگرانی‌ها در دسترس نیست',
        psychoAnalysis: combinedResult.psychoAnalysis || 'به دلیل خطای تحلیل، تحلیل روانکاوی در دسترس نیست',
        possibleDeeperGoalsOfPatient: combinedResult.possibleDeeperGoalsOfPatient || 'به دلیل خطای تحلیل، اهداف عمیق‌تر بیمار در دسترس نیست',
        detectedDefenceMechanisms: combinedResult.detectedDefenceMechanisms || [],
        detectedSchemas: combinedResult.detectedSchemas || [],
        demographicData: combinedResult.demographicData || {
          firstName: null,
          lastName: null,
          age: null,
          gender: null,
          education: null,
          occupation: null,
          maritalStatus: null
        },
        suggestedNextStepsForTherapistForNextSession: combinedResult.suggestedNextStepsForTherapistForNextSession || [],
        possibleRiskFactorsExtracted: combinedResult.possibleRiskFactorsExtracted || [],
        ...combinedResult
      }

      console.log('✅ Session analysis generation completed successfully')
      return validatedResult
    } catch (e: any) {
      console.error('💥 Critical error in generateAnalysis:', e)
      error.value = e.message
      
      // Return a default analysis structure to prevent complete failure
      const defaultAnalysis = {
        title: 'جلسه مشاوره',
        summaryOfSession: 'به دلیل بروز خطا، خلاصه جلسه در دسترس نیست',
        headlines: [],
        finalTrustAndOppennessOfUser: 'unknown',
        finalTrustAndOppennessOfUserEvaluationDescription: 'ارزیابی سطح اعتماد به دلیل خطا در دسترس نیست',
        trustLevelProgression: [],
        opennessLevelProgression: [],
        psychotherapistEvaluation: 'ارزیابی عملکرد روانشناس به دلیل خطا در دسترس نیست',
        negativeScoresList: [],
        psychotherapistEvaluationScorePositiveBehavior: [],
        psychotherapistEvaluationScoreSuggestionsToImprove: [],
        behavioralAnalysisSummary: 'تحلیل رفتاری به دلیل خطا در دسترس نیست',
        emotionalAnalysisSummary: 'تحلیل احساسی به دلیل خطا در دسترس نیست',
        thoughtsAndConcernsSummary: 'خلاصه افکار و نگرانی‌ها به دلیل خطا در دسترس نیست',
        psychoAnalysis: 'تحلیل روانکاوی به دلیل خطا در دسترس نیست',
        possibleDeeperGoalsOfPatient: 'اهداف عمیق‌تر بیمار به دلیل خطا در دسترس نیست',
        detectedDefenceMechanisms: [],
        detectedSchemas: [],
        demographicData: {
          firstName: null,
          lastName: null,
          age: null,
          gender: null,
          education: null,
          occupation: null,
          maritalStatus: null
        },
        suggestedNextStepsForTherapistForNextSession: [],
        possibleRiskFactorsExtracted: []
      }
      
      return defaultAnalysis
    } finally {
      processing.value = false
      console.log('🏁 generateAnalysis function completed')
    }
  }

  const getAnalysisForSession = async (
    sessionId: string,
  ): Promise<SessionAnalysis | null> => {
    try {
      const nuxtApp = useNuxtApp()
      const records = await nuxtApp.$pb
        .collection('session_analysis_for_system')
        .getList(1, 1, {
          filter: `session="${sessionId}"`,
          sort: '-created',
          expand: 'session',
        })

      if (records.items.length > 0) {
        return records.items[0] as unknown as SessionAnalysis
      }
      return null
    } catch (error: any) {
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
