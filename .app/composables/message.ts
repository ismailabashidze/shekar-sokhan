import { LLMMessage } from './llm'
import { User } from './user'

export type BackendMessage = {
  msgEn: string
  msgFa: string
  anonymousUser: User
  sender: 'user' | 'ai'
  evaluations: Object
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
  const filteredMessages = ref<string>('')
  const nuxtApp = useNuxtApp()
  const { user } = useUser()
  const getMessages = async () => {
    const { items } = await nuxtApp.$pb.collection('messages').getList(1, 500, {
      filter: `anonymousUser.anonymousCode=${user.value.anonymousCode}`,
    })
    messages.value = items
    return items
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
  // this only returns LLMMessage[]
  const filterMessages = (sender: 'user' | 'assistant') => {
    filteredMessages.value = (convertedMessages('LLMMessage') as LLMMessage[])
      .map((m: LLMMessage) => {
        if (m.role === sender) return m.content
        else return ''
      })
      .filter(
        (content: string | undefined) =>
          content !== undefined && content !== '',
      )
      .join('|')
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
    convertedMessages,
    filterMessages,
    saveMessage,
    getMessagesByCode,
    saveSummerizedMessages,
    getSummerizedMessagesByCode,
  }
}
