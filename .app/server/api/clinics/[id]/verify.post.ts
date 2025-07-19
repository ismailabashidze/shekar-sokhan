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
    const { action, notes } = body // action: 'approve' | 'reject' | 'under_review'

    const updateData: any = {
      verificationStatus: action,
      verificationNotes: notes || '',
      verifiedBy: pb.authStore.model?.id,
      verifiedAt: new Date().toISOString()
    }

    // Update clinic status based on verification action
    if (action === 'approved') {
      updateData.status = 'verified'
    } else if (action === 'rejected') {
      updateData.status = 'inactive'
    } else if (action === 'under_review') {
      updateData.status = 'pending'
    }

    const clinic = await pb.collection('clinics').update(clinicId, updateData)

    return {
      success: true,
      data: clinic,
      message: `Clinic ${action} successfully`
    }
  } catch (error) {
    console.error('Error verifying clinic:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to verify clinic: ${error.message || error}`
    })
  }
})