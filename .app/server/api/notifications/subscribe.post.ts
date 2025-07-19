export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { subscription, userId, deviceInfo } = body

    if (!subscription || !userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing subscription or userId'
      })
    }

    // Forward to PocketBase hook
    const pb = createPocketBaseInstance(event)
    
    const response = await pb.send('/api/notifications/subscribe', {
      method: 'POST',
      body: {
        subscription,
        userId,
        deviceInfo
      }
    })

    return {
      success: true,
      message: 'Push subscription saved successfully',
      data: response
    }
  } catch (error) {
    console.error('Error saving push subscription:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save push subscription'
    })
  }
})