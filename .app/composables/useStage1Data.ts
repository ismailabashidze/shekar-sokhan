// Composable for extracting and managing stage1 data
export const useStage1Data = () => {
  // Extract all data from stage1
  const extractStage1Data = () => {
    // This would typically be stored in a state management system
    // For now, we'll return the structure that should be available
    return {
      mainChallenge: '',
      researchDomain: [] as string[],
      focusLevel: '',
      whQuestions: {
        what: '',
        why: '',
        how: '',
        who: '',
        where: '',
        when: '',
      },
      swotData: {
        strengths: [] as string[],
        weaknesses: [] as string[],
        opportunities: [] as string[],
        threats: [] as string[],
      },
    };
  };

  // Get comprehensive context for AI processing
  const getContextForAI = (data: any) => {
    const focusLevelLabels = {
      applied: 'کاربردی',
      theoretical: 'نظری',
      interdisciplinary: 'بین‌رشته‌ای',
      mixed: 'ترکیبی',
    };

    let context = `چالش اصلی تحقیق: ${data.mainChallenge || 'مشخص نشده'}\n`;
    context += `حوزه‌های دانشی: ${data.researchDomain?.join(', ') || 'مشخص نشده'}\n`;
    context += `سطح تمرکز: ${focusLevelLabels[data.focusLevel] || 'مشخص نشده'}\n\n`;

    if (data.whQuestions) {
      const completedQuestions = Object.entries(data.whQuestions)
        .filter(([_, answer]) => answer && answer.trim())
        .map(([question, answer]) => `${question}: ${answer}`)
        .join('\n');
      
      if (completedQuestions) {
        context += `سؤالات WH:\n${completedQuestions}\n\n`;
      }
    }

    if (data.swotData) {
      const swotSections = [];
      if (data.swotData.strengths?.length) {
        swotSections.push(`نقاط قوت: ${data.swotData.strengths.join(', ')}`);
      }
      if (data.swotData.weaknesses?.length) {
        swotSections.push(`نقاط ضعف: ${data.swotData.weaknesses.join(', ')}`);
      }
      if (data.swotData.opportunities?.length) {
        swotSections.push(`فرصت‌ها: ${data.swotData.opportunities.join(', ')}`);
      }
      if (data.swotData.threats?.length) {
        swotSections.push(`تهدیدها: ${data.swotData.threats.join(', ')}`);
      }
      
      if (swotSections.length) {
        context += `تحلیل SWOT:\n${swotSections.join('\n')}\n\n`;
      }
    }

    return context;
  };

  return {
    extractStage1Data,
    getContextForAI,
  };
};