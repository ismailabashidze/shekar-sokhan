import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (!body.userDetails || !body.llmMessages) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields',
    })
  }

  try {
    const userDetails = `DETAILS => we have previous knowledge from user which, name is: ${body.userDetails.name}, and age is : ${body.userDetails.age} years old, gender is: ${body.userDetails.gender}, and jobStatus: ${body.userDetails.jobStatus}, also my maritalStatus: ${body.userDetails.maritalStatus}. `

    const response = await $fetch<{
      choices?: Array<{
        message?: {
          content?: string
        }
      }>
    }>('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openRouterApiKey}`,
        'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
        'X-Title': 'Therapy Session Analysis',
      },
      body: {
        model: 'google/gemma-3-27b-it',
        messages: [
          {
            role: 'system',
            content: `به شما یک گفتگو بین کاربر، که جزئیات آن در پیام اول آمده است، و یک ارزیاب و روانشناس هوش مصنوعی داده شده است. هدف شما تولید یک گزارش بر اساس مکالمه و تحلیل‌هایی است که انجام و به گفتگو اضافه شده است.`,
          },
          {
            role: 'user',
            content: userDetails,
          },
          ...body.llmMessages,
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'session_analysis',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                summaryOfSession: {
                  type: 'string',
                  description: 'یک پاراگراف خلاصه از گفتگو بین کاربر و درمانگر',
                },
                headlines: {
                  type: 'array',
                  description: 'چهار نکته مهم از جلسه، هر کدام شامل عنوان و توضیحات',
                  items: {
                    type: 'object',
                    properties: {
                      title: {
                        type: 'string',
                        description: 'عنوان نکته مهم',
                      },
                      description: {
                        type: 'string',
                        description: 'توضیحات مربوط به نکته مهم',
                      },
                    },
                    required: ['title', 'description'],
                  },
                  minItems: 4,
                  maxItems: 4,
                },
                psychotherapistEvaluation: {
                  type: 'string',
                  description: 'ارزیابی پاسخ‌های روانشناس',
                },
                psychotherapistEvaluationScore: {
                  type: 'number',
                  description: 'نمره ارزیابی روانشناس از 0 تا 5',
                  minimum: 0,
                  maximum: 5,
                },
                psychotherapistEvaluationScoreDescription: {
                  type: 'string',
                  description: 'توضیحات مربوط به نمره ارزیابی روانشناس',
                },
                finalTrustAndOppennessOfUser: {
                  type: 'string',
                  description: 'میزان نهایی اعتماد و صراحت کاربر',
                  enum: ['veryLow', 'low', 'high', 'veryHigh', 'N/A'],
                },
                finalTrustAndOppennessOfUserEvaluationDescription: {
                  type: 'string',
                  description: 'توضیحات مربوط به میزان اعتماد و صراحت کاربر',
                },
                DemographicData: {
                  type: 'object',
                  description: 'اطلاعات جمعیت‌شناختی استخراج شده از گفتگو',
                },
                behavioralAnalysisSummary: {
                  type: 'string',
                  description: 'خلاصه تحلیل رفتاری کاربر در گفتگو',
                },
                emotionalAnalysisSummary: {
                  type: 'string',
                  description: 'خلاصه تحلیل احساسی کاربر در گفتگو',
                },
                thoughtsAndConcernsSummary: {
                  type: 'string',
                  description: 'خلاصه افکار و نگرانی‌های کاربر',
                },
                GHQCoverageDepression: {
                  type: 'number',
                  description: 'تعداد سوالات پوشش داده شده مربوط به افسردگی در پرسشنامه GHQ',
                },
                GHQCoverageSocialDysfunction: {
                  type: 'number',
                  description: 'تعداد سوالات پوشش داده شده مربوط به اختلال عملکرد اجتماعی در پرسشنامه GHQ',
                },
                GHQCoverageAnxiety: {
                  type: 'number',
                  description: 'تعداد سوالات پوشش داده شده مربوط به اضطراب در پرسشنامه GHQ',
                },
                GHQCoverageSomaticSymptoms: {
                  type: 'number',
                  description: 'تعداد سوالات پوشش داده شده مربوط به علائم جسمانی در پرسشنامه GHQ',
                },
                GHQFinalReport: {
                  type: 'string',
                  description: 'گزارش نهایی وضعیت سلامت روان بر اساس پرسشنامه GHQ',
                },
                psychoAnalysis: {
                  type: 'string',
                  description: 'تحلیل روانکاوانه بر اساس اطلاعات موجود',
                },
                defenceMechanisms: {
                  type: 'string',
                  description: 'تحلیل مکانیسم‌های دفاعی مشاهده شده در گفتگو',
                },
                schemas: {
                  type: 'string',
                  description: 'طرحواره‌های احتمالی شناسایی شده در کاربر',
                },
                solutions: {
                  type: 'string',
                  description: 'راهکارهای پیشنهادی برای کاربر',
                },
                planForNextSession: {
                  type: 'string',
                  description: 'برنامه پیشنهادی برای جلسه بعدی',
                },
              },
              required: [
                'summaryOfSession',
                'headlines',
                'psychotherapistEvaluation',
                'psychotherapistEvaluationScore',
                'psychotherapistEvaluationScoreDescription',
                'finalTrustAndOppennessOfUser',
                'finalTrustAndOppennessOfUserEvaluationDescription',
                'DemographicData',
                'behavioralAnalysisSummary',
                'emotionalAnalysisSummary',
                'thoughtsAndConcernsSummary',
                'GHQCoverageDepression',
                'GHQCoverageSocialDysfunction',
                'GHQCoverageAnxiety',
                'GHQCoverageSomaticSymptoms',
                'GHQFinalReport',
                'psychoAnalysis',
                'defenceMechanisms',
                'schemas',
                'solutions',
                'planForNextSession',
              ],
              additionalProperties: false,
            },
          },
        },
        temperature: 0.7,
        max_tokens: 2000,
      },
    })

    if (!response?.choices?.[0]?.message?.content) {
      throw createError({
        statusCode: 500,
        message: 'Invalid response from AI service',
      })
    }

    const content = response.choices[0].message.content
    let result

    try {
      result = typeof content === 'string' ? JSON.parse(content) : content
      return result
    }
    catch (e: unknown) {
      throw createError({
        statusCode: 500,
        message: `Invalid response format: ${(e as Error).message}`,
      })
    }
  }
  catch (error: any) {
    console.error('Analysis API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred while analyzing the session',
    })
  }
})
