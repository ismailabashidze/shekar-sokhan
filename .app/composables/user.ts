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
  phoneNumber: string
  zones: string[] // Multi-select zones attribute
}

export function useUser() {
  const nuxtApp = useNuxtApp()
  const user = useLocalStorage('user', {} as User)
  const role = useLocalStorage('role', '')

  // Function to update user zones in PocketBase if empty
  const updateEmptyZonesInDatabase = async (userData: User) => {
    if (!userData.zones || (Array.isArray(userData.zones) && userData.zones.length === 0)) {
      try {
        // Update PocketBase with default zones
        const updatedRecord = await nuxtApp.$pb.collection('users').update(userData.id as string, {
          zones: ['hamdel'],
        })

        // Update local user object with server response
        const updatedUser = { ...userData, zones: ['hamdel'] }
        user.value = updatedUser

        console.log('Updated user zones in PocketBase:', userData.id)
        return updatedUser
      }
      catch (error) {
        console.error('Failed to update zones in PocketBase:', error)
        // Fallback: update locally only
        const fallbackUser = { ...userData, zones: ['hamdel'] }
        user.value = fallbackUser
        return fallbackUser
      }
    }
    return userData
  }

  // Watch for empty zones and update database
  const isUpdatingZones = ref(false)

  watchEffect(async () => {
    const userData = { ...user.value }

    // Only proceed if we have a user ID and no zones
    if (userData.id && (!userData.zones || (Array.isArray(userData.zones) && userData.zones.length === 0))) {
      if (!isUpdatingZones.value) {
        isUpdatingZones.value = true
        await updateEmptyZonesInDatabase(userData)
        isUpdatingZones.value = false
      }
    }
  })

  // Ensure zones are always available as an array
  const userWithZones = computed(() => {
    const userData = { ...user.value }
    return {
      ...userData,
      zones: userData.zones || ['hamdel'], // Default to hamdel as fallback
    }
  })

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
  const updateUser = async (u: User) => {
    const result = await nuxtApp.$pb.collection('users').update(u.id as string, u)
    // Ensure zones are included in the updated user object
    const updatedUser = { ...result, zones: result.zones || [] }
    user.value = updatedUser
    return updatedUser
  }

  const logout = async () => {
    // Clear user data from localStorage
    user.value = {} as User
    role.value = ''

    // Also clear PocketBase auth store
    nuxtApp.$pb.authStore.clear()

    // Note: Lock state is NOT cleared on logout
    // This is intentional - lock persists across sessions
    // User must enter PIN when logging back in
  }

  return {
    user: userWithZones,
    role,
    getAllUsers,
    setUser,
    updateUser,
    logout,
  }
}
