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
  const toaster = useToaster()
  const { user } = useUser()
  const getMessages = async (): Promise<BackendMessage[]> => {
    // if (!nuxtApp.$pb.authStore.isValid) {
    //   try {
    //     // const authData = await nuxtApp.$pb.collection('users').authRefresh()
    //   } catch (e) {
    //     if (e.status == 401) {
    //       toaster.clearAll()
    //       toaster.show({
    //         title: 'احراز هویت', // Authentication
    //         message: `لطفا دوباره وارد شوید`, // Please log in again
    //         color: 'warning',
    //         icon: 'ph:warning',
    //         closable: true,
    //       })
    //       // Redirect to login page with a 401 redirect code
    //       navigateTo('/auth/login', { redirectCode: 401 })
    //     }
    //   }
    // }
    const { items } = await nuxtApp.$pb.collection('messages').getList(1, 500, {
      filter: 'isDeleted=false',
      sort: '+created',
    })
    messages.value = items
    return items
  }
  const saveMessage = async (newMessage: BackendMessage) => {
    try {
      await nuxtApp.$pb.collection('messages').create(newMessage)
      messages.value.push(newMessage)
      return 'success'
    } catch (e) {
      // if (e.status === 400 && e.message === 'You have to charge account.') {
      if (e.status === 400) {
        toaster.clearAll()
        toaster.show({
          title: 'پایان حق اشتراک',
          message: `اشتراک شما پایان یافته و نیازمند تمدید است.`,
          color: 'danger',
          icon: 'ph:warning',
          closable: true,
        })
        navigateTo('/onboarding')
      }
      return 'error'
    }
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
    const res = await $fetch('https://back.zehna.ir/deleteAllMessages', {
      method: 'POST',
      body: { userId },
    })
    return res
  }
  return {
    messages,
    filteredMessages,
    getMessages,
    saveMessage,
    getMessagesByCode,
    saveSummerizedMessages,
    getSummerizedMessagesByCode,
    deleteAllMessages,
  }
}
