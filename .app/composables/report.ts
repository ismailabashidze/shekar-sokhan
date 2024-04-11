import { User } from './user'

export type Report = {
  anonymousUser: User
  info: Object
}

export function useReport() {
  const nuxtApp = useNuxtApp()
  const { user } = useUser()
  const { agentAction } = useCrew()

  const report = useLocalStorage('report', {} as Report)
  const createReport = async () => {
    if (user.value.id) {
      report.value = await nuxtApp.$pb
        .collection('reports')
        .create({ anonymousUser: user.value.id })
    }
  }
  const udpateReport = async (newMessage: string) => {
    if (!process.server) {
      // update the report based on new information
      // using crew and report_builder
      const r = await agentAction({
        task: 'report_builder',
        text: newMessage,
      })
      const nReport = await nuxtApp.$pb
        .collection('reports')
        .update(report.value.id, {
          info: { ...report.value.info, ...JSON.parse(r.data.value.result) },
        })
      report.value = nReport
    }
  }
  return {
    report,
    createReport,
    udpateReport,
  }
}
