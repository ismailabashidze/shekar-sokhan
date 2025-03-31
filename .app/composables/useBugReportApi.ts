export interface BugReport {
  id?: string
  title: string
  shortDesc: string
  longDesc: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: 'ui' | 'functionality' | 'efficiency' | 'security' | 'other'
  seen: boolean
  resolved: boolean
  created?: string
  updated?: string
  user?: string
}

export function useBugReportApi() {
  const nuxtApp = useNuxtApp()

  const createBugReport = async (bugReport: Omit<BugReport, 'id' | 'seen' | 'resolved' | 'created' | 'updated'>) => {
    try {
      const newReport = {
        ...bugReport,
        seen: false,
        resolved: false,
        user: nuxtApp.$pb.authStore.user?.id,
      }
      console.log('hey')
      console.log(newReport)

      return await nuxtApp.$pb.collection('bug_reports').create(newReport)
    }
    catch (error) {
      console.error('Error creating bug report:', error)
      throw error
    }
  }

  const getBugReports = async () => {
    try {
      return await nuxtApp.$pb.collection('bug_reports').getList(1, 50, {
        sort: '-created',
        expand: 'user',
      })
    }
    catch (error) {
      console.error('Error fetching bug reports:', error)
      throw error
    }
  }

  const getBugReportById = async (id: string) => {
    try {
      return await nuxtApp.$pb.collection('bug_reports').getOne(id, {
        expand: 'user',
      })
    }
    catch (error) {
      console.error(`Error fetching bug report with id ${id}:`, error)
      throw error
    }
  }

  const updateBugReport = async (id: string, data: Partial<BugReport>) => {
    try {
      return await nuxtApp.$pb.collection('bug_reports').update(id, data)
    }
    catch (error) {
      console.error(`Error updating bug report with id ${id}:`, error)
      throw error
    }
  }

  const markAsSeen = async (id: string) => {
    return updateBugReport(id, { seen: true })
  }

  const markAsResolved = async (id: string) => {
    return updateBugReport(id, { resolved: true })
  }

  const markAsUnresolved = async (id: string) => {
    return updateBugReport(id, { resolved: false })
  }

  return {
    createBugReport,
    getBugReports,
    getBugReportById,
    updateBugReport,
    markAsSeen,
    markAsResolved,
    markAsUnresolved,
  }
}
