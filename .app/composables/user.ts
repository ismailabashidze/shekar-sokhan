export type User = {
  id: string
  anonymousCode: number
  lastMessageTime: Date
  phoneNumber: string
  email: string
  password: string
  passwordConfirm: string
  created: string
  record: { id: string, currentDeletionDivider: number }
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
    return await nuxtApp.$pb.collection('users').getFullList({
      sort: '-created',
    })
  }
  const removeUser = async (userId: string) => {
    const users = await nuxtApp.$pb.collection('users').delete(userId)
    return true
  }

  const setUser = async (u: User) => {
    user.value = u
    return user
  }

  const incDivision = async () => {
    user.value.record.currentDeletionDivider++
    return user
  }
  const getUserDetails = async (userId: string) => {
    return await nuxtApp.$pb.collection('userDetails').getFullList({
      sort: '-created',
      filter: `user.id = "${userId}"`,
    })
  }
  const createUserDetails = async (ud) => {
    return await nuxtApp.$pb.collection('userDetails').create(ud)
  }
  return {
    user,
    generateAndSetCode,
    getAllUsers,
    removeUser,
    setUser,
    incDivision,
    getUserDetails,
    createUserDetails,
  }
}
