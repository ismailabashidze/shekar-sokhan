export default defineEventHandler(async (event) => {
  try {
    // Forward to PocketBase hook
    const pb = createPocketBaseInstance(event)
    
    const response = await pb.send('/api/notifications/vapid-key', {
      method: 'GET'
    })

    return {
      success: true,
      publicKey: response.publicKey
    }
  } catch (error) {
    console.error('Error getting VAPID key:', error)
    
    // Fallback public key
    return {
      success: true,
      publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9fPNNw6V2SCQvJbLexhqNUe3Z9B3PbQNABJBp4QFG4xZA2EKKhHM'
    }
  }
})