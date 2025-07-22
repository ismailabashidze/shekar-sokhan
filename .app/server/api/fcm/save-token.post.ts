export default defineEventHandler(async (event) => {
  const { token, userId } = await readBody(event)
  
  if (!token || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token and userId are required'
    })
  }

  try {
    // Save FCM token to PocketBase
    const pb = usePocketBase()
    
    // Check if user already has a token record
    const existingToken = await pb.collection('fcm_tokens').getFirstListItem(`user_id="${userId}"`)
    
    if (existingToken) {
      // Update existing token
      await pb.collection('fcm_tokens').update(existingToken.id, {
        token: token,
        updated: new Date().toISOString()
      })
    } else {
      // Create new token record
      await pb.collection('fcm_tokens').create({
        user_id: userId,
        token: token,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error saving FCM token:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save FCM token'
    })
  }
})