import PocketBase from 'pocketbase'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const clinicId = getRouterParam(event, 'id')
  const psychologistId = getRouterParam(event, 'psychologistId')
  
  // Create PocketBase instance for server-side use
  const pb = new PocketBase('https://pocket.zehna.ir')
  
  // Get auth token from cookies
  const cookies = parseCookies(event)
  const authCookie = cookies.pb_auth
  
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie)
      pb.authStore.save(authData.token, authData.model)
    } catch (error) {
      console.error('Error parsing auth cookie:', error)
    }
  }

  if (!clinicId || !psychologistId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Clinic ID and Psychologist ID are required'
    })
  }

  if (method === 'PUT') {
    try {
      if (!pb.authStore.isValid) {
        throw createError({
          statusCode: 401,
          statusMessage: 'User not authenticated'
        })
      }

      const body = await readBody<{ role?: 'owner' | 'member', status?: 'active' | 'inactive' }>(event)
      
      // Find the relationship record
      const relationships = await pb.collection('clinic_psychologists').getList(1, 1, {
        filter: `clinic = "${clinicId}" && psychologist = "${psychologistId}"`,
      })

      if (relationships.items.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Relationship not found'
        })
      }

      const relationship = await pb.collection('clinic_psychologists').update(relationships.items[0].id, body)
      
      return {
        success: true,
        data: relationship,
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update psychologist relationship'
      })
    }
  }

  if (method === 'DELETE') {
    try {
      if (!pb.authStore.isValid) {
        throw createError({
          statusCode: 401,
          statusMessage: 'User not authenticated'
        })
      }

      // Find the relationship record
      const relationships = await pb.collection('clinic_psychologists').getList(1, 1, {
        filter: `clinic = "${clinicId}" && psychologist = "${psychologistId}"`,
      })

      if (relationships.items.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Relationship not found'
        })
      }

      await pb.collection('clinic_psychologists').delete(relationships.items[0].id)
      
      return {
        success: true,
        message: 'Psychologist removed from clinic',
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to remove psychologist from clinic'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})