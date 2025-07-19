import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (!config.openRouterApiKey) {
    throw createError({
      statusCode: 500,
      message: 'OpenRouter API key not configured',
    })
  }

  if (!body.goal || !body.sessionMessages) {
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
        'X-Title': 'Goal Progress Evaluator',
      },
      body: {
        model: body.model || 'mistralai/mistral-saba',
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
عنوان: ${body.goal.title}
توضیح: ${body.goal.description}
رفتارهای هدف: ${body.goal.target_behaviors?.join(', ')}
معیارهای موفقیت: ${body.goal.success_criteria?.join(', ')}
پیشرفت قبلی: ${body.previousProgress || 0}%

پیام‌های جلسه:
${body.sessionMessages.map((msg, index) => `${index + 1}. ${msg.type === 'sent' ? 'کاربر' : 'مشاور'}: ${msg.text}`).join('\n')}

لطفاً پیشرفت هدف را ارزیابی کنید:
{
  "progress_percentage": عدد بین 0 تا 100,
  "status": "pending|in_progress|achieved|partially_achieved|modified",
  "evaluation": "تحلیل کامل پیشرفت",
  "behavior_changes": ["تغییر رفتاری 1", "تغییر رفتاری 2"],
  "recommendations": ["پیشنهاد 1", "پیشنهاد 2"]
}`
          }
        ],
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
      }
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
    console.error('Goal Evaluation API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred while evaluating goal progress',
    })
  }
})