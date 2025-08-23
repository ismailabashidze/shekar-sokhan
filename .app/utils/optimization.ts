// Utility functions for environment-based optimizations
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

// Lazy loading helper
export function lazyLoad<T>(loader: () => Promise<T>): () => Promise<T> {
  let loaded: Promise<T> | null = null
  return () => {
    if (!loaded) {
      loaded = loader()
    }
    return loaded
  }
}

// Conditional execution based on environment
export function devOnly<T>(fn: () => T): T | undefined {
  return isDevelopment ? fn() : undefined
}

export function prodOnly<T>(fn: () => T): T | undefined {
  return isProduction ? fn() : undefined
}

// Delay execution in development
export function devDelay(ms: number = 100): Promise<void> {
  return isDevelopment ? new Promise(resolve => setTimeout(resolve, ms)) : Promise.resolve()
}