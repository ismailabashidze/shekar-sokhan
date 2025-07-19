import PocketBase from 'pocketbase'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const clinicId = getRouterParam(event, 'id')
  
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

  if (!clinicId) {
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

      const query = getQuery(event)
      const page = parseInt(query.page as string) || 1
      const perPage = parseInt(query.perPage as string) || 10

      const result = await pb.collection('clinic_psychologists').getList(page, perPage, {
        filter: `clinic = "${clinicId}"`,
        expand: 'psychologist,clinic',
        sort: '-created',
      })

      return {
        data: result.items,
        page: result.page,
        perPage: result.perPage,
        total: result.totalItems,
        totalPages: result.totalPages,
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch clinic psychologists'
      })
    }
  }

  if (method === 'POST') {
    try {
      if (!pb.authStore.isValid) {
        throw createError({
          statusCode: 401,
          statusMessage: 'User not authenticated'
        })
      }

      const body = await readBody<{ psychologistId: string, role: 'owner' | 'member' }>(event)
      
      const clinicPsychologist = {
        clinic: clinicId,
        psychologist: body.psychologistId,
        role: body.role || 'member',
        status: 'active',
      }

      const result = await pb.collection('clinic_psychologists').create(clinicPsychologist)
      
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to add psychologist to clinic'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})