export type Report = {
  user: User
  totalSessions: number
  summaries: string[]
  finalDemographicProfile: DemographicData
  possibleRiskFactors: string[]
  possibleDeeperGoals: string[]
}

export function useReport() {
  const nuxtApp = useNuxtApp()
  const pb = nuxtApp.$pb

  const createReport = async (report: Omit<Report, 'id' | 'created' | 'updated'>) => {
    try {
      return await pb.collection('final_reports').create(report)
    }
    catch (error) {
      console.error('Error creating report:', error)
      throw error
    }
  }

  const getReports = async () => {
    try {
      return await pb.collection('final_reports').getList(1, 50, {
        sort: '-created',
        expand: 'user',
      })
    }
    catch (error) {
      console.error('Error fetching reports:', error)
      throw error
    }
  }

  const getReportById = async (id: string) => {
    try {
      return await pb.collection('final_reports').getOne(id, {
        expand: 'user',
      })
    }
    catch (error) {
      console.error(`Error fetching report with id ${id}:`, error)
      throw error
    }
  }

  const updateReport = async (id: string, data: Partial<Report>) => {
    try {
      // Update remote
      const updated = await pb.collection('final_reports').update(id, data)
      // Update localStorage
      const userRecord = useLocalStorage('userRecord', {} as Report)
      if (userRecord.value && userRecord.value.id === id) {
        userRecord.value = { ...userRecord.value, ...data }
      }
      return updated
    } catch (error) {
      console.error(`Error updating report with id ${id}:`, error)
      throw error
    }
  }

  const deleteReport = async (id: string) => {
    try {
      return await pb.collection('final_reports').delete(id)
    }
    catch (error) {
      console.error(`Error deleting report with id ${id}:`, error)
      throw error
    }
  }

  const getReportByUserId = async (userId: string) => {
    try {
      const result = await pb.collection('final_reports').getList(1, 1, {
        filter: `user="${userId}"`,
        expand: 'user',
      })
      return result.items[0] || null
    }
    catch (error) {
      console.error(`Error fetching report for userId ${userId}:`, error)
      throw error
    }
  }

  return {
    createReport,
    getReports,
    getReportById,
    updateReport,
    deleteReport,
    getReportByUserId,
  }
}
