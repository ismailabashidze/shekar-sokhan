export type AgentTask = 'riskEvaluation'
export type AgentAction = {
  task: AgentTask
  text: string
}

export function useGuidance() {
  // const GUIDANCE_ADDRESS = 'http://localhost:5123/action'
  const GUIDANCE_ADDRESS = 'https://0a22-2-190-129-92.ngrok-free.app/action'

  const agentAction = async (action: AgentAction) => {
    return await useFetch(GUIDANCE_ADDRESS, {
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
