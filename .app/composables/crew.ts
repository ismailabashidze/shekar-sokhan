export type AgentTask = 'counselling_agent' | 'patient_agent'
export type AgentAction = {
  task: AgentTask
  text: string
}

export function useCrew() {
  // const CREW_ADDRESS = 'http://localhost:5123/action'
  const CREW_ADDRESS = 'https://0a22-2-190-129-92.ngrok-free.app/action'

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
