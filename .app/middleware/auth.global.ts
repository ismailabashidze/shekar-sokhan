// This middleware is now handled by middleware.global.ts
// Kept for backwards compatibility - logic moved to avoid redirect loops
export default defineNuxtRouteMiddleware((to, from) => {
  // Auth logic is now handled in middleware.global.ts
  // This middleware is kept but does nothing to avoid conflicts
  return true
})
