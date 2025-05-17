export type MetaObj = {
  avatarUrl: string
  expiry: string
  isNew: boolean
  email: string
  name: string
}
export type User = {
  username: string
  email: string
  hasCharge: boolean
  startChargeTime: string
  expireChargeTime: string
  role: string
  meta: MetaObj
}

export function useUser() {
  const nuxtApp = useNuxtApp()
  const user = useLocalStorage('user', {} as User)
  const role = useLocalStorage('role', '')
  const userRecord = useLocalStorage('userRecord', {} as Report)

  const getAllUsers = async () => {
    return await nuxtApp.$pb.collection('users').getFullList({
      sort: '-created',
    })
  }

  const setUser = async (u: User, r: string) => {
    user.value = u
    role.value = r
    return user
  }

  const updateUserRecord = async (r: Report) => {
    userRecord.value = r
    return userRecord
  }

  return {
    user,
    role,
    userRecord,
    getAllUsers,
    setUser,
    updateUserRecord,
  }
}
