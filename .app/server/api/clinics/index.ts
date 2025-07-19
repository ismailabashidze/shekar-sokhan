export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const pb = createPocketBaseInstance(event)

  if (method === 'GET') {
    try {
      const query = getQuery(event)
      const isAdmin = query.admin === 'true'
      
      if (isAdmin) {
        // Admin fetching all clinics
        const page = parseInt(query.page as string) || 1
        const perPage = parseInt(query.perPage as string) || 10
        const search = query.filter as string || ''
        const status = query.status as string
        const sort = query.sort as string || '-created'
        
        let filterQuery = ''
        const filterConditions = []

        if (status) {
          filterConditions.push(`status = "${status}"`)
        }
        if (search) {
          filterConditions.push(`(name ~ "${search}" || address ~ "${search}" || email ~ "${search}")`)
        }

        if (filterConditions.length > 0) {
          filterQuery = filterConditions.join(' && ')
        }

        const clinics = await pb.collection('clinics').getList(page, perPage, {
          filter: filterQuery,
          sort,
          expand: 'owner.psychotherapist'
        })

        // Get psychotherapist counts for each clinic
        const clinicsWithCounts = await Promise.all(clinics.items.map(async (clinic) => {
          try {
            const psychotherapistsCount = await pb.collection('clinic_psychologists').getList(1, 1, {
              filter: `clinic = "${clinic.id}" && status = "active"`,
              requestKey: null
            })
            
            return {
              ...clinic,
              psychotherapistsCount: psychotherapistsCount.totalItems
            }
          } catch (error) {
            console.error(`Error fetching psychotherapist count for clinic ${clinic.id}:`, error)
            return {
              ...clinic,
              psychotherapistsCount: 0
            }
          }
        }))

        return {
          data: clinicsWithCounts,
          page: clinics.page,
          perPage: clinics.perPage,
          total: clinics.totalItems,
          totalPages: clinics.totalPages,
        }
      } else {
        // User fetching their own clinics
        if (!pb.authStore.isValid) {
          throw createError({
            statusCode: 401,
            statusMessage: 'User not authenticated'
          })
        }

        const userId = pb.authStore.model?.id
        const result = await pb.collection('clinics').getFullList({
          sort: '-created',
          filter: `owner = "${userId}"`,
          expand: 'owner',
        })

        return {
          data: result,
          total: result.length,
        }
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch clinics'
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

      // Check if request has form data (for file uploads)
      const contentType = getHeader(event, 'content-type') || ''
      let body, logo
      
      if (contentType?.includes('multipart/form-data')) {
        // Handle multipart form data
        const formData = await readMultipartFormData(event)
        body = {}
        
        // Process form fields
        for (const item of formData || []) {
          const fieldName = item.name
          if (fieldName === 'logo' && item.data) {
            logo = item
          } else if (fieldName && item.data) {
            body[fieldName] = item.data.toString()
          }
        }
      } else {
        // Handle JSON body
        body = await readBody(event)
      }
      
      console.log('Request body:', body)
      console.log('User ID:', pb.authStore.model?.id)
      console.log('Logo:', logo ? 'Present' : 'Not present')
      
      // Determine owner
      let ownerId = pb.authStore.model?.id
      
      // If admin and owner is specified, use that owner
      if (pb.authStore.model?.role === 'admin' && body.owner) {
        ownerId = body.owner
      }
      
      const clinicData = {
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        license: body.license,
        description: body.description || '',
        owner: ownerId,
        status: 'pending',
      }

      // Add logo if present
      if (logo && logo.data) {
        // Create a File-like object for PocketBase
        const logoFile = new File([logo.data], logo.filename || 'logo.png', {
          type: logo.type || 'image/png'
        })
        clinicData.logo = logoFile
      }

      console.log('Clinic data to create:', { ...clinicData, logo: logo ? 'File present' : 'No file' })

      const clinic = await pb.collection('clinics').create(clinicData)
      
      return {
        success: true,
        data: clinic,
      }
    } catch (error) {
      console.error('Error creating clinic:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create clinic: ${error.message || error}`
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})