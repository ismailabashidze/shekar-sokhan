import PocketBase from 'pocketbase'

export function createPocketBaseInstance(event: any): PocketBase {
  // Create PocketBase instance for server-side use
  const pb = new PocketBase('https://pocket.zehna.ir')
  
  // Get auth token from cookies
  const cookies = parseCookies(event)
  const authCookie = cookies.pb_auth
  
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie)
      pb.authStore.save(authData.token, authData.model)
    } catch (error) {
      console.error('Error parsing auth cookie:', error)
    }
  }
  
  return pb
}