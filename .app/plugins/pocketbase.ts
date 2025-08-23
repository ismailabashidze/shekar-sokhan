import PocketBase from 'pocketbase'

export default defineNuxtPlugin(() => {
  const POCKETBASE_URL = 'https://pocket.zehna.ir'
  // const POCKETBASE_URL = 'http://127.0.0.1:8090'
  // const POCKETBASE_URL = 'https://8ff7-2-190-129-92.ngrok-free.app'
  
  // Initialize PocketBase lazily
  let pbInstance: PocketBase | null = null
  
  const getPocketBase = () => {
    if (!pbInstance) {
      pbInstance = new PocketBase(POCKETBASE_URL)
      
      const cookie = useCookie('pb_auth', {
        path: '/',
        secure: true,
        sameSite: 'strict',
        httpOnly: false,
        maxAge: 604800,
      })

      // load the store data from the cookie value
      pbInstance.authStore.save(cookie.value?.token, cookie.value?.model)

      // send back the default 'pb_auth' cookie to the client with the latest store state
      pbInstance.authStore.onChange(() => {
        cookie.value = {
          token: pbInstance!.authStore.token,
          model: pbInstance!.authStore.model,
        }
      })
    }
    
    return pbInstance
  }

  // Only refresh auth if we're in a browser context
  if (process.client) {
    const pb = getPocketBase()
    // Use nextTick to ensure we're not blocking the main thread
    nextTick(async () => {
      try {
        // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
        if (pb.authStore.isValid) {
          await pb.collection('users').authRefresh()
        }
      }
      catch (_) {
        // clear the auth store on failed refresh
        pb.authStore.clear()
      }
    })
  }

  return {
    provide: { 
      pb: getPocketBase()
    },
  }
})
