export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { endpoint, userId } = body

    if (!endpoint || !userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing endpoint or userId'
      })
    }

    // Forward to PocketBase hook
    const pb = createPocketBaseInstance(event)
    
    const response = await pb.send('/api/notifications/unsubscribe', {
      method: 'POST',
      body: {
        endpoint,
        userId
      }
    })

    return {
      success: true,
      message: 'Push subscription removed successfully',
      data: response
    }
  } catch (error) {
    console.error('Error removing push subscription:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to remove push subscription'
    })
  }
})