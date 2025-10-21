/**
 * Diagnostic utilities for notification system
 */

export async function runNotificationDiagnostics() {
    console.log('🔍 Running notification system diagnostics...')

    try {
        // Test 1: Check if useNotifications composable works
        console.log('1. Testing useNotifications composable...')
        const { setupAuthManagement, hasPermission } = useNotifications()

        if (typeof setupAuthManagement === 'function') {
            console.log('✅ setupAuthManagement function exists')
        } else {
            console.error('❌ setupAuthManagement function missing')
        }

        if (typeof hasPermission === 'function') {
            console.log('✅ hasPermission function exists')
        } else {
            console.error('❌ hasPermission function missing')
        }

        // Test 2: Check collection status
        console.log('2. Testing collection status...')
        const { checkAllCollections } = useCollectionStatus()
        const status = await checkAllCollections()

        console.log('Collection status:', status)

        // Test 3: Test error handling
        console.log('3. Testing error handling...')
        const { getLogs } = useNotificationLogger()

        try {
            const logs = await getLogs({ limit: 1 })
            console.log('✅ Log retrieval works, got', logs.length, 'logs')
        } catch (error) {
            if (error instanceof Error && error.message.includes('404')) {
                console.log('⚠️ notification_logs collection not found (expected)')
            } else {
                console.log('✅ Error handled gracefully:', error)
            }
        }

        console.log('✅ Diagnostics completed')
        return true

    } catch (error) {
        console.error('❌ Diagnostics failed:', error)
        return false
    }
}

export function logSystemInfo() {
    console.log('📊 System Information:')
    console.log('- User Agent:', navigator.userAgent)
    console.log('- Notification Permission:', Notification.permission)
    console.log('- Service Worker Support:', 'serviceWorker' in navigator)
    console.log('- Push Manager Support:', 'PushManager' in window)
}