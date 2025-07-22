import PocketBase from 'pocketbase'

let pb: PocketBase | null = null

export function usePocketBase(): PocketBase {
  if (!pb) {
    // Initialize PocketBase instance
    pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090')
    
    // Auto authenticate as admin if credentials are provided
    if (process.env.POCKETBASE_ADMIN_EMAIL && process.env.POCKETBASE_ADMIN_PASSWORD) {
      pb.admins.authWithPassword(
        process.env.POCKETBASE_ADMIN_EMAIL,
        process.env.POCKETBASE_ADMIN_PASSWORD
      ).catch(error => {
        console.warn('Failed to authenticate PocketBase admin:', error)
      })
    }
  }
  
  return pb
}