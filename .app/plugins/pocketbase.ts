import PocketBase from 'pocketbase'
import type { User } from '@/types'
import { useUser } from '~/composables/user'

export default defineNuxtPlugin(async () => {
  const POCKETBASE_URL = 'https://pocket.zehna.ir'
  // const POCKETBASE_URL = 'http://127.0.0.1:8090'
  // const POCKETBASE_URL = 'https://8ff7-2-190-129-92.ngrok-free.app'
  const pb = new PocketBase(POCKETBASE_URL)

  const cookie = useCookie('pb_auth', {
    path: '/',
    secure: true,
    sameSite: 'strict',
    httpOnly: false, // change to "true" if you want only server-side access
    maxAge: 604800,
  })

  // load the store data from the cookie value
  pb.authStore.save(cookie.value?.token, cookie.value?.model)

  // send back the default 'pb_auth' cookie to the client with the latest store state
  pb.authStore.onChange(() => {
    cookie.value = {
      token: pb.authStore.token,
      model: pb.authStore.model,
    }
  })

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    pb.authStore.isValid && (await pb.collection('users').authRefresh())

    // Sync user data from PocketBase to localStorage after auth refresh
    if (pb.authStore.isValid && pb.authStore.model) {
      const { user, setUser } = useUser()
      const pbUser = pb.authStore.model as any

      const syncedUser: User = {
        id: pbUser.id,
        username: pbUser.username,
        email: pbUser.email,
        hasCharge: pbUser.hasCharge,
        startChargeTime: pbUser.startChargeTime,
        expireChargeTime: pbUser.expireChargeTime,
        role: pbUser.role,
        avatar: pbUser.avatar,
        meta: pbUser.meta,
        phoneNumber: pbUser.phoneNumber,
        zones: pbUser.zones || [],
      }

      await setUser(syncedUser, pbUser.role || 'user')
    }
  }
  catch (_) {
    // clear the auth store on failed refresh
    pb.authStore.clear()
  }

  return {
    provide: { pb },
  }
})
