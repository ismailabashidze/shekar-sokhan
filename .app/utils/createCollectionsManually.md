# Manual Collection Setup Guide

If you're seeing 404 errors for `notification_logs` and `system_metrics` collections, you need to create them manually in your PocketBase admin panel.

## Step 1: Access PocketBase Admin Panel

1. Go to your PocketBase admin panel (usually at `https://your-domain.com/_/`)
2. Login with your admin credentials

## Step 2: Create notification_logs Collection

1. Click "Collections" in the sidebar
2. Click "New collection"
3. Set name to: `notification_logs`
4. Set type to: `Base`
5. Add the following fields:

### Fields for notification_logs:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| level | select | Yes | Values: DEBUG, INFO, WARN, ERROR, CRITICAL |
| category | select | Yes | Values: NOTIFICATION_DELIVERY, FCM_TOKEN, SCHEDULING, TEMPLATE_RENDERING, USER_GROUPS, CAMPAIGNS, SERVICE_WORKER, DATABASE, AUTHENTICATION, SYSTEM, PERFORMANCE, USER_INTERACTION |
| message | text | Yes | - |
| details | json | No | Max size: 2000000 |
| user_id | relation | No | Collection: users, Max select: 1 |
| session_id | text | No | - |
| campaign_id | text | No | - |
| notification_id | text | No | - |
| component | text | No | - |
| method | text | No | - |
| duration_ms | number | No | No decimal: true |
| memory_usage | number | No | No decimal: true |
| error_stack | text | No | - |
| user_agent | text | No | - |
| ip_address | text | No | - |
| timestamp | date | Yes | - |

### Access Rules for notification_logs:
- List rule: `@request.auth.role = "admin"`
- View rule: `@request.auth.role = "admin"`
- Create rule: `@request.auth.id != ""`
- Update rule: (leave empty)
- Delete rule: `@request.auth.role = "admin"`

## Step 3: Create system_metrics Collection

1. Click "New collection" again
2. Set name to: `system_metrics`
3. Set type to: `Base`
4. Add the following fields:

### Fields for system_metrics:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| timestamp | date | Yes | - |
| notification_delivery_rate | number | Yes | Min: 0, Max: 100 |
| fcm_token_success_rate | number | Yes | Min: 0, Max: 100 |
| template_render_success_rate | number | Yes | Min: 0, Max: 100 |
| database_response_time | number | Yes | Min: 0, No decimal: true |
| error_rate | number | Yes | Min: 0, Max: 100 |
| active_campaigns | number | Yes | Min: 0, No decimal: true |
| pending_notifications | number | Yes | Min: 0, No decimal: true |
| failed_notifications | number | Yes | Min: 0, No decimal: true |
| memory_usage | number | Yes | Min: 0, No decimal: true |
| cpu_usage | number | No | Min: 0, Max: 100 |
| network_latency | number | No | Min: 0, No decimal: true |
| service_worker_status | select | Yes | Values: active, inactive, error |
| user_engagement_score | number | Yes | Min: 0, Max: 100 |

### Access Rules for system_metrics:
- List rule: `@request.auth.role = "admin"`
- View rule: `@request.auth.role = "admin"`
- Create rule: `@request.auth.id != ""`
- Update rule: (leave empty)
- Delete rule: `@request.auth.role = "admin"`

## Step 4: Verify Setup

After creating both collections:
1. Refresh your application
2. Go to `/monitoring/overview`
3. The errors should be resolved

## Alternative: Import Schema Files

If you have access to the PocketBase CLI or can import schema files:

1. Use the `notification_logs_collection.json` file in your project root
2. Use the `system_metrics_collection.json` file in your project root
3. Import them using PocketBase admin panel's "Import collections" feature

## Troubleshooting

If you still see errors after creating the collections:
1. Check that the field names match exactly
2. Verify the access rules are set correctly
3. Make sure your user has the "admin" role
4. Clear your browser cache and refresh the page