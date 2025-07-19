export default defineEventHandler(async (event) => {
  const pb = createPocketBaseInstance(event)
  const clinicId = getRouterParam(event, 'id')

  if (!clinicId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Clinic ID is required'
    })
  }

  if (!pb.authStore.isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not authenticated'
    })
  }

  // Check if user is admin
  const userRole = pb.authStore.model?.role
  if (userRole !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    })
  }

  try {
    const body = await readBody(event)
    const { action, reason } = body // action: 'ban' | 'unban'

    const updateData: any = {}

    if (action === 'ban') {
      updateData.status = 'banned'
      updateData.bannedReason = reason || 'No reason provided'
      updateData.bannedBy = pb.authStore.model?.id
      updateData.bannedAt = new Date().toISOString()
    } else if (action === 'unban') {
      updateData.status = 'active'
      updateData.bannedReason = ''
      updateData.bannedBy = ''
      updateData.bannedAt = ''
    }

    const clinic = await pb.collection('clinics').update(clinicId, updateData)

    return {
      success: true,
      data: clinic,
      message: `Clinic ${action === 'ban' ? 'banned' : 'unbanned'} successfully`
    }
  } catch (error) {
    console.error('Error banning/unbanning clinic:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to ${action} clinic: ${error.message || error}`
    })
  }
})