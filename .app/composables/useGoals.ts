import type { TherapyGoal } from './goal'
import type { TherapyAssessment } from './useAssessment'

export function useGoals() {
  const nuxtApp = useNuxtApp()
  const { user } = useUser()
  const config = useRuntimeConfig()

  const streamChatForGoals = async (
    messages: any[],
    onChunk: (chunk: string) => void,
  ) => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.openRouterApiKey}`,
        'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
        'X-Title': 'Therapy Goals Generation',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-saba',
        messages: messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 0,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('Failed to create stream reader')
    }

    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (!trimmedLine || trimmedLine.startsWith(':')) continue

        const data = trimmedLine.startsWith('data: ') ? trimmedLine.slice(6) : trimmedLine

        if (data === '[DONE]') break

        try {
          const parsed = JSON.parse(data)
          const textChunk = parsed?.choices?.[0]?.delta?.content
          if (textChunk) {
            onChunk(textChunk)
          }
        } catch (e) {
          // Ignore parsing errors for streaming
        }
      }
    }
  }

  const getSessionGoals = async (sessionId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      return await nuxtApp.$pb.collection('goals_2').getFullList({
        filter: `session_id = "${sessionId}"`,
        sort: '-created',
      })
    } catch (error) {
      console.error('Error fetching session goals:', error)
      throw error
    }
  }

  const getGoalsByUser = async (userId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      return await nuxtApp.$pb.collection('goals_2').getFullList({
        filter: `user_id = "${userId}"`,
        sort: '-created',
      })
    } catch (error) {
      console.error('Error fetching user goals:', error)
      throw error
    }
  }

  const updateGoalProgress = async (goalId: string, progress: number, status?: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const updateData: any = { 
        progress_percentage: progress,
        updated: new Date().toISOString()
      }
      
      if (status) {
        updateData.status = status
      }

      return await nuxtApp.$pb.collection('goals_2').update(goalId, updateData)
    } catch (error) {
      console.error('Error updating goal progress:', error)
      throw error
    }
  }

  const completeGoal = async (goalId: string) => {
    try {
      return await updateGoalProgress(goalId, 100, 'achieved')
    } catch (error) {
      console.error('Error completing goal:', error)
      throw error
    }
  }

  const saveGoal = async (goalData: any) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const goalRecord = {
        user_id: user.value?.id,
        goals: {
          ...goalData,
          status: goalData.status || 'pending',
          progress_percentage: goalData.progress_percentage || 0
        }
      }
      
      return await nuxtApp.$pb.collection('goals_2').create(goalRecord)
    } catch (error) {
      console.error('Error saving goal:', error)
      throw error
    }
  }

  const saveGoals = async (goals: any[], sessionId?: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const savedGoals = []
      for (const goal of goals) {
        const goalRecord = {
          ...goal,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          user_id: user.value?.id,
          session_id: sessionId,
          status: goal.status || 'pending',
          progress_percentage: goal.progress_percentage || 0
        }
        
        const saved = await nuxtApp.$pb.collection('goals_2').create(goalRecord)
        savedGoals.push(saved)
      }
      return savedGoals
    } catch (error) {
      console.error('Error saving goals:', error)
      throw error
    }
  }

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'muted'
      case 'in_progress': return 'primary'
      case 'achieved': return 'success'
      default: return 'muted'
    }
  }

  const getGoalStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'در انتظار'
      case 'in_progress': return 'در حال انجام'
      case 'achieved': return 'تحقق یافته'
      default: return 'نامشخص'
    }
  }

  const getGoalPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'muted'
    }
  }

  const getGoalPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'بالا'
      case 'medium': return 'متوسط'
      case 'low': return 'پایین'
      default: return 'نامشخص'
    }
  }

  const generateStructuredGoals = async (messages: any[], sessionNumber: number): Promise<any[]> => {
    
    const goalSchema = {
      type: 'object',
      properties: {
        goals: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              goal_type: { type: 'string', enum: ['diagnostic', 'treatment', 'specific', 'general'] },
              title: { type: 'string', description: 'عنوان هدف' },
              description: { type: 'string', description: 'شرح مفصل هدف' },
              target_behaviors: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'رفتارهای هدف برای ارزیابی'
              },
              success_criteria: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'معیارهای موفقیت بر اساس تشخیص'
              },
              priority: { type: 'string', enum: ['high', 'medium', 'low'] },
              dsm5_criteria: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    disorder_code: { type: 'string', description: 'کد DSM-5' },
                    disorder_name: { type: 'string', description: 'نام اختلال' },
                    criteria: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          criterion_letter: { type: 'string', description: 'حرف معیار (الف، ب، ج)' },
                          criterion_text: { type: 'string', description: 'متن کامل معیار' }
                        },
                        required: ['criterion_letter', 'criterion_text'],
                        additionalProperties: false
                      }
                    }
                  },
                  required: ['disorder_code', 'disorder_name', 'criteria'],
                  additionalProperties: false
                },
                description: '3-5 اختلال محتمل با معیارهای دقیق DSM-5'
              },
              icd11_criteria: {
                type: 'array',
                items: {
                  type: 'object', 
                  properties: {
                    disorder_code: { type: 'string', description: 'کد ICD-11' },
                    disorder_name: { type: 'string', description: 'نام اختلال' },
                    description: { type: 'string', description: 'توضیح کامل اختلال' },
                    severity_specifiers: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          code: { type: 'string', description: 'کد شدت' },
                          description: { type: 'string', description: 'توضیح شدت' }
                        },
                        additionalProperties: false
                      }
                    }
                  },
                  required: ['disorder_code', 'disorder_name', 'description'],
                  additionalProperties: false
                },
                description: '3-5 اختلال محتمل با کدهای دقیق ICD-11'
              },
              assessment_areas: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'حوزه‌های ارزیابی مورد نیاز'
              },
              action_plan: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'برنامه عملیاتی مرحله‌ای برای بررسی'
              },
              main_cc_investigation: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'حوزه‌های بررسی برای شکایت اصلی'
              },
              comorbidity_investigation: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'حوزه‌های بررسی اختلالات همزمان احتمالی'
              },
              clinical_interview_focus: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'نکات کلیدی مصاحبه بالینی'
              }
            },
            required: ['goal_type', 'title', 'description', 'target_behaviors', 'success_criteria', 'priority'],
            additionalProperties: false
          },
        }
      },
      required: ['goals'],
      additionalProperties: false
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.openRouterApiKey}`,
        'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
        'X-Title': 'Structured Diagnosis Goals Generator',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-saba',
        messages: messages,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'diagnosis_goals',
            strict: true,
            schema: goalSchema
          }
        },
        temperature: 0.7,
        max_tokens: 0,
      }),
    })

    if (!response.ok) {
      throw new Error(`Structured API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    const result = typeof content === 'string' ? JSON.parse(content) : content
    
    return result.goals || []
  }

  const generateDiagnosisGoals = async (assessment: TherapyAssessment, sessionNumber: number = 1): Promise<any[]> => {
    try {
      let systemPrompt = ''
      let userPrompt = ''

      if (sessionNumber === 1) {
        // Session 1: Focus on diagnosis and symptom assessment based on DSM-5 and ICD-11
        systemPrompt = `شما یک روانشناس متخصص در تشخیص اختلالات روانی بر اساس DSM-5 و ICD-11 هستید.

تولید دقیقاً 2 هدف مجزا:

**هدف 1 - تشخیص اصلی (Main Diagnosis):**
• تحلیل علائم و تعیین احتمالی‌ترین تشخیص
• DSM-5: ارائه کد و نام اختلال + معیارهای دقیق (الف. پنج یا بیشتر علامت زیر در 2 هفته: 1. خلق افسرده...)
• ICD-11: ارائه کد دقیق + نام + توضیح کامل + طبقه‌بندی شدت
• سوالات تشخیصی مستقیم و ابزارهای SCID

**هدف 2 - غربالگری اختلالات همزمان (Comorbidity Screening):**
• شناسایی اختلالات همزمان محتمل (2-3 اختلال مهم)
• DSM-5: برای هر اختلال همزمان: کد + نام + معیارهای دقیق (مثل: اختلال اضطراب عمومی 300.02: الف. اضطراب بیش از حد برای 6 ماه...)
• ICD-11: برای هر اختلال: کد دقیق + نام + توضیح کامل
• ابزارهای غربالگری هدفمند

هر هدف شامل: عنوان، توضیح، معیارهای DSM-5 دقیق، کدهای ICD-11 مشخص، سوالات تشخیصی، و برنامه عملیاتی.

پاسخ در JSON با فیلد "goals" که شامل دقیقاً 2 هدف است.`

        userPrompt = `بر اساس اطلاعات ارزیابی، دقیقاً 2 هدف تشخیصی مجزا تولید کنید:

**پروفایل بیمار:**
• شکایت اصلی: ${assessment.mainConcerns}
• شروع علائم: ${assessment.symptomsStarted}
• محرک‌ها: ${assessment.triggerEvents}
• تأثیر عملکردی: ${assessment.impactOnLife}

**وضعیت فعلی:**
• خلق: ${assessment.mood} | اضطراب: ${assessment.anxietyLevel}/10 | استرس: ${assessment.stressLevel}/10
• خواب: ${assessment.sleepQuality}/10 | انرژی: ${assessment.energyLevel}/10 | تمرکز: ${assessment.concentrationLevel}/10
• علائم جسمی: ${assessment.physicalSymptoms?.join(', ')}

**الزامات:**
1. **هدف اول - تشخیص اصلی**: 
   - DSM-5: کد + نام اختلال + معیارهای دقیق:
     {
       "disorder_code": "296.23",
       "disorder_name": "اپیزود افسردگی اساسی",
       "criteria": [
         {"criterion_letter": "الف", "criterion_text": "پنج یا بیشتر از علائم زیر در 2 هفته: 1. خلق افسرده 2. از دست دادن علاقه..."}
       ]
     }
   - ICD-11: کد + نام + توضیح کامل + طبقه‌بندی شدت:
     {
       "disorder_code": "6A70.1",
       "disorder_name": "اپیزود افسردگی متوسط",
       "description": "خلق افسرده، از دست دادن علاقه..."
     }

2. **هدف دوم - اختلالات همزمان**: برای 2-3 اختلال محتمل:
   - DSM-5 برای هر اختلال:
     {
       "disorder_code": "300.02",
       "disorder_name": "اختلال اضطراب عمومی",
       "criteria": [
         {"criterion_letter": "الف", "criterion_text": "اضطراب و نگرانی بیش از حد برای 6 ماه..."}
       ]
     }
   - ICD-11 برای هر اختلال:
     {
       "disorder_code": "6B00",
       "disorder_name": "اختلال اضطراب عمومی",
       "description": "اضطراب مداوم، منتشر، غیرقابل کنترل..."
     }

هر هدف شامل: عنوان، توضیح، معیارهای DSM-5 دقیق، کدهای ICD-11 مشخص، سوالات تشخیصی، برنامه عملیاتی.`
      } else {
        // Other sessions: Focus on treatment goals
        systemPrompt = `شما یک روانشناس متخصص هستید که اهداف درمانی برای جلسات بعدی را تولید می‌کنید. این اهداف باید بر اساس تشخیص‌های قبلی و پیشرفت درمان باشند.`
        
        userPrompt = `بر اساس ارزیابی، اهداف درمانی مناسب برای جلسه ${sessionNumber} تولید کنید.`
      }

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]

      // Try using structured output first
      try {
        const structuredResponse = await generateStructuredGoals(messages, sessionNumber)
        if (structuredResponse && structuredResponse.length > 0) {
          return structuredResponse
        }
      } catch (structuredError) {
        console.warn('Structured output failed, trying streaming:', structuredError)
      }

      // Fallback to streaming approach with AI-generated specific criteria
      let result = ''
      await streamChatForGoals(messages, (chunk) => {
        result += chunk || ''
      })

      // Try to parse JSON response with improved logic
      try {
        // First, try to extract JSON from code blocks
        const codeBlockMatch = result.match(/```json\s*([\s\S]*?)\s*```/)
        if (codeBlockMatch) {
          const jsonContent = codeBlockMatch[1].trim()
          const parsed = JSON.parse(jsonContent)
          return parsed.goals || parsed
        }

        // Try to find goals object structure
        const goalsMatch = result.match(/"goals"\s*:\s*(\[[\s\S]*?\])/)
        if (goalsMatch) {
          return JSON.parse(goalsMatch[1])
        }

        // Try to find array-like JSON structure
        const arrayMatch = result.match(/\[[\s\S]*\]/)
        if (arrayMatch) {
          return JSON.parse(arrayMatch[0])
        }

        // Try to find object-like JSON and extract goals
        const objectMatch = result.match(/\{[\s\S]*\}/)
        if (objectMatch) {
          const parsedObject = JSON.parse(objectMatch[0])
          return parsedObject.goals || [parsedObject]
        }

        // Clean the result and try parsing directly
        const cleanedResult = result.trim()
        if (cleanedResult.startsWith('[') || cleanedResult.startsWith('{')) {
          const parsed = JSON.parse(cleanedResult)
          return parsed.goals || (Array.isArray(parsed) ? parsed : [parsed])
        }

        // If no structured JSON found, fall back
        throw new Error('No valid JSON structure found in AI response')
        
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        console.log('Raw AI response:', result)
        // Fallback: Generate AI-powered goals using separate functions
        return await generateAIFallbackGoals(assessment, sessionNumber)
      }
    } catch (error) {
      console.error('Error generating AI goals:', error)
      return generateFallbackDiagnosisGoals(assessment, sessionNumber)
    }
  }

  const generateSymptomAssessmentGoal = (assessment: TherapyAssessment): any => {
    return {
        goal_type: 'diagnostic',
        title: 'ارزیابی علائم اصلی بر اساس DSM-5',
        description: 'بررسی دقیق و سیستماتیک علائم شکایت اصلی با استفاده از معیارهای مشخص DSM-5',
        target_behaviors: [
          'پرسیدن سوالات مستقیم درباره علائم اصلی',
          'بررسی مدت زمان و شدت علائم',
          'ارزیابی معیارهای DSM-5 برای اختلال احتمالی',
          'سنجش تأثیر علائم بر عملکرد روزانه'
        ],
        success_criteria: [
          'تعیین حضور/عدم حضور علائم اصلی DSM-5',
          'مشخص کردن زمان شروع و مدت علائم',
          'ارزیابی شدت علائم (خفیف/متوسط/شدید)',
          'تعیین تشخیص اولیه بر اساس معیارها'
        ],
        priority: 'high',
        dsm5_criteria: [
          {
            disorder_code: '296.23',
            disorder_name: 'اپیزود افسردگی اساسی (اصلی)',
            criteria: [
              {
                criterion_letter: 'الف',
                criterion_text: 'پنج (یا بیشتر) علامت در 2 هفته: 1. خلق افسرده 2. کاهش علاقه 3. تغییر وزن 4. اختلال خواب 5. کندی/تحریک 6. خستگی 7. بی‌ارزشی 8. مشکل تمرکز 9. افکار مرگ'
              },
              {
                criterion_letter: 'ب',
                criterion_text: 'علائم باعث اختلال قابل توجه در عملکرد می‌شوند'
              }
            ]
          },
          {
            disorder_code: '300.02',
            disorder_name: 'اختلال اضطراب عمومی (همزمان)',
            criteria: [
              {
                criterion_letter: 'الف',
                criterion_text: 'اضطراب بیش از حد برای 6 ماه در اکثر روزها'
              },
              {
                criterion_letter: 'ب',
                criterion_text: 'عدم کنترل نگرانی'
              },
              {
                criterion_letter: 'ج', 
                criterion_text: '3 یا بیشتر علامت: بی‌قراری، خستگی، مشکل تمرکز، تحریک‌پذیری، تنش عضلانی، اختلال خواب'
              }
            ]
          },
          {
            disorder_code: '309.81',
            disorder_name: 'اختلال استرس پس از ضربه (محتمل)',
            criteria: [
              {
                criterion_letter: 'الف',
                criterion_text: 'مواجهه با ترومای شدید: مرگ، آسیب جدی یا خشونت جنسی'
              },
              {
                criterion_letter: 'ب',
                criterion_text: 'علائم نفوذی: خاطرات مزاحم، کابوس، فلش بک'
              }
            ]
          }
        ],
        icd11_criteria: [
          {
            disorder_code: '6A70.1',
            disorder_name: 'اپیزود افسردگی متوسط (اصلی)',
            description: 'خلق افسرده، از دست دادن علاقه یا کاهش انرژی به مدت حداقل دو هفته. علائم اضافی: احساس گناه، کم‌ارزشی، تمرکز ضعیف، تغییرات خواب و اشتها. شدت متوسط: علائم قابل توجه با اختلال عملکردی واضح',
            severity_specifiers: [
              { code: '6A70.0', description: 'خفیف: علائم حداقل' },
              { code: '6A70.1', description: 'متوسط: علائم قابل توجه' },
              { code: '6A70.2', description: 'شدید: علائم شدید' }
            ]
          },
          {
            disorder_code: '6B00',
            disorder_name: 'اختلال اضطراب عمومی (همزمان)',
            description: 'اضطراب مداوم، منتشر، غیرقابل کنترل برای چندین ماه (حداقل 6 ماه) با علائم جسمانی و روانی: تنش عضلانی، بی‌قراری، خستگی، مشکل تمرکز'
          },
          {
            disorder_code: '6B25',
            disorder_name: 'اختلال استرس پس از ضربه (محتمل)',
            description: 'پاسخ به رویداد آسیب‌زا با علائم نفوذی (خاطرات مزاحم، کابوس)، اجتنابی (اجتناب از محرک‌ها) و فعال‌سازی بیش از حد (هوشیاری بالا، تحریک‌پذیری) برای بیش از یک ماه'
          }
        ],
        assessment_areas: ['علائم خلقی', 'علائم اضطرابی', 'عملکرد اجتماعی', 'تأثیر بر کار/تحصیل'],
        action_plan: [
          'مرحله 1: گردآوری تاریخچه کامل (15 دقیقه)',
          'مرحله 2: بررسی علائم فعلی (20 دقیقه)',
          'مرحله 3: ارزیابی عملکرد روزانه (10 دقیقه)',
          'مرحله 4: بررسی اختلالات همزمان (10 دقیقه)',
          'مرحله 5: جمع‌بندی و تشخیص اولیه (5 دقیقه)'
        ],
        main_cc_investigation: [
          'آیا علائم بیش از 2 هفته ادامه داشته؟ (معیار زمانی DSM-5)',
          'آیا خلق افسرده یا از دست دادن علاقه روزانه وجود دارد؟',
          'آیا تغییرات خواب، اشتها یا انرژی مشاهده می‌شود؟',
          'آیا احساس گناه یا بی‌ارزشی وجود دارد؟',
          'آیا مشکلات تمرکز یا تصمیم‌گیری دارید؟',
          'آیا افکار مرگ یا خودکشی داشته‌اید؟'
        ],
        clinical_interview_focus: [
          'استفاده از SCID-5-CV (مصاحبه بالینی ساختاریافته)',
          'بررسی معیارهای A تا E طبق DSM-5',
          'ارزیابی خطر خودکشی با Columbia Scale',
          'سنجش شدت علائم با Hamilton Depression Scale',
          'بررسی سطح بصیرت و آمادگی درمان'
        ]
    }
  }

  const generateComorbidityScreeningGoal = (assessment: TherapyAssessment): any => {
    return {
        goal_type: 'diagnostic',
        title: 'غربالگری اختلالات همزمان',
        description: 'بررسی سیستماتیک اختلالات روانی همزمان با سوالات ساده و مستقیم',
        target_behaviors: [
          'پرسیدن سوالات غربالگری برای اختلالات شایع',
          'بررسی علائم اضطرابی، افسردگی و مانیا',
          'ارزیابی مصرف مواد و اختلالات خوردن',
          'شناسایی علائم اختلالات پسیکوتیک'
        ],
        success_criteria: [
          'تکمیل غربالگری اختلالات اصلی',
          'تعیین نیاز به ارزیابی بیشتر',
          'اولویت‌بندی اختلالات احتمالی',
          'برنامه‌ریزی ارزیابی‌های تخصصی'
        ],
        priority: 'high',
        dsm5_criteria: [
          {
            disorder_code: '300.02',
            disorder_name: 'اختلال اضطراب عمومی',
            criteria: [
              {
                criterion_letter: 'الف',
                criterion_text: 'اضطراب و نگرانی بیش از حد در مورد تعدادی رویداد یا فعالیت، برای حداقل شش ماه، در اکثر روزها'
              },
              {
                criterion_letter: 'ب',
                criterion_text: 'فرد نمی‌تواند این نگرانی را کنترل کند'
              },
              {
                criterion_letter: 'ج',
                criterion_text: 'اضطراب و نگرانی با سه (یا بیشتر) علامت زیر همراه است: 1. بی‌قراری 2. خستگی آسان 3. مشکل تمرکز 4. تحریک‌پذیری 5. تنش عضلانی 6. اختلال خواب'
              }
            ]
          }
        ],
        icd11_criteria: [
          {
            disorder_code: '6B00',
            disorder_name: 'اختلال اضطراب عمومی',
            description: 'اضطراب مداوم، منتشر، غیرقابل کنترل برای چندین ماه (حداقل 6 ماه) با علائم جسمانی و روانی مانند تنش عضلانی، بی‌قراری، خستگی، مشکل تمرکز'
          }
        ],
        assessment_areas: [
          'اختلالات خلقی',
          'اختلالات اضطرابی', 
          'مصرف مواد',
          'اختلالات خوردن',
          'علائم پسیکوتیک'
        ],
        action_plan: [
          'مرحله 1: غربالگری اختلالات خلقی (10 دقیقه)',
          'مرحله 2: غربالگری اختلالات اضطرابی (10 دقیقه)',
          'مرحله 3: بررسی مصرف مواد و الکل (5 دقیقه)',
          'مرحله 4: غربالگری اختلالات خوردن (5 دقیقه)',
          'مرحله 5: بررسی علائم پسیکوتیک (5 دقیقه)'
        ],
        main_cc_investigation: [
          'آیا علائم اضطراب همراه با شکایت اصلی وجود دارد؟',
          'آیا دوره‌هایی از خلق بالا یا پایین داشته‌اید؟',
          'آیا تجربه‌های صدا شنیدن یا دیدن چیزهای غیرواقعی داشته‌اید؟',
          'آیا مشکلی در خوردن، رژیم یا وزن دارید؟',
          'آیا مشکلی با الکل، دخانیات یا مواد مخدر دارید؟'
        ],
        comorbidity_investigation: [
          'اختلال اضطراب عمومی (GAD)',
          'اختلال پانیک',
          'اختلال وسواسی-اجباری (OCD)',
          'اختلال دوقطبی',
          'اختلالات مصرف مواد',
          'اختلالات خوردن',
          'اختلال استرس پس از سانحه (PTSD)'
        ],
        clinical_interview_focus: [
          'SCID-5-RV برای اختلالات مرتبط و کمک‌تشخیصی',
          'استفاده از ابزارهای غربالگری معتبر (GAD-7, PHQ-9, CAGE)',
          'MINI International Neuropsychiatric Interview',
          'ارزیابی اولویت‌بندی شده بر اساس شدت علائم',
          'برنامه‌ریزی ارزیابی‌های تخصصی بیشتر'
        ]
    }
  }

  const generateAIFallbackGoals = async (assessment: TherapyAssessment, sessionNumber: number): Promise<any[]> => {
    if (sessionNumber === 1) {
      try {
        // Generate diagnosis goal with AI-powered specific criteria
        const diagnosisGoal = await generateAIDiagnosisGoal(assessment)
        // Generate comorbidity goal with AI-powered specific criteria  
        const comorbidityGoal = await generateAIComorbidityGoal(assessment)
        
        return [diagnosisGoal, comorbidityGoal]
      } catch (error) {
        console.error('AI fallback failed, using static fallback:', error)
        return generateStaticFallbackGoals(assessment, sessionNumber)
      }
    }

    // For other sessions, return basic treatment goals
    return [{
      goal_type: 'treatment',
      title: 'ادامه درمان بر اساس تشخیص',
      description: 'پیگیری و درمان بر اساس تشخیص‌های مشخص شده',
      target_behaviors: ['پیگیری پیشرفت', 'اجرای مداخلات درمانی'],
      success_criteria: ['بهبود علائم', 'افزایش عملکرد'],
      priority: 'high'
    }]
  }

  const generateAIDiagnosisGoal = async (assessment: TherapyAssessment): Promise<any> => {
    const systemPrompt = `شما روانشناس متخصص هستید. بر اساس علائم بیمار، یک هدف تشخیص اصلی با معیارهای دقیق DSM-5 و ICD-11 تولید کنید. DSM-5 باید شامل: کد + نام + معیارهای دقیق با حروف (الف، ب، ج). ICD-11 باید شامل: کد + نام + توضیح کامل + طبقه‌بندی شدت.`
    
    const userPrompt = `علائم بیمار:
• شکایت اصلی: ${assessment.mainConcerns}
• خلق: ${assessment.mood}
• اضطراب: ${assessment.anxietyLevel}/10
• استرس: ${assessment.stressLevel}/10

JSON فرمت:
{
  "dsm5_criteria": {
    "disorder_code": "296.23",
    "disorder_name": "اپیزود افسردگی",
    "criteria": [
      {"criterion_letter": "الف", "criterion_text": "پنج یا بیشتر علامت..."}
    ]
  },
  "icd11_criteria": {
    "disorder_code": "6A70.1",
    "disorder_name": "اپیزود افسردگی",
    "description": "توضیح کامل...",
    "severity_specifiers": [{"code": "6A70.0", "description": "..."}]
  }
}`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]

    let result = ''
    await streamChatForGoals(messages, (chunk) => {
      result += chunk || ''
    })

    // Parse and return goal object
    try {
      const parsed = JSON.parse(result)
      return parsed
    } catch {
      return generateSymptomAssessmentGoal(assessment)
    }
  }

  const generateAIComorbidityGoal = async (assessment: TherapyAssessment): Promise<any> => {
    const systemPrompt = `شما روانشناس متخصص هستید. بر اساس علائم بیمار، 2-3 اختلال همزمان محتمل را شناسایی کنید و برای هر کدام معیارهای دقیق DSM-5 و ICD-11 ارائه دهید. فرمت: آرایی از ابجکت‌های DSM-5 و ICD-11.`
    
    const userPrompt = `علائم بیمار:
• شکایت اصلی: ${assessment.mainConcerns}
• علائم جسمی: ${assessment.physicalSymptoms?.join(', ')}
• سطح اضطراب: ${assessment.anxietyLevel}/10

JSON فرمت:
{
  "dsm5_criteria": [
    {
      "disorder_code": "300.02",
      "disorder_name": "اختلال اضطراب عمومی",
      "criteria": [
        {"criterion_letter": "الف", "criterion_text": "اضطراب بیش از حد برای 6 ماه..."}
      ]
    }
  ],
  "icd11_criteria": [
    {
      "disorder_code": "6B00",
      "disorder_name": "اختلال اضطراب عمومی",
      "description": "توضیح کامل..."
    }
  ]
}`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]

    let result = ''
    await streamChatForGoals(messages, (chunk) => {
      result += chunk || ''
    })

    // Parse and return goal object
    try {
      const parsed = JSON.parse(result)
      return parsed
    } catch {
      return generateComorbidityScreeningGoal(assessment)
    }
  }

  const generateStaticFallbackGoals = (assessment: TherapyAssessment, sessionNumber: number): any[] => {
    if (sessionNumber === 1) {
      const goals = []
      
      // Generate both goals using separate functions as last resort
      goals.push(generateSymptomAssessmentGoal(assessment))
      goals.push(generateComorbidityScreeningGoal(assessment))
      
      return goals
    }

    // For other sessions, return basic treatment goals
    return [{
      goal_type: 'treatment',
      title: 'ادامه درمان بر اساس تشخیص',
      description: 'پیگیری و درمان بر اساس تشخیص‌های مشخص شده',
      target_behaviors: ['پیگیری پیشرفت', 'اجرای مداخلات درمانی'],
      success_criteria: ['بهبود علائم', 'افزایش عملکرد'],
      priority: 'high'
    }]
  }

  return {
    getSessionGoals,
    getGoalsByUser,
    updateGoalProgress,
    completeGoal,
    saveGoal,
    saveGoals,
    getGoalStatusColor,
    getGoalStatusLabel,
    getGoalPriorityColor,
    getGoalPriorityLabel,
    generateDiagnosisGoals,
    generateSymptomAssessmentGoal,
    generateComorbidityScreeningGoal,
  }
}