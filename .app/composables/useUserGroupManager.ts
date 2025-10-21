import type PocketBase from 'pocketbase'

// Types for user group management
export interface GroupRule {
  field: string // 'role', 'last_active_at', 'hasCharge', 'created', etc.
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' | 'not_in' | 'exists' | 'not_exists'
  value: any
}

export interface GroupCriteria {
  rules: GroupRule[]
  operator: 'AND' | 'OR'
}

export interface UserGroup {
  id?: string
  name: string
  description?: string
  criteria: GroupCriteria
  user_count?: number
  is_dynamic: boolean
  created_by: string
  created?: string
  updated?: string
}

export interface UserGroupMember {
  id: string
  email: string
  role?: string
  last_active_at?: string
  created?: string
  hasCharge?: boolean
  meta?: Record<string, any>
}

export const useUserGroupManager = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase

  // Cache for group memberships to improve performance
  const groupMembershipCache = new Map<string, {
    members: UserGroupMember[]
    count: number
    lastUpdated: number
    ttl: number
  }>()

  // Cache TTL in milliseconds (5 minutes)
  const CACHE_TTL = 5 * 60 * 1000

  // Real-time subscription tracking
  const activeSubscriptions = new Map<string, () => void>()
  
  // Event emitter for group membership changes
  const groupChangeCallbacks = new Map<string, Array<(groupId: string, newCount: number, oldCount: number) => void>>()

  /**
   * Build PocketBase filter string from group criteria
   */
  const buildFilterFromCriteria = (criteria: GroupCriteria): string => {
    if (!criteria.rules || criteria.rules.length === 0) {
      return ''
    }

    const filterParts = criteria.rules.map(rule => {
      const { field, operator, value } = rule

      switch (operator) {
        case 'eq':
          return typeof value === 'string' ? `${field} = "${value}"` : `${field} = ${value}`
        case 'neq':
          return typeof value === 'string' ? `${field} != "${value}"` : `${field} != ${value}`
        case 'gt':
          return typeof value === 'string' ? `${field} > "${value}"` : `${field} > ${value}`
        case 'gte':
          return typeof value === 'string' ? `${field} >= "${value}"` : `${field} >= ${value}`
        case 'lt':
          return typeof value === 'string' ? `${field} < "${value}"` : `${field} < ${value}`
        case 'lte':
          return typeof value === 'string' ? `${field} <= "${value}"` : `${field} <= ${value}`
        case 'contains':
          return `${field} ~ "${value}"`
        case 'in':
          if (Array.isArray(value)) {
            const valueList = value.map(v => typeof v === 'string' ? `"${v}"` : v).join(', ')
            return `${field} ?= [${valueList}]`
          }
          return typeof value === 'string' ? `${field} = "${value}"` : `${field} = ${value}`
        case 'not_in':
          if (Array.isArray(value)) {
            const valueList = value.map(v => typeof v === 'string' ? `"${v}"` : v).join(', ')
            return `${field} ?!= [${valueList}]`
          }
          return typeof value === 'string' ? `${field} != "${value}"` : `${field} != ${value}`
        case 'exists':
          return `${field} != ""`
        case 'not_exists':
          return `${field} = ""`
        default:
          console.warn(`Unknown operator: ${operator}`)
          return ''
      }
    }).filter(part => part !== '')

    if (filterParts.length === 0) {
      return ''
    }

    if (filterParts.length === 1) {
      return filterParts[0]
    }

    const joinOperator = criteria.operator === 'OR' ? ' || ' : ' && '
    return `(${filterParts.join(joinOperator)})`
  }

  /**
   * Query users based on group criteria
   */
  const queryUsersByCriteria = async (criteria: GroupCriteria, page = 1, perPage = 500): Promise<{
    items: UserGroupMember[]
    totalItems: number
    totalPages: number
  }> => {
    try {
      const filter = buildFilterFromCriteria(criteria)
      
      if (!filter) {
        console.warn('Empty filter criteria, returning empty result')
        return { items: [], totalItems: 0, totalPages: 0 }
      }

      console.log('🔍 Querying users with filter:', filter)

      const result = await pb.collection('users').getList(page, perPage, {
        filter,
        sort: '-created',
        fields: 'id,email,role,last_active_at,created,hasCharge,meta'
      })

      const members: UserGroupMember[] = result.items.map((user: any) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        last_active_at: user.last_active_at,
        created: user.created,
        hasCharge: user.hasCharge,
        meta: user.meta
      }))

      return {
        items: members,
        totalItems: result.totalItems,
        totalPages: result.totalPages
      }
    } catch (error) {
      console.error('❌ Error querying users by criteria:', error)
      throw error
    }
  }

  /**
   * Get all users matching criteria (handles pagination automatically)
   */
  const getAllUsersByCriteria = async (criteria: GroupCriteria): Promise<UserGroupMember[]> => {
    try {
      const allMembers: UserGroupMember[] = []
      let page = 1
      let hasMore = true

      while (hasMore) {
        const result = await queryUsersByCriteria(criteria, page, 500)
        allMembers.push(...result.items)
        
        hasMore = page < result.totalPages
        page++
      }

      return allMembers
    } catch (error) {
      console.error('❌ Error getting all users by criteria:', error)
      return []
    }
  }

  /**
   * Calculate group membership and count
   */
  const calculateGroupMembership = async (groupId: string, criteria: GroupCriteria, useCache = true): Promise<{
    members: UserGroupMember[]
    count: number
  }> => {
    try {
      // Check cache first
      if (useCache && groupMembershipCache.has(groupId)) {
        const cached = groupMembershipCache.get(groupId)!
        const now = Date.now()
        
        if (now - cached.lastUpdated < cached.ttl) {
          console.log('📋 Using cached group membership for:', groupId)
          return {
            members: cached.members,
            count: cached.count
          }
        } else {
          // Cache expired, remove it
          groupMembershipCache.delete(groupId)
        }
      }

      console.log('🔄 Calculating group membership for:', groupId)
      const members = await getAllUsersByCriteria(criteria)
      const count = members.length

      // Cache the result
      if (useCache) {
        groupMembershipCache.set(groupId, {
          members,
          count,
          lastUpdated: Date.now(),
          ttl: CACHE_TTL
        })
      }

      return { members, count }
    } catch (error) {
      console.error('❌ Error calculating group membership:', error)
      return { members: [], count: 0 }
    }
  }

  /**
   * Update group user count in database
   */
  const updateGroupUserCount = async (groupId: string, count: number): Promise<boolean> => {
    try {
      await pb.collection('user_groups').update(groupId, {
        user_count: count,
        updated: new Date().toISOString()
      })

      console.log('✅ Updated group user count:', groupId, 'count:', count)
      return true
    } catch (error) {
      console.error('❌ Error updating group user count:', error)
      return false
    }
  }

  /**
   * Validate group criteria
   */
  const validateGroupCriteria = (criteria: GroupCriteria): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!criteria) {
      errors.push('Criteria is required')
      return { isValid: false, errors }
    }

    if (!criteria.rules || !Array.isArray(criteria.rules)) {
      errors.push('Rules array is required')
      return { isValid: false, errors }
    }

    if (criteria.rules.length === 0) {
      errors.push('At least one rule is required')
      return { isValid: false, errors }
    }

    if (!['AND', 'OR'].includes(criteria.operator)) {
      errors.push('Operator must be AND or OR')
    }

    // Validate each rule
    criteria.rules.forEach((rule, index) => {
      if (!rule.field) {
        errors.push(`Rule ${index + 1}: Field is required`)
      }

      if (!rule.operator) {
        errors.push(`Rule ${index + 1}: Operator is required`)
      }

      const validOperators = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'in', 'not_in', 'exists', 'not_exists']
      if (rule.operator && !validOperators.includes(rule.operator)) {
        errors.push(`Rule ${index + 1}: Invalid operator ${rule.operator}`)
      }

      // Check if value is required for the operator
      const operatorsRequiringValue = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'in', 'not_in']
      if (operatorsRequiringValue.includes(rule.operator) && (rule.value === undefined || rule.value === null)) {
        errors.push(`Rule ${index + 1}: Value is required for operator ${rule.operator}`)
      }

      // Validate array values for in/not_in operators
      if (['in', 'not_in'].includes(rule.operator) && !Array.isArray(rule.value)) {
        errors.push(`Rule ${index + 1}: Value must be an array for operator ${rule.operator}`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Test group criteria against sample data
   */
  const testGroupCriteria = async (criteria: GroupCriteria, limit = 10): Promise<{
    isValid: boolean
    errors: string[]
    sampleMembers: UserGroupMember[]
    estimatedCount: number
  }> => {
    try {
      // First validate the criteria structure
      const validation = validateGroupCriteria(criteria)
      if (!validation.isValid) {
        return {
          isValid: false,
          errors: validation.errors,
          sampleMembers: [],
          estimatedCount: 0
        }
      }

      // Try to query a small sample
      const result = await queryUsersByCriteria(criteria, 1, limit)
      
      return {
        isValid: true,
        errors: [],
        sampleMembers: result.items,
        estimatedCount: result.totalItems
      }
    } catch (error) {
      console.error('❌ Error testing group criteria:', error)
      return {
        isValid: false,
        errors: [`Query error: ${(error as Error).message}`],
        sampleMembers: [],
        estimatedCount: 0
      }
    }
  }

  /**
   * Create a new user group
   */
  const createUserGroup = async (groupData: Omit<UserGroup, 'id' | 'created' | 'updated'>): Promise<UserGroup | null> => {
    try {
      // Validate criteria first
      const validation = validateGroupCriteria(groupData.criteria)
      if (!validation.isValid) {
        console.error('❌ Invalid group criteria:', validation.errors)
        throw new Error(`Invalid criteria: ${validation.errors.join(', ')}`)
      }

      // Calculate initial user count if dynamic
      let initialCount = 0
      if (groupData.is_dynamic) {
        const membership = await calculateGroupMembership('temp', groupData.criteria, false)
        initialCount = membership.count
      }

      const createdGroup = await pb.collection('user_groups').create({
        ...groupData,
        user_count: initialCount
      })

      console.log('✅ User group created:', createdGroup.id)
      return createdGroup as unknown as UserGroup
    } catch (error) {
      console.error('❌ Error creating user group:', error)
      return null
    }
  }

  /**
   * Update an existing user group
   */
  const updateUserGroup = async (groupId: string, updates: Partial<UserGroup>): Promise<UserGroup | null> => {
    try {
      // If criteria is being updated, validate it
      if (updates.criteria) {
        const validation = validateGroupCriteria(updates.criteria)
        if (!validation.isValid) {
          console.error('❌ Invalid group criteria:', validation.errors)
          throw new Error(`Invalid criteria: ${validation.errors.join(', ')}`)
        }
      }

      // If this is a dynamic group and criteria changed, recalculate count
      if (updates.criteria && updates.is_dynamic !== false) {
        const membership = await calculateGroupMembership(groupId, updates.criteria, false)
        updates.user_count = membership.count
        
        // Clear cache for this group
        groupMembershipCache.delete(groupId)
      }

      const updatedGroup = await pb.collection('user_groups').update(groupId, updates)
      
      console.log('✅ User group updated:', groupId)
      return updatedGroup as unknown as UserGroup
    } catch (error) {
      console.error('❌ Error updating user group:', error)
      return null
    }
  }

  /**
   * Delete a user group
   */
  const deleteUserGroup = async (groupId: string): Promise<boolean> => {
    try {
      await pb.collection('user_groups').delete(groupId)
      
      // Clear cache
      groupMembershipCache.delete(groupId)
      
      console.log('✅ User group deleted:', groupId)
      return true
    } catch (error) {
      console.error('❌ Error deleting user group:', error)
      return false
    }
  }

  /**
   * Get all user groups
   */
  const getUserGroups = async (page = 1, perPage = 50): Promise<{
    items: UserGroup[]
    totalItems: number
    totalPages: number
  }> => {
    try {
      const result = await pb.collection('user_groups').getList(page, perPage, {
        sort: '-created',
        expand: 'created_by'
      })

      return {
        items: result.items as unknown as UserGroup[],
        totalItems: result.totalItems,
        totalPages: result.totalPages
      }
    } catch (error) {
      console.error('❌ Error fetching user groups:', error)
      return { items: [], totalItems: 0, totalPages: 0 }
    }
  }

  /**
   * Get a specific user group by ID
   */
  const getUserGroup = async (groupId: string): Promise<UserGroup | null> => {
    try {
      const group = await pb.collection('user_groups').getOne(groupId, {
        expand: 'created_by'
      })

      return group as unknown as UserGroup
    } catch (error) {
      console.error('❌ Error fetching user group:', error)
      return null
    }
  }

  /**
   * Get group members with pagination
   */
  const getGroupMembers = async (groupId: string, page = 1, perPage = 50): Promise<{
    items: UserGroupMember[]
    totalItems: number
    totalPages: number
  }> => {
    try {
      const group = await getUserGroup(groupId)
      if (!group) {
        throw new Error('Group not found')
      }

      const result = await queryUsersByCriteria(group.criteria, page, perPage)
      return result
    } catch (error) {
      console.error('❌ Error fetching group members:', error)
      return { items: [], totalItems: 0, totalPages: 0 }
    }
  }

  /**
   * Clear group membership cache
   */
  const clearGroupCache = (groupId?: string) => {
    if (groupId) {
      groupMembershipCache.delete(groupId)
      console.log('🗑️ Cleared cache for group:', groupId)
    } else {
      groupMembershipCache.clear()
      console.log('🗑️ Cleared all group membership cache')
    }
  }

  /**
   * Get cache statistics
   */
  const getCacheStats = () => {
    const stats = {
      totalCachedGroups: groupMembershipCache.size,
      cacheEntries: Array.from(groupMembershipCache.entries()).map(([groupId, data]) => ({
        groupId,
        memberCount: data.count,
        lastUpdated: new Date(data.lastUpdated).toISOString(),
        isExpired: Date.now() - data.lastUpdated > data.ttl
      }))
    }

    return stats
  }

  /**
   * Recalculate user count for dynamic groups
   */
  const recalculateDynamicGroupCounts = async (groupIds?: string[]): Promise<void> => {
    try {
      let groupsToUpdate: UserGroup[] = []

      if (groupIds && groupIds.length > 0) {
        // Update specific groups
        for (const groupId of groupIds) {
          const group = await getUserGroup(groupId)
          if (group && group.is_dynamic) {
            groupsToUpdate.push(group)
          }
        }
      } else {
        // Update all dynamic groups
        const allGroups = await pb.collection('user_groups').getFullList({
          filter: 'is_dynamic = true'
        })
        groupsToUpdate = allGroups as unknown as UserGroup[]
      }

      console.log(`🔄 Recalculating counts for ${groupsToUpdate.length} dynamic groups`)

      for (const group of groupsToUpdate) {
        const oldCount = group.user_count || 0
        const membership = await calculateGroupMembership(group.id!, group.criteria, false)
        const newCount = membership.count

        if (oldCount !== newCount) {
          await updateGroupUserCount(group.id!, newCount)
          
          // Trigger change callbacks
          const callbacks = groupChangeCallbacks.get(group.id!) || []
          callbacks.forEach(callback => {
            try {
              callback(group.id!, newCount, oldCount)
            } catch (error) {
              console.error('❌ Error in group change callback:', error)
            }
          })

          console.log(`📊 Group ${group.name} count updated: ${oldCount} → ${newCount}`)
        }
      }
    } catch (error) {
      console.error('❌ Error recalculating dynamic group counts:', error)
    }
  }

  /**
   * Subscribe to user collection changes for real-time group updates
   */
  const subscribeToUserChanges = async (): Promise<void> => {
    try {
      // Unsubscribe from existing subscription if any
      if (activeSubscriptions.has('users')) {
        activeSubscriptions.get('users')!()
        activeSubscriptions.delete('users')
      }

      console.log('🔔 Subscribing to user collection changes for real-time group updates')

      const unsubscribe = await pb.collection('users').subscribe('*', async (e) => {
        console.log('👤 User collection change detected:', e.action, e.record?.id)

        // Debounce the recalculation to avoid too frequent updates
        setTimeout(async () => {
          await recalculateDynamicGroupCounts()
        }, 2000) // 2 second delay
      })

      activeSubscriptions.set('users', unsubscribe)
    } catch (error) {
      console.error('❌ Error subscribing to user changes:', error)
    }
  }

  /**
   * Subscribe to specific group changes
   */
  const subscribeToGroupChanges = async (groupId: string): Promise<void> => {
    try {
      const subscriptionKey = `group_${groupId}`
      
      // Unsubscribe from existing subscription if any
      if (activeSubscriptions.has(subscriptionKey)) {
        activeSubscriptions.get(subscriptionKey)!()
        activeSubscriptions.delete(subscriptionKey)
      }

      console.log('🔔 Subscribing to group changes:', groupId)

      const unsubscribe = await pb.collection('user_groups').subscribe(groupId, async (e) => {
        console.log('📋 Group change detected:', e.action, groupId)

        // Clear cache for this group
        clearGroupCache(groupId)

        // If it's a dynamic group and criteria changed, recalculate
        if (e.action === 'update' && e.record?.is_dynamic) {
          await recalculateDynamicGroupCounts([groupId])
        }
      })

      activeSubscriptions.set(subscriptionKey, unsubscribe)
    } catch (error) {
      console.error('❌ Error subscribing to group changes:', error)
    }
  }

  /**
   * Unsubscribe from real-time updates
   */
  const unsubscribeFromUpdates = (type?: 'users' | 'groups' | string): void => {
    if (type) {
      if (type === 'users' && activeSubscriptions.has('users')) {
        activeSubscriptions.get('users')!()
        activeSubscriptions.delete('users')
        console.log('🔕 Unsubscribed from user changes')
      } else if (type === 'groups') {
        // Unsubscribe from all group subscriptions
        for (const [key, unsubscribe] of activeSubscriptions.entries()) {
          if (key.startsWith('group_')) {
            unsubscribe()
            activeSubscriptions.delete(key)
          }
        }
        console.log('🔕 Unsubscribed from all group changes')
      } else if (activeSubscriptions.has(type)) {
        activeSubscriptions.get(type)!()
        activeSubscriptions.delete(type)
        console.log('🔕 Unsubscribed from:', type)
      }
    } else {
      // Unsubscribe from all
      for (const [key, unsubscribe] of activeSubscriptions.entries()) {
        unsubscribe()
      }
      activeSubscriptions.clear()
      console.log('🔕 Unsubscribed from all real-time updates')
    }
  }

  /**
   * Add callback for group membership changes
   */
  const onGroupMembershipChange = (groupId: string, callback: (groupId: string, newCount: number, oldCount: number) => void): () => void => {
    if (!groupChangeCallbacks.has(groupId)) {
      groupChangeCallbacks.set(groupId, [])
    }
    
    groupChangeCallbacks.get(groupId)!.push(callback)
    
    // Return unsubscribe function
    return () => {
      const callbacks = groupChangeCallbacks.get(groupId)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
        
        // Clean up empty callback arrays
        if (callbacks.length === 0) {
          groupChangeCallbacks.delete(groupId)
        }
      }
    }
  }

  /**
   * Initialize real-time group management
   */
  const initializeRealTimeUpdates = async (): Promise<void> => {
    try {
      console.log('🚀 Initializing real-time group management')
      
      // Subscribe to user changes for dynamic group updates
      await subscribeToUserChanges()
      
      // Initial recalculation of all dynamic groups
      await recalculateDynamicGroupCounts()
      
      console.log('✅ Real-time group management initialized')
    } catch (error) {
      console.error('❌ Error initializing real-time updates:', error)
    }
  }

  /**
   * Schedule periodic group count updates (fallback for missed real-time events)
   */
  const schedulePeriodicUpdates = (intervalMinutes = 15): () => void => {
    console.log(`⏰ Scheduling periodic group updates every ${intervalMinutes} minutes`)
    
    const intervalId = setInterval(async () => {
      console.log('⏰ Running periodic group count update')
      await recalculateDynamicGroupCounts()
    }, intervalMinutes * 60 * 1000)

    // Return cleanup function
    return () => {
      clearInterval(intervalId)
      console.log('⏰ Stopped periodic group updates')
    }
  }

  /**
   * Get real-time subscription status
   */
  const getSubscriptionStatus = () => {
    return {
      activeSubscriptions: Array.from(activeSubscriptions.keys()),
      subscribedGroups: Array.from(activeSubscriptions.keys())
        .filter(key => key.startsWith('group_'))
        .map(key => key.replace('group_', '')),
      hasUserSubscription: activeSubscriptions.has('users'),
      totalSubscriptions: activeSubscriptions.size,
      groupCallbacks: Array.from(groupChangeCallbacks.entries()).map(([groupId, callbacks]) => ({
        groupId,
        callbackCount: callbacks.length
      }))
    }
  }

  /**
   * Force refresh all dynamic groups (manual trigger)
   */
  const forceRefreshAllGroups = async (): Promise<void> => {
    console.log('🔄 Force refreshing all dynamic groups')
    clearGroupCache() // Clear all cache
    await recalculateDynamicGroupCounts()
  }

  return {
    // Core functionality
    buildFilterFromCriteria,
    queryUsersByCriteria,
    getAllUsersByCriteria,
    calculateGroupMembership,
    updateGroupUserCount,
    
    // Validation and testing
    validateGroupCriteria,
    testGroupCriteria,
    
    // CRUD operations
    createUserGroup,
    updateUserGroup,
    deleteUserGroup,
    getUserGroups,
    getUserGroup,
    getGroupMembers,
    
    // Cache management
    clearGroupCache,
    getCacheStats,
    
    // Real-time updates
    recalculateDynamicGroupCounts,
    subscribeToUserChanges,
    subscribeToGroupChanges,
    unsubscribeFromUpdates,
    onGroupMembershipChange,
    initializeRealTimeUpdates,
    schedulePeriodicUpdates,
    getSubscriptionStatus,
    forceRefreshAllGroups
  }
}