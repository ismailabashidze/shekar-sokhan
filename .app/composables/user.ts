export type User = {
  id: string
  anonymousCode: number
  lastMessageTime: Date
  phoneNumber: string
  email: string
  password: string
  passwordConfirm: string
  created: string
}

export function useUser() {
  const nuxtApp = useNuxtApp()

  const user = useLocalStorage('user', {} as User)
  const generateAndSetCode = async (phoneNumber: string) => {
    if (!process.server) {
      if (!user.value.anonymousCode) {
        user.value.anonymousCode = Math.ceil(Math.random() * 1000000000)
        user.value.lastMessageTime = new Date()
      }
      user.value.phoneNumber = phoneNumber
      user.value.password = phoneNumber + user.value.anonymousCode
      user.value.passwordConfirm = phoneNumber + user.value.anonymousCode
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

  const setUser = async (u: User) => {
    user.value = u
    return user
  }

  return {
    user,
    generateAndSetCode,
    getAllUsers,
    removeUser,
    setUser,
  }
}
