import type { Clinic, ClinicPsychologist, ClinicRegistration } from '~/types/wizard'

export type ClinicStatus = 'active' | 'inactive' | 'pending'

export type ClinicFilter = {
  status?: ClinicStatus
  search?: string
  page?: number
  perPage?: number
  sort?: string
}

export function useClinic() {
  const nuxtApp = useNuxtApp()
  const toaster = useToaster()

  // Get all clinics (admin only)
  const getClinics = async (filter?: ClinicFilter) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      // Build filter string
      let filterStr = ''
      const filterConditions = []

      if (filter?.status) {
        filterConditions.push(`status = "${filter.status}"`)
      }
      if (filter?.search) {
        const searchTerm = filter.search.toLowerCase()
        filterConditions.push(`(name ~ "${searchTerm}" || address ~ "${searchTerm}" || email ~ "${searchTerm}")`)
      }

      if (filterConditions.length > 0) {
        filterStr = filterConditions.join(' && ')
      }

      // Pagination parameters
      const page = filter?.page || 1
      const perPage = filter?.perPage || 10
      const sort = filter?.sort || '-created'

      // Fetch clinics with pagination
      const result = await nuxtApp.$pb.collection('clinics').getList(page, perPage, {
        sort,
        filter: filterStr,
        expand: 'owner',
      })

      return {
        data: result.items,
        page: result.page,
        perPage: result.perPage,
        total: result.totalItems,
        totalPages: result.totalPages,
      }
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return {
          data: [],
          page: 1,
          perPage: 10,
          total: 0,
          totalPages: 0,
        }
      }
      throw error
    }
  }

  // Get user's clinics (clinic owner)
  const getUserClinics = async () => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const userId = nuxtApp.$pb.authStore.model?.id
      const result = await nuxtApp.$pb.collection('clinics').getFullList({
        sort: '-created',
        filter: `owner = "${userId}"`,
        expand: 'owner',
      })

      return {
        data: result,
        total: result.length,
      }
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return { data: [], total: 0 }
      }
      throw error
    }
  }

  // Get single clinic
  const getClinic = async (id: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const result = await nuxtApp.$pb.collection('clinics').getOne(id, {
        expand: 'owner',
      })

      return { data: result }
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  // Create clinic
  const createClinic = async (data: ClinicRegistration) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const clinicData = {
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        license: data.license,
        description: data.description || '',
        owner: nuxtApp.$pb.authStore.model?.id,
        status: 'pending',
      }

      const clinic = await nuxtApp.$pb.collection('clinics').create(clinicData)
      
      return {
        success: true,
        data: clinic,
      }
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  // Update clinic
  const updateClinic = async (id: string, data: Partial<Clinic>) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const clinic = await nuxtApp.$pb.collection('clinics').update(id, data)
      
      return {
        success: true,
        data: clinic,
      }
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  // Delete clinic
  const deleteClinic = async (id: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      await nuxtApp.$pb.collection('clinics').delete(id)
      
      return {
        success: true,
        message: 'Clinic deleted successfully',
      }
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  // Get clinic psychologists
  const getClinicPsychologists = async (clinicId: string, page = 1, perPage = 10) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const result = await nuxtApp.$pb.collection('clinic_psychologists').getList(page, perPage, {
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
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return {
          data: [],
          page: 1,
          perPage: 10,
          total: 0,
          totalPages: 0,
        }
      }
      throw error
    }
  }

  // Add psychologist to clinic
  const addPsychologistToClinic = async (clinicId: string, psychologistId: string, role: 'owner' | 'member' = 'member') => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const clinicPsychologist = {
        clinic: clinicId,
        psychologist: psychologistId,
        role,
        status: 'active',
      }

      const result = await nuxtApp.$pb.collection('clinic_psychologists').create(clinicPsychologist)
      
      return {
        success: true,
        data: result,
      }
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  // Update psychologist role/status in clinic
  const updatePsychologistInClinic = async (clinicId: string, psychologistId: string, data: { role?: 'owner' | 'member', status?: 'active' | 'inactive' }) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      // Find the relationship record
      const relationships = await nuxtApp.$pb.collection('clinic_psychologists').getList(1, 1, {
        filter: `clinic = "${clinicId}" && psychologist = "${psychologistId}"`,
      })

      if (relationships.items.length === 0) {
        throw new Error('Relationship not found')
      }

      const relationship = await nuxtApp.$pb.collection('clinic_psychologists').update(relationships.items[0].id, data)
      
      return {
        success: true,
        data: relationship,
      }
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  // Remove psychologist from clinic
  const removePsychologistFromClinic = async (clinicId: string, psychologistId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      // Find the relationship record
      const relationships = await nuxtApp.$pb.collection('clinic_psychologists').getList(1, 1, {
        filter: `clinic = "${clinicId}" && psychologist = "${psychologistId}"`,
      })

      if (relationships.items.length === 0) {
        throw new Error('Relationship not found')
      }

      await nuxtApp.$pb.collection('clinic_psychologists').delete(relationships.items[0].id)
      
      return {
        success: true,
        message: 'Psychologist removed from clinic',
      }
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  // Get psychologist's clinics
  const getPsychologistClinics = async (psychologistId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const result = await nuxtApp.$pb.collection('clinic_psychologists').getFullList({
        filter: `psychologist = "${psychologistId}" && status = "active"`,
        expand: 'clinic',
        sort: '-created',
      })

      return {
        data: result,
        total: result.length,
      }
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return { data: [], total: 0 }
      }
      throw error
    }
  }

  return {
    getClinics,
    getUserClinics,
    getClinic,
    createClinic,
    updateClinic,
    deleteClinic,
    getClinicPsychologists,
    addPsychologistToClinic,
    updatePsychologistInClinic,
    removePsychologistFromClinic,
    getPsychologistClinics,
  }
}