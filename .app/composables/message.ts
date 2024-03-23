export type BackendMessage = {
  role: 'system' | 'user' | 'assistant' | 'separator'
  content: string
  translatedFa?: string
  anonymousUser?: string
  evaluations?: Object
  time?: string
  created?: string
  Updated?: string
}

export function useMessage() {
  const messages = ref<BackendMessage[]>([])
  const filteredMessages = ref<string>('')
  const nuxtApp = useNuxtApp()
  const { user } = useUser()
  const getMessages = async (): Promise<BackendMessage[]> => {
    const { items } = await nuxtApp.$pb.collection('messages').getList(1, 500, {
      sort: '+created',
    })
    messages.value = items
    return items
  }
  const saveMessage = async (newMessage: BackendMessage) => {
    await nuxtApp.$pb.collection('messages').create(newMessage)
    messages.value.push(newMessage)
  }
  const getMessagesByCode = async (code: string) => {
    const { items } = await nuxtApp.$pb.collection('messages').getList(1, 500, {
      filter: `anonymousUser.anonymousCode=${code}`,
    })
    messages.value = items
    return items
  }
  const saveSummerizedMessages = async (newMessage: any) => {
    return await nuxtApp.$pb.collection('summerizedMessages').create(newMessage)
  }
  const getSummerizedMessagesByCode = async (code: string) => {
    const { items } = await nuxtApp.$pb
      .collection('summerizedMessages')
      .getList(1, 500, {
        filter: `anonymousUser.anonymousCode=${code}`,
      })
    return items
  }
  return {
    messages,
    filteredMessages,
    getMessages,
    saveMessage,
    getMessagesByCode,
    saveSummerizedMessages,
    getSummerizedMessagesByCode,
  }
}
