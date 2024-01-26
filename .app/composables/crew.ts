export type AgentAction = {
  task:
    | 'defence_labeler'
    | 'empathy_labeler'
    | 'make_open_questions'
    | 'primary_emotion_labeler'
    | 'secondary_emotion_labeler'
    | 'suicide_risk_labeler'
    | 'report_builder'
  text: string
}

export function useCrew() {
  const CREW_ADDRESS = 'http://localhost:5123/action'
  const agentAction = async (action: AgentAction) => {
    return await useFetch(CREW_ADDRESS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...action,
      }),
    })
  }
  return {
    agentAction,
  }
}
