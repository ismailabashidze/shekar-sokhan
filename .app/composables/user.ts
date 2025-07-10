export type MetaObj = {
  avatarUrl: string
  expiry: string
  isNew: boolean
  email: string
  name: string
}
export type User = {
  id?: string
  username: string
  email: string
  hasCharge: boolean
  startChargeTime: string
  expireChargeTime: string
  role: string
  avatar?: string // فیلد آواتار محلی
  meta: MetaObj
}

export function useUser() {
  const nuxtApp = useNuxtApp()
  const user = useLocalStorage('user', {} as User)
  const role = useLocalStorage('role', '')

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

  return {
    user,
    role,
    getAllUsers,
    setUser,
  }
}
