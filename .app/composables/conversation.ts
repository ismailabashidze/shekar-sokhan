import { User } from './user'

export type BackendMessage = {
  msgEn: string
  msgFa: string
  anonymousUser: User
  sender: 'user' | 'ai'
}

export function useConversation() {
  const nuxtApp = useNuxtApp()
  const messages = ref<BackendMessage[]>([])
  const saveMessage = async (newMessage: BackendMessage) => {
    const savedMessage = await nuxtApp.$pb
      .collection('messages')
      .create(newMessage)
    messages.value.push(newMessage)
  }
  const getPreviousMessages = async (code: number) => {
    const dbMessages = await nuxtApp.$pb
      .collection('messages')
      .getList(1, 500, {
        filter: `anonymousUser.anonymousCode=${code}`,
        sort: '+created',
      })
    console.log(dbMessages.items)

    messages.value = dbMessages.items.map((db) => {
      return {
        type: db.sender === 'user' ? 'sent' : 'recieved',
        text: db.msgFa,
        time: new Date(db.created).toLocaleTimeString(),
        attachments: [],
      }
    })
  }
  return {
    messages,
    saveMessage,
    getPreviousMessages,
  }
}
