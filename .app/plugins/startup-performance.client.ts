// Utility to measure startup performance
export function measureStartup() {
  if (process.client) {
    // Measure time from navigation start to when the app is interactive
    const navigationStart = performance.timing.navigationStart
    const now = performance.now()
    
    // Log startup time
    console.log(`[Startup] App loaded in ${Math.round(now)}ms`)
    
    // Log performance metrics
    if ('memory' in performance) {
      // @ts-expect-error - memory is not in the standard Performance interface
      const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory
      console.log(`[Memory] Used: ${Math.round(usedJSHeapSize / 1024 / 1024)}MB, Total: ${Math.round(totalJSHeapSize / 1024 / 1024)}MB`)
    }
    
    // Log resource loading times
    const resources = performance.getEntriesByType('resource')
    const slowResources = resources
      .filter((r: any) => r.duration > 1000)
      .sort((a: any, b: any) => b.duration - a.duration)
      .slice(0, 5)
    
    if (slowResources.length > 0) {
      console.log('[Performance] Slow resources:')
      slowResources.forEach((r: any) => {
        console.log(`  ${r.name}: ${Math.round(r.duration)}ms`)
      })
    }
  }
}

// Measure startup when the app is ready
export default defineNuxtPlugin(() => {
  if (process.client) {
    onMounted(() => {
      // Small delay to ensure all resources are loaded
      setTimeout(() => {
        measureStartup()
      }, 1000)
    })
  }
})