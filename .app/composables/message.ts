export type Content = {
  message?: string
  thoughts?: string
  action?: string
  nextSteps?: string
}
// export type BackendMessage = {
//   role: 'system' | 'user' | 'assistant' | 'separator'
//   content: Content
//   contentFa?: Content
//   time?: string
//   created?: string
//   Updated?: string
//   user?: string
//   deletionDivider: number
// }

export function useMessage() {
  const messages = ref([])
  // const messages = ref<BackendMessage[]>([])
  const filteredMessages = ref<string>('')
  const nuxtApp = useNuxtApp()
  const toaster = useToaster()
  const { user } = useUser()
  const getMessages = async () => {
    if (typeof user.value.record == 'undefined') {
      user.value.record = {}
      user.value.record.currentDeletionDivider = 0
    }

    const { items } = await nuxtApp.$pb.collection('messages').getList(1, 500, {
      filter: 'deletionDivider=' + user.value.record?.currentDeletionDivider,
      sort: '+created',
    })
    messages.value = items
    return items
  }
  const saveMessage = async (newMessage) => {
    try {
      const res = await nuxtApp.$pb.collection('messages').create(newMessage)
      messages.value.push(newMessage)
      return res
    }
    catch (e) {
      console.log('e')
      console.log(e)

      // if (e.status === 400) {
      //   toaster.clearAll()
      //   toaster.show({
      //     title: 'پایان حق اشتراک',
      //     message: `اشتراک شما پایان یافته و نیازمند تمدید است.`,
      //     color: 'danger',
      //     icon: 'ph:warning',
      //     closable: true,
      //   })
      //   navigateTo('/onboarding')
      // }
      return 'error'
    }
  }
  const getThoughtsByUserId = async (userId: string) => {
    const { items } = await nuxtApp.$pb.collection('messages').getList(1, 500, {
      filter: `isDeleted = false && user.id = "${userId}"`,
      sort: '+created',
    })
    messages.value = items
    return items
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
  const deleteAllMessages = async (userId: string) => {
    return await $fetch('https://back.zehna.ir/deleteAllMessages', {
      method: 'POST',
      body: { userId },
    })
  }
  const deleteMessage = async (messageId: string) => {
    return await nuxtApp.$pb.collection('messages').delete(messageId)
  }
  const addEditToMessage = async (v) => {
    const messageId = v.id
    const data = {
      content: v.content,
      contentFa: v.contentFa,
      user: v.user,
      deletionDivider: v.deletionDivider,
      role: v.role,
      correctedContentFa: v.sliced.join('\n'),
    }

    return await nuxtApp.$pb.collection('messages').update(messageId, data)
  }

  return {
    messages,
    filteredMessages,
    getMessages,
    saveMessage,
    getThoughtsByUserId,
    getMessagesByCode,
    saveSummerizedMessages,
    getSummerizedMessagesByCode,
    deleteAllMessages,
    deleteMessage,
    addEditToMessage,
  }
}
