export type User = {
  id: string
  anonymousCode: number
  lastMessageTime: Date
  created: string
}

export function useUser() {
  const nuxtApp = useNuxtApp()

  const user = useLocalStorage('user', {} as User)
  const generateAndSetCode = async () => {
    if (!user.value.anonymousCode && !process.server) {
      user.value.anonymousCode = Math.ceil(Math.random() * 1000000000)
      user.value.lastMessageTime = new Date()
      // create and register a new anonymous user to backend
      const nUser = await nuxtApp.$pb
        .collection('anonymousUsers')
        .create(user.value)
      user.value = nUser
    }
  }
  const getAllUsers = async () => {
    const users = await nuxtApp.$pb.collection('anonymousUsers').getFullList({
      sort: '-created',
    })
    return users
  }
  const removeUser = async (userId: string) => {
    const users = await nuxtApp.$pb.collection('anonymousUsers').delete(userId)
    return true
  }

  return {
    user,
    generateAndSetCode,
    getAllUsers,
    removeUser,
  }
}
