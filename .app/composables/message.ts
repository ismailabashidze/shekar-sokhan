import { LLMMessage } from './llm'
import { User } from './user'

export type BackendMessage = {
  msgEn: string
  msgFa: string
  anonymousUser: User
  sender: 'user' | 'ai'
}

export type UIMessage = {
  type: 'recieved' | 'separator' | 'sent'
  text: string
  time: string
  attachments: []
}
export type MessageType =
  | 'LLMMessage'
  | 'BackendMessage'
  | 'UIMessage'
  | undefined
export function useMessage() {
  const messages = ref<BackendMessage[]>([])
  const nuxtApp = useNuxtApp()
  const { user } = useUser()
  const getMessages = async () => {
    const { items } = await nuxtApp.$pb.collection('messages').getList(1, 500, {
      filter: `anonymousUser.anonymousCode=${user.value.anonymousCode}`,
    })
    messages.value = items
  }
  const convertedMessages = (type: MessageType = undefined) => {
    return messages.value
      .sort((a, b) => new Date(a.created) - new Date(b.created))
      .map((m) => {
        if (!type || type === 'BackendMessage') return m
        else if (type === 'LLMMessage') {
          return {
            role: m.sender === 'ai' ? 'assistant' : 'user',
            content: m.msgEn,
          } as LLMMessage
        } else if (type === 'UIMessage') {
          return {
            type: m.sender === 'ai' ? 'recieved' : 'sent',
            text: m.msgFa,
            time: new Date(m.created).toLocaleTimeString('fa'),
            attachments: [],
          }
        }
      })
  }
  const saveMessage = async (newMessage: BackendMessage) => {
    await nuxtApp.$pb.collection('messages').create(newMessage)
    messages.value.push(newMessage)
  }
  return {
    messages,
    getMessages,
    convertedMessages,
    saveMessage,
  }
}
