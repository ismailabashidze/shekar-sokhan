# Admin Analytics Dashboard Design

## Overview

The Admin Analytics Dashboard monitoring system is currently experiencing critical failures that prevent proper operation. Based on the error analysis, the main issues are:

1. **400 HTTP errors** when creating `system_metrics` records
2. **Logger failures** in `NOTIFICATION_DELIVERY` and `CAMPAIGNS` categories
3. **Data validation issues** causing API rejections
4. **Missing error recovery** mechanisms

This design focuses on debugging and fixing these specific issues to restore monitoring functionality.

## Root Cause Analysis

### Issue 1: System Metrics 400 Errors
**Problem**: `pb.collection('system_metrics').create(metrics)` returns 400 status
**Likely Causes**:
- Data types don't match PocketBase schema (e.g., sending string where number expected)
- Required fields missing from the metrics object
- Field names don't match collection schema
- Data validation rules failing (e.g., negative numbers, invalid enums)

### Issue 2: Logger Integration Failures
**Problem**: `logger.error(LogCategory.NOTIFICATION_DELIVERY, ...)` and `logger.error(LogCategory.CAMPAIGNS, ...)` throwing errors
**Likely Causes**:
- Logger trying to write to non-existent `notification_logs` collection
- Logger data format doesn't match collection schema
- Circular dependency or infinite error loops

### Issue 3: Data Collection Failures
**Problem**: Metrics collection functions failing silently or with errors
**Likely Causes**:
- Collection queries using incorrect filter syntax
- Missing or renamed fields in source collections
- Permission issues accessing collections

## Debugging Strategy

### Phase 1: Immediate Fixes
1. **Inspect PocketBase Schema**: Get actual schema for `system_metrics` and `notification_logs` collections
2. **Data Type Validation**: Ensure all metrics data matches expected types
3. **Logger Error Isolation**: Prevent logger errors from cascading to monitoring system
4. **API Error Details**: Capture and log specific 400 error details from PocketBase

### Phase 2: Error Recovery
1. **Fallback Mechanisms**: Store metrics in memory when database fails
2. **Retry Logic**: Implement exponential backoff for failed operations
3. **Circuit Breakers**: Prevent cascading failures
4. **Graceful Degradation**: Continue monitoring with reduced functionality

### Phase 3: Monitoring Improvements
1. **Real-time Error Tracking**: Monitor the monitoring system itself
2. **Health Checks**: Verify collection availability and schema compliance
3. **Performance Optimization**: Reduce API calls and improve efficiency

## Technical Solutions

### 1. Schema Validation Fix

```typescript
// Add data validation before PocketBase operations
const validateAndSanitizeMetrics = (rawMetrics: any): SystemMetrics => {
  return {
    timestamp: new Date().toISOString(),
    notification_delivery_rate: Number(rawMetrics.notification_delivery_rate) || 0,
    fcm_token_success_rate: Number(rawMetrics.fcm_token_success_rate) || 0,
    template_render_success_rate: Number(rawMetrics.template_render_success_rate) || 0,
    database_response_time: Math.round(Number(rawMetrics.database_response_time)) || 0,
    error_rate: Number(rawMetrics.error_rate) || 0,
    active_campaigns: Math.round(Number(rawMetrics.active_campaigns)) || 0,
    pending_notifications: Math.round(Number(rawMetrics.pending_notifications)) || 0,
    failed_notifications: Math.round(Number(rawMetrics.failed_notifications)) || 0,
    memory_usage: Math.round(Number(rawMetrics.memory_usage)) || 0,
    service_worker_status: ['active', 'inactive', 'error'].includes(rawMetrics.service_worker_status) 
      ? rawMetrics.service_worker_status : 'inactive',
    user_engagement_score: Number(rawMetrics.user_engagement_score) || 0
  }
}
```

### 2. Error Isolation for Logger

```typescript
// Prevent logger errors from breaking monitoring
const safeLogger = {
  error: async (category: string, message: string, data?: any) => {
    try {
      await logger.error(category, message, data)
    } catch (logError) {
      // Fallback to console logging
      console.error(`[${category}] ${message}`, data, 'Logger Error:', logError)
    }
  }
}
```

### 3. API Error Handling

```typescript
// Enhanced error handling for PocketBase operations
const safeCreateMetrics = async (metrics: SystemMetrics) => {
  try {
    const validatedMetrics = validateAndSanitizeMetrics(metrics)
    const result = await pb.collection('system_metrics').create(validatedMetrics)
    return { success: true, data: result }
  } catch (error) {
    // Log detailed error information
    console.error('System metrics creation failed:', {
      error: error.message,
      data: metrics,
      timestamp: new Date().toISOString()
    })
    
    // Store in memory as fallback
    return { success: false, error, fallbackData: metrics }
  }
}
```

## Implementation Plan

### Step 1: Debug Data Issues
1. **Inspect Collection Schemas**: Use PocketBase admin to examine actual field types and requirements
2. **Log Raw Data**: Add detailed logging to see exactly what data is being sent
3. **Validate Data Types**: Ensure all numeric fields are numbers, strings are strings, etc.
4. **Fix Field Mapping**: Correct any field name mismatches

### Step 2: Fix Logger Integration
1. **Isolate Logger Errors**: Wrap all logger calls in try-catch blocks
2. **Implement Fallback Logging**: Use console.log when logger fails
3. **Check Logger Dependencies**: Ensure notification_logs collection exists and is accessible
4. **Fix Circular Dependencies**: Prevent logger from calling monitoring functions

### Step 3: Enhance Error Handling
1. **Detailed Error Logging**: Capture full error details including HTTP status and response body
2. **Implement Retry Logic**: Add exponential backoff for transient failures
3. **Memory Fallback**: Store metrics in memory when database operations fail
4. **Circuit Breaker**: Temporarily disable failing operations to prevent cascading errors

### Step 4: Dashboard Improvements
1. **Error State Display**: Show specific error messages in the UI
2. **Manual Recovery**: Add buttons to retry failed operations
3. **Diagnostic Information**: Display system health and error details
4. **Graceful Degradation**: Show partial data when some operations fail

## Debugging Checklist

### Immediate Actions Needed

1. **Check PocketBase Collections**:
   - Verify `system_metrics` collection exists and is accessible
   - Examine field types and validation rules
   - Check `notification_logs` collection schema

2. **Inspect Error Details**:
   - Capture full 400 error response from PocketBase
   - Log the exact data being sent that causes failures
   - Identify which specific fields are causing validation errors

3. **Fix Data Type Issues**:
   - Ensure all numbers are actually numeric types, not strings
   - Validate enum values (like `service_worker_status`)
   - Check for null/undefined values in required fields

4. **Logger Error Resolution**:
   - Wrap all logger calls in try-catch blocks
   - Implement console fallback when logger fails
   - Check if logger is trying to create circular dependencies

### Success Criteria

- ✅ No more 400 errors when creating system metrics
- ✅ No more logger errors in NOTIFICATION_DELIVERY and CAMPAIGNS
- ✅ Dashboard loads and displays data without errors
- ✅ Monitoring system continues to function even when some operations fail
- ✅ Clear error messages displayed to administrators when issues occur

### Monitoring the Fix

After implementation, verify:
1. Browser console shows no errors during monitoring operations
2. PocketBase admin shows successful record creation in `system_metrics`
3. Dashboard displays real-time data updates
4. Error states are handled gracefully with user-friendly messages
5. System can recover automatically from transient failures