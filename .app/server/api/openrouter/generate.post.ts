import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (!body.name || !body.age || !body.shortDescription) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields',
    })
  }

  try {
    const response = await $fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openRouterApiKey}`,
        'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
        'X-Title': 'Patient Details Generator',
      },
      body: {
        model: 'mistralai/mistral-saba',
        messages: [
          {
            role: 'system',
            content: 'شما یک دستیار روانشناس هستید که در تولید اطلاعات بیمار کمک می‌کند. لطفا با توجه به اطلاعات اولیه بیمار، سایر جزئیات را به صورت منطقی و به زبان فارسی تولید کنید.',
          },
          {
            role: 'user',
            content: `لطفا با توجه به اطلاعات زیر، جزئیات بیمار را تولید کنید:
نام: ${body.name}
سن: ${body.age}
توضیح کوتاه: ${body.shortDescription}`,
          },
        ],
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
        max_tokens: 1000,
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
    catch (e) {
      throw createError({
        statusCode: 500,
        message: `Invalid response format: ${e.message}`,
      })
    }
  }
  catch (error: any) {
    console.error('Generate API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred while generating patient details',
    })
  }
})
