export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { sessionId, messages, userId } = body
  
  if (!sessionId || !messages || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Session ID, messages, and user ID are required'
    })
  }

  try {
    // Call OpenRouter API for session analysis
    const analysisResponse = await $fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${useRuntimeConfig().openrouterApiKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'Zehna Session Analysis'
      },
      body: {
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are a professional therapist analyzing a therapy session. Based on the session messages, provide:

1. A comprehensive session analysis
2. 5 customized follow-up messages that should be scheduled to send to the patient over the next week
3. Schedule timing for each message (in hours from now)
4. Priority level for each message

Format your response as JSON with this structure:
{
  "analysis": {
    "summary": "Overall session summary",
    "key_insights": ["insight1", "insight2", "insight3"],
    "emotional_state": "patient's emotional state",
    "progress_notes": "progress observations",
    "recommendations": ["recommendation1", "recommendation2"]
  },
  "followup_messages": [
    {
      "title": "Message title",
      "content": "Message content",
      "schedule_hours": 24,
      "priority": "medium",
      "type": "reminder"
    }
  ]
}`
          },
          {
            role: 'user',
            content: `Analyze this therapy session:

Session ID: ${sessionId}
Messages: ${JSON.stringify(messages)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }
    })

    const analysisText = analysisResponse.choices[0].message.content
    let analysisData

    try {
      analysisData = JSON.parse(analysisText)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      analysisData = {
        analysis: {
          summary: analysisText.substring(0, 500),
          key_insights: [],
          emotional_state: 'unknown',
          progress_notes: '',
          recommendations: []
        },
        followup_messages: []
      }
    }

    // Save analysis to database
    const pb = usePocketBase()
    const analysisRecord = await pb.collection('session_analyses').create({
      session_id: sessionId,
      user_id: userId,
      analysis_data: JSON.stringify(analysisData.analysis),
      created: new Date().toISOString()
    })

    // Schedule follow-up messages
    const currentTime = new Date()
    const scheduledMessages = []

    for (const message of analysisData.followup_messages) {
      const scheduleTime = new Date(currentTime.getTime() + (message.schedule_hours * 60 * 60 * 1000))
      
      const scheduledMessage = await pb.collection('scheduled_notifications').create({
        user_id: userId,
        title: message.title,
        body: message.content,
        type: message.type || 'info',
        priority: message.priority || 'medium',
        schedule_time: scheduleTime.toISOString(),
        status: 'pending',
        source: 'session_analysis',
        source_id: analysisRecord.id,
        data: JSON.stringify({
          session_id: sessionId,
          analysis_id: analysisRecord.id,
          message_type: 'followup'
        }),
        created: new Date().toISOString()
      })

      scheduledMessages.push(scheduledMessage)
    }

    // Also try to send FCM notifications for immediate messages
    const immediateMessages = analysisData.followup_messages.filter(msg => msg.schedule_hours <= 1)
    
    if (immediateMessages.length > 0) {
      try {
        for (const message of immediateMessages) {
          await $fetch('/api/fcm/send-notification', {
            method: 'POST',
            body: {
              title: message.title,
              body: message.content,
              userId: userId,
              data: {
                type: message.type || 'info',
                priority: message.priority || 'medium',
                source: 'session_analysis',
                session_id: sessionId
              }
            }
          })
        }
      } catch (fcmError) {
        console.warn('FCM notification failed, but analysis completed:', fcmError)
      }
    }

    return {
      success: true,
      analysis: analysisData.analysis,
      scheduled_messages: scheduledMessages.length,
      analysis_id: analysisRecord.id
    }

  } catch (error) {
    console.error('Error in session analysis:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to analyze session'
    })
  }
})