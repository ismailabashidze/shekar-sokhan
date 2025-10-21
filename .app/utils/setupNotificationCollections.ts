/**
 * Utility to setup missing notification collections in PocketBase
 * This should be run once to create the required collections
 */

import type PocketBase from 'pocketbase'

export async function setupNotificationCollections(pb: PocketBase) {
    try {
        console.log('🔧 Setting up notification collections...')

        // Check if collections already exist
        const collections = await pb.collections.getFullList()
        const existingNames = collections.map(c => c.name)

        // Create notification_logs collection if it doesn't exist
        if (!existingNames.includes('notification_logs')) {
            console.log('📝 Creating notification_logs collection...')

            await pb.collections.create({
                name: 'notification_logs',
                type: 'base',
                schema: [
                    {
                        name: 'level',
                        type: 'select',
                        required: true,
                        options: {
                            maxSelect: 1,
                            values: ['DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL']
                        }
                    },
                    {
                        name: 'category',
                        type: 'select',
                        required: true,
                        options: {
                            maxSelect: 1,
                            values: [
                                'NOTIFICATION_DELIVERY',
                                'FCM_TOKEN',
                                'SCHEDULING',
                                'TEMPLATE_RENDERING',
                                'USER_GROUPS',
                                'CAMPAIGNS',
                                'SERVICE_WORKER',
                                'DATABASE',
                                'AUTHENTICATION',
                                'SYSTEM',
                                'PERFORMANCE',
                                'USER_INTERACTION'
                            ]
                        }
                    },
                    {
                        name: 'message',
                        type: 'text',
                        required: true
                    },
                    {
                        name: 'details',
                        type: 'json',
                        required: false,
                        options: {
                            maxSize: 2000000
                        }
                    },
                    {
                        name: 'user_id',
                        type: 'relation',
                        required: false,
                        options: {
                            collectionId: 'ak540af3bt3w7r8', // users collection ID
                            cascadeDelete: false,
                            maxSelect: 1
                        }
                    },
                    {
                        name: 'session_id',
                        type: 'text',
                        required: false
                    },
                    {
                        name: 'campaign_id',
                        type: 'text',
                        required: false
                    },
                    {
                        name: 'notification_id',
                        type: 'text',
                        required: false
                    },
                    {
                        name: 'component',
                        type: 'text',
                        required: false
                    },
                    {
                        name: 'method',
                        type: 'text',
                        required: false
                    },
                    {
                        name: 'duration_ms',
                        type: 'number',
                        required: false,
                        options: {
                            noDecimal: true
                        }
                    },
                    {
                        name: 'memory_usage',
                        type: 'number',
                        required: false,
                        options: {
                            noDecimal: true
                        }
                    },
                    {
                        name: 'error_stack',
                        type: 'text',
                        required: false
                    },
                    {
                        name: 'user_agent',
                        type: 'text',
                        required: false
                    },
                    {
                        name: 'ip_address',
                        type: 'text',
                        required: false
                    },
                    {
                        name: 'timestamp',
                        type: 'date',
                        required: true
                    }
                ],
                listRule: '@request.auth.role = "admin"',
                viewRule: '@request.auth.role = "admin"',
                createRule: '@request.auth.id != ""',
                updateRule: null,
                deleteRule: '@request.auth.role = "admin"'
            })

            console.log('✅ notification_logs collection created')
        }

        // Create system_metrics collection if it doesn't exist
        if (!existingNames.includes('system_metrics')) {
            console.log('📊 Creating system_metrics collection...')

            await pb.collections.create({
                name: 'system_metrics',
                type: 'base',
                schema: [
                    {
                        name: 'timestamp',
                        type: 'date',
                        required: true
                    },
                    {
                        name: 'notification_delivery_rate',
                        type: 'number',
                        required: true,
                        options: {
                            min: 0,
                            max: 100,
                            noDecimal: false
                        }
                    },
                    {
                        name: 'fcm_token_success_rate',
                        type: 'number',
                        required: true,
                        options: {
                            min: 0,
                            max: 100,
                            noDecimal: false
                        }
                    },
                    {
                        name: 'template_render_success_rate',
                        type: 'number',
                        required: true,
                        options: {
                            min: 0,
                            max: 100,
                            noDecimal: false
                        }
                    },
                    {
                        name: 'database_response_time',
                        type: 'number',
                        required: true,
                        options: {
                            min: 0,
                            noDecimal: true
                        }
                    },
                    {
                        name: 'error_rate',
                        type: 'number',
                        required: true,
                        options: {
                            min: 0,
                            max: 100,
                            noDecimal: false
                        }
                    },
                    {
                        name: 'active_campaigns',
                        type: 'number',
                        required: true,
                        options: {
                            min: 0,
                            noDecimal: true
                        }
                    },
                    {
                        name: 'pending_notifications',
                        type: 'number',
                        required: true,
                        options: {
                            min: 0,
                            noDecimal: true
                        }
                    },
                    {
                        name: 'failed_notifications',
                        type: 'number',
                        required: true,
                        options: {
                            min: 0,
                            noDecimal: true
                        }
                    },
                    {
                        name: 'memory_usage',
                        type: 'number',
                        required: true,
                        options: {
                            min: 0,
                            noDecimal: true
                        }
                    },
                    {
                        name: 'cpu_usage',
                        type: 'number',
                        required: false,
                        options: {
                            min: 0,
                            max: 100,
                            noDecimal: false
                        }
                    },
                    {
                        name: 'network_latency',
                        type: 'number',
                        required: false,
                        options: {
                            min: 0,
                            noDecimal: true
                        }
                    },
                    {
                        name: 'service_worker_status',
                        type: 'select',
                        required: true,
                        options: {
                            maxSelect: 1,
                            values: ['active', 'inactive', 'error']
                        }
                    },
                    {
                        name: 'user_engagement_score',
                        type: 'number',
                        required: true,
                        options: {
                            min: 0,
                            max: 100,
                            noDecimal: false
                        }
                    }
                ],
                listRule: '@request.auth.role = "admin"',
                viewRule: '@request.auth.role = "admin"',
                createRule: '@request.auth.id != ""',
                updateRule: null,
                deleteRule: '@request.auth.role = "admin"'
            })

            console.log('✅ system_metrics collection created')
        }

        console.log('✅ All notification collections setup complete')
        return true

    } catch (error) {
        console.error('❌ Error setting up notification collections:', error)
        return false
    }
}

/**
 * Check if required collections exist
 */
export async function checkNotificationCollections(pb: PocketBase): Promise<{
    notification_logs: boolean
    system_metrics: boolean
}> {
    try {
        const collections = await pb.collections.getFullList()
        const existingNames = collections.map(c => c.name)

        return {
            notification_logs: existingNames.includes('notification_logs'),
            system_metrics: existingNames.includes('system_metrics')
        }
    } catch (error) {
        console.error('❌ Error checking collections:', error)
        return {
            notification_logs: false,
            system_metrics: false
        }
    }
}