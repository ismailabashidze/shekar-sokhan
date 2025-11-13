import { useOpenRouter } from './useOpenRouter';

export function useGoals() {
  const { $pb } = useNuxtApp();
  const { callOpenRouter } = useOpenRouter();

  const getGoalsByUser = async (userId: string) => {
    try {
      const result = await $pb.collection('suggestedDisordersToInvestigate').getList(1, 50, {
        filter: `user = "${userId}"`,
        sort: '-created',
      });

      return result.items;
    }
    catch (error) {
      console.error('Failed to get goals by user:', error);
      return [];
    }
  };

  const generateDiagnosisGoals = async (assessment: any, version: number = 1) => {
    try {
      console.log('Generating diagnosis goals for assessment:', assessment);

      const prompt = `
Based on the following assessment data, generate comprehensive DSM-5 diagnosis goals.
Analyze the user's responses and identify the top 3-5 most relevant DSM-5 categories.

Assessment Data:
- Mood: ${assessment.mood}
- Anxiety Level: ${assessment.anxietyLevel}
- Sleep Quality: ${assessment.sleepQuality}
- Stress Level: ${assessment.stressLevel || 'N/A'}
- Previous Mental Health: ${assessment.previousMentalHealth || 'N/A'}
- Ethnicity: ${assessment.ethnicity}
- Religion: ${assessment.religion}

For each relevant DSM-5 category, provide:
1. Category title (English and Persian)
2. Category description
3. Top 3-5 disorders within that category
4. For each disorder:
   - DSM-5 code
   - Title (Persian)
   - Description
   - Minimum criteria
   - Special notes
   - Prevalence
   - Development and course
   - Suicide risk assessment (low/moderate/high)

Return the response as a JSON array of categories.
`;

      const response = await callOpenRouter(prompt, {
        model: 'openai/gpt-4-turbo',
        temperature: 0.7,
        maxTokens: 4000,
      });

      return JSON.parse(response);
    }
    catch (error) {
      console.error('Failed to generate diagnosis goals:', error);
      return [];
    }
  };

  const updateGoalProgress = async (goalId: string, progress: number) => {
    try {
      return await $pb.collection('suggestedDisordersToInvestigate').update(goalId, {
        progress_percentage: progress,
        status: progress === 100 ? 'achieved' : progress > 0 ? 'in_progress' : 'pending',
      });
    }
    catch (error) {
      console.error('Failed to update goal progress:', error);
      throw error;
    }
  };

  return {
    getGoalsByUser,
    generateDiagnosisGoals,
    updateGoalProgress,
  };
}
