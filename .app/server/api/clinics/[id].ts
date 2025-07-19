import PocketBase from 'pocketbase'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const id = getRouterParam(event, 'id')
  
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

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Clinic ID is required'
    })
  }

  if (method === 'GET') {
    try {
      if (!pb.authStore.isValid) {
        throw createError({
          statusCode: 401,
          statusMessage: 'User not authenticated'
        })
      }

      const clinic = await pb.collection('clinics').getOne(id, {
        expand: 'owner,owner.psychotherapist',
      })

      return { data: clinic }
    } catch (error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Clinic not found'
      })
    }
  }

  if (method === 'PUT') {
    try {
      if (!pb.authStore.isValid) {
        throw createError({
          statusCode: 401,
          statusMessage: 'User not authenticated'
        })
      }

      const body = await readBody(event)
      const clinic = await pb.collection('clinics').update(id, body)
      
      return {
        success: true,
        data: clinic,
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update clinic'
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

      await pb.collection('clinics').delete(id)
      
      return {
        success: true,
        message: 'Clinic deleted successfully',
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete clinic'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})