export function useAppVersion() {
  // استفاده از Nuxt runtime config
  const config = useRuntimeConfig()
  
  // Debug log
  console.log('useAppVersion: config.public =', config.public)
  console.log('useAppVersion: appVersion =', config.public?.appVersion)
  
  // ورژن به صورت reactive با fallback بهتر
  const version = computed(() => {
    const appVersion = config.public?.appVersion
    console.log('useAppVersion computed: appVersion =', appVersion)
    return appVersion || '2.9.0'
  })
  
  return {
    version: readonly(version)
  }
} 