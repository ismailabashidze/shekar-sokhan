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

  if (!body.sessionHistory || !body.goalTemplates) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields',
    })
  }

  try {
    const requestBody = {
      model: body.model || 'mistralai/mistral-saba',
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
${body.sessionHistory.map((session, index) => `
جلسه ${index + 1} (${session.date}):
- تحلیل: ${session.analysis}
- احساسات: ${session.emotions}
- موضوعات: ${session.topics}
- دستاوردها: ${session.achievements}
`).join('\n')}

قالب‌های اهداف موجود:
${body.goalTemplates.map(template => `
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
      ],
      ...(body.model?.includes('gpt-4') || body.model?.includes('gpt-3.5') ? {
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
        response_format: { type: 'json_object' }
      })
    }

    const response = await $fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openRouterApiKey}`,
        'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
        'X-Title': 'Therapy Goals Generator',
      },
      body: requestBody
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
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks
      let cleanContent = content
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (codeBlockMatch) {
        cleanContent = codeBlockMatch[1].trim()
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
      
      throw createError({
        statusCode: 500,
        message: `Failed to parse JSON response: ${parseError}`,
      })
    }
  }
  catch (error: any) {
    console.error('Goals API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred while generating goals',
    })
  }
})