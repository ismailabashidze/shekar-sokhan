export type Report = {
  id?: string;
  created?: string;
  updated?: string;
  user: string;
  totalSessions: number;
  summaries: any[];
  finalDemographicProfile: any;
  possibleRiskFactors: any[];
  possibleDeeperGoals: any[];
};

export function useReport() {
  const nuxtApp = useNuxtApp();
  const pb = nuxtApp.$pb;

  const createReport = async (report: Omit<Report, 'id' | 'created' | 'updated'>) => {
    try {
      return await pb.collection('final_reports').create(report);
    }
    catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  };

  const getReports = async () => {
    try {
      return await pb.collection('final_reports').getList(1, 50, {
        sort: '-created',
        expand: 'user',
      });
    }
    catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  };

  const getReportById = async (id: string) => {
    try {
      return await pb.collection('final_reports').getOne(id, {
        expand: 'user',
      });
    }
    catch (error) {
      console.error(`Error fetching report with id ${id}:`, error);
      throw error;
    }
  };

  const updateReport = async (id: string, data: Partial<Report>) => {
    try {
      // Update remote only - sync with localStorage is handled by user.ts
      return await pb.collection('final_reports').update(id, data);
    }
    catch (error) {
      console.error(`Error updating report with id ${id}:`, error);
      throw error;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      return await pb.collection('final_reports').delete(id);
    }
    catch (error) {
      console.error(`Error deleting report with id ${id}:`, error);
      throw error;
    }
  };

  const getReportByUserId = async (userId: string) => {
    try {
      const result = await pb.collection('final_reports').getList(1, 1, {
        filter: `user="${userId}"`,
        expand: 'user',
      });
      return result.items[0] || null;
    }
    catch (error) {
      console.error(`Error fetching report for userId ${userId}:`, error);
      throw error;
    }
  };

  return {
    createReport,
    getReports,
    getReportById,
    updateReport,
    deleteReport,
    getReportByUserId,
  };
}
