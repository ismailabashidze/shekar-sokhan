/**
 * Composable to check and manage collection availability
 */

export const useCollectionStatus = () => {
    const { $pb } = useNuxtApp()
    const pb = $pb as any

    const collectionStatus = ref<Record<string, boolean>>({
        notification_logs: false,
        system_metrics: false,
        notifications: false,
        notification_preferences: false,
        notification_campaigns: false
    })

    const isChecking = ref(false)

    /**
     * Check if a collection exists and is accessible
     */
    const checkCollection = async (collectionName: string): Promise<boolean> => {
        try {
            // Try to query the collection instead of getting metadata (requires less permissions)
            await pb.collection(collectionName).getList(1, 1)
            return true
        } catch (error) {
            // Collection doesn't exist (404) or not accessible (401)
            console.debug(`Collection ${collectionName} check failed:`, error)
            return false
        }
    }

    /**
     * Check all notification-related collections
     */
    const checkAllCollections = async (): Promise<Record<string, boolean>> => {
        if (isChecking.value) return collectionStatus.value

        isChecking.value = true
        try {
            const collections = Object.keys(collectionStatus.value)
            const results = await Promise.all(
                collections.map(async (name) => ({
                    name,
                    exists: await checkCollection(name)
                }))
            )

            const status: Record<string, boolean> = {}
            results.forEach(({ name, exists }) => {
                status[name] = exists
            })

            collectionStatus.value = status
            return status

        } catch (error) {
            console.error('❌ Error checking collections:', error)
            return collectionStatus.value
        } finally {
            isChecking.value = false
        }
    }

    /**
     * Check if monitoring collections are available
     */
    const areMonitoringCollectionsReady = computed(() => {
        return collectionStatus.value.notification_logs && collectionStatus.value.system_metrics
    })

    /**
     * Check if basic notification collections are available
     */
    const areNotificationCollectionsReady = computed(() => {
        return collectionStatus.value.notifications && collectionStatus.value.notification_preferences
    })

    /**
     * Get missing collections
     */
    const getMissingCollections = computed(() => {
        return Object.entries(collectionStatus.value)
            .filter(([_, exists]) => !exists)
            .map(([name]) => name)
    })

    /**
     * Setup missing collections (requires admin access)
     */
    const setupMissingCollections = async (): Promise<boolean> => {
        try {
            const { setupNotificationCollections } = await import('~/utils/setupNotificationCollections')
            const result = await setupNotificationCollections(pb)

            if (result) {
                // Recheck collections after setup
                await checkAllCollections()
            }

            return result
        } catch (error) {
            console.error('❌ Error setting up collections:', error)
            return false
        }
    }

    return {
        collectionStatus: readonly(collectionStatus),
        isChecking: readonly(isChecking),
        checkCollection,
        checkAllCollections,
        areMonitoringCollectionsReady,
        areNotificationCollectionsReady,
        getMissingCollections,
        setupMissingCollections
    }
}