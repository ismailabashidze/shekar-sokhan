import type { TherapyGoal } from './useSessionReports';

export interface SubGoal {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  completed_date?: string;
}

export interface TherapyGoalExtended extends TherapyGoal {
  user_id?: string;
  session_id?: string;
  description?: string;
  target_behaviors?: string[];
  success_criteria?: string[];
  sub_goals?: SubGoal[];
  ai_evaluation?: string;
  notes?: string;
  created?: string;
  updated?: string;
  goals?: any;
  suggestedDisordersToInvestigate?: any[];
}

export type { TherapyGoal };

export function useGoal() {
  const { $pb } = useNuxtApp();

  const getTherapyGoals = async (sessionId?: string): Promise<TherapyGoal[]> => {
    try {
      let filter = '';
      if (sessionId) {
        filter = `session_id = "${sessionId}"`;
      }

      const result = await $pb.collection('suggestedDisordersToInvestigate').getList(1, 50, {
        filter,
        sort: '-created',
      });

      return result.items as TherapyGoal[];
    }
    catch (error) {
      console.error('Failed to get therapy goals:', error);
      return [];
    }
  };

  const createTherapyGoal = async (goalData: any): Promise<TherapyGoal | null> => {
    try {
      const { user } = useUser();

      const data: any = {
        user: user.value?.id,
        suggestedDisordersToInvestigate: goalData,
      };

      const result = await $pb.collection('suggestedDisordersToInvestigate').create(data);
      console.log('Created therapy goal:', result);

      return result as TherapyGoal;
    }
    catch (error) {
      console.error('Failed to create therapy goal:', error);
      return null;
    }
  };

  const updateTherapyGoal = async (goalId: string, updates: Partial<TherapyGoal>): Promise<TherapyGoal> => {
    try {
      const result = await $pb.collection('suggestedDisordersToInvestigate').update(goalId, updates);
      return result as TherapyGoal;
    }
    catch (error) {
      console.error('Failed to update therapy goal:', error);
      throw error;
    }
  };

  const updateSubGoalStatus = async (
    goalId: string,
    subGoalIndex: number,
    status: 'pending' | 'in_progress' | 'completed',
  ): Promise<TherapyGoal> => {
    try {
      const goal = await $pb.collection('suggestedDisordersToInvestigate').getOne(goalId);

      const subGoals = goal.sub_goals || [];
      if (subGoalIndex >= 0 && subGoalIndex < subGoals.length) {
        subGoals[subGoalIndex].status = status;
        if (status === 'completed') {
          subGoals[subGoalIndex].completed_date = new Date().toISOString();
        }
      }

      const completedSubGoals = subGoals.filter((sg: SubGoal) => sg.status === 'completed').length;
      const progress_percentage = subGoals.length > 0
        ? Math.round((completedSubGoals / subGoals.length) * 100)
        : 0;

      const result = await $pb.collection('suggestedDisordersToInvestigate').update(goalId, {
        sub_goals: subGoals,
        progress_percentage,
        status: progress_percentage === 100 ? 'achieved' : 'in_progress',
      });

      return result as TherapyGoal;
    }
    catch (error) {
      console.error('Failed to update sub-goal status:', error);
      throw error;
    }
  };

  const deleteTherapyGoal = async (goalId: string): Promise<void> => {
    try {
      await $pb.collection('suggestedDisordersToInvestigate').delete(goalId);
    }
    catch (error) {
      console.error('Failed to delete therapy goal:', error);
      throw error;
    }
  };

  return {
    getTherapyGoals,
    createTherapyGoal,
    updateTherapyGoal,
    updateSubGoalStatus,
    deleteTherapyGoal,
  };
}
