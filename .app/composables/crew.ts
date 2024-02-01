export type AgentTask =
  | 'defence_labeler'
  | 'empathy_labeler'
  | 'make_open_questions'
  | 'primary_emotion_labeler'
  | 'secondary_emotion_labeler'
  | 'suicide_risk_labeler'
  | 'report_builder'
  | 'counselling_agent'
  | 'patient_agent'
export type AgentAction = {
  task: AgentTask
  text: string
}

export function useCrew() {
  // const CREW_ADDRESS = 'http://localhost:5123/action'
  const CREW_ADDRESS = 'https://aa56-185-237-14-67.ngrok-free.app/action'

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
