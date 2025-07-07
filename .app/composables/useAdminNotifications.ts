import type { Ref } from 'vue'

export interface AdminNotificationForm {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'system'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  action_url?: string
  action_text?: string
  user_id?: string
}

export interface BulkSendOptions {
  sendToAll: boolean
  selectedRecipients: string[]
  userRole?: string // Optional: send to specific role
}

export function useAdminNotifications() {
  const { $pb } = useNuxtApp()
  const { createNotification } = useNotifications()

  // State
  const isLoading = ref(false)
  const isSending = ref(false)
  const allNotifications = ref([])
  const users = ref([])
  const userRoles = ref(['user', 'therapist', 'admin'])
  
  // Pagination state
  const currentPage = ref(1)
  const hasMoreUsers = ref(true)
  const isLoadingMore = ref(false)
  const totalUsers = ref(0)
  
  // Search state
  const isSearching = ref(false)
  const searchQuery = ref('')
  const searchResults = ref([])

  // Fetch all users with pagination
  const fetchUsers = async (page = 1, perPage = 20, role?: string, reset = true) => {
    try {
      if (reset) {
        isLoading.value = true
      } else {
        isLoadingMore.value = true
      }
      
      const filter = role ? `role = "${role}"` : ''
      const resultList = await $pb.collection('users').getList(page, perPage, {
        filter,
        sort: '-created',
      })
      
      // Transform data similar to users.vue
      const transformedUsers = resultList.items.map(item => ({
        id: item.id,
        avatarUrl: item.meta?.avatarUrl,
        name: item.meta?.name,
        username: item.username,
        email: item.meta?.email,
        emailVisibility: item.emailVisibility,
        role: item.role,
        hasCharge: item.hasCharge,
        startChargeTime: item.startChargeTime,
        expireChargeTime: item.expireChargeTime,
        created: item.created,
        initials: item.meta?.name?.substring(0, 2) || 'کا',
        isNew: item.meta?.isNew,
        // Add avatar fallback
        avatar: item.meta?.avatarUrl || '/img/logo.png'
      }))
      
      if (reset || page === 1) {
        users.value = transformedUsers
        currentPage.value = 1
      } else {
        users.value.push(...transformedUsers)
      }
      
      currentPage.value = page
      totalUsers.value = resultList.totalItems
      hasMoreUsers.value = users.value.length < resultList.totalItems
      
      return { items: transformedUsers, totalItems: resultList.totalItems }
    } catch (error) {
      console.error('خطا در دریافت کاربران:', error)
      throw error
    } finally {
      isLoading.value = false
      isLoadingMore.value = false
    }
  }

  // Load more users (infinite scroll)
  const loadMoreUsers = async (role?: string) => {
    if (!hasMoreUsers.value || isLoadingMore.value) return
    
    const nextPage = currentPage.value + 1
    await fetchUsers(nextPage, 20, role, false)
  }

  // Fetch all notifications with admin privileges
  const fetchAllNotifications = async (page = 1, perPage = 50) => {
    try {
      isLoading.value = true
      const records = await $pb.collection('notifications').getList(page, perPage, {
        sort: '-created',
        expand: 'user,recipient_user_id',
        // Admin can see all notifications
      })
      
      if (page === 1) {
        allNotifications.value = records.items
      } else {
        allNotifications.value.push(...records.items)
      }
      
      return records
    } catch (error) {
      console.error('خطا در دریافت اعلان‌ها:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Send notification to multiple recipients
  const sendBulkNotification = async (
    formData: AdminNotificationForm,
    options: BulkSendOptions
  ) => {
    try {
      isSending.value = true
      
      let recipients: string[] = []

      if (options.sendToAll) {
        // Get all users or users with specific role
        const allUsers = options.userRole 
          ? users.value.filter(u => u.role === options.userRole)
          : users.value
        recipients = allUsers.map(u => u.id)
      } else {
        recipients = options.selectedRecipients
      }

      if (recipients.length === 0) {
        throw new Error('هیچ گیرنده‌ای انتخاب نشده است')
      }

      // Create notifications for all recipients
      const promises = recipients.map(recipientId =>
        createNotification({
          title: formData.title,
          message: formData.message,
          type: formData.type,
          priority: formData.priority,
          recipient_user_id: recipientId,
          user: formData.user_id,
          action_url: formData.action_url,
          action_text: formData.action_text,
        })
      )

      await Promise.all(promises)
      return recipients.length
    } catch (error) {
      console.error('خطا در ارسال گروهی اعلان:', error)
      throw error
    } finally {
      isSending.value = false
    }
  }

  // Delete notification (admin only)
  const deleteNotificationAdmin = async (notificationId: string) => {
    try {
      await $pb.collection('notifications').delete(notificationId)
      
      // Remove from local state
      allNotifications.value = allNotifications.value.filter(
        n => n.id !== notificationId
      )
    } catch (error) {
      console.error('خطا در حذف اعلان:', error)
      throw error
    }
  }

  // Update notification (admin only)
  const updateNotification = async (
    notificationId: string, 
    data: Partial<AdminNotificationForm>
  ) => {
    try {
      const updated = await $pb.collection('notifications').update(notificationId, {
        ...data,
        // Convert to PocketBase field names
        is_read: data.type ? undefined : undefined, // Don't change read status
      })
      
      // Update local state
      const index = allNotifications.value.findIndex(n => n.id === notificationId)
      if (index > -1) {
        allNotifications.value[index] = { ...allNotifications.value[index], ...updated }
      }
      
      return updated
    } catch (error) {
      console.error('خطا در بروزرسانی اعلان:', error)
      throw error
    }
  }

  // Get notification statistics
  const getNotificationStats = computed(() => {
    const total = allNotifications.value.length
    const unread = allNotifications.value.filter(n => !n.is_read).length
    const read = total - unread
    
    const byType = allNotifications.value.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const byPriority = allNotifications.value.reduce((acc, n) => {
      acc[n.priority] = (acc[n.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      unread,
      read,
      readPercentage: total > 0 ? Math.round((read / total) * 100) : 0,
      byType,
      byPriority
    }
  })

  // Get users by role
  const getUsersByRole = (role: string) => {
    return users.value.filter(u => u.role === role)
  }

  // Search users with debounce
  let searchTimeout: NodeJS.Timeout | null = null
  
  const searchUsers = async (query: string, role?: string, page = 1, perPage = 20) => {
    try {
      isSearching.value = true
      
      if (!query.trim()) {
        searchResults.value = []
        searchQuery.value = ''
        return []
      }
      
      const filter = [
        `meta.name ~ "${query}"`,
        `meta.email ~ "${query}"`,
        `username ~ "${query}"`
      ].join(' || ')
      
      const roleFilter = role ? ` && role = "${role}"` : ''
      const finalFilter = filter + roleFilter

      const resultList = await $pb.collection('users').getList(page, perPage, {
        sort: '-created',
        filter: finalFilter
      })
      
      // Transform search results
      const transformedResults = resultList.items.map(item => ({
        id: item.id,
        avatarUrl: item.meta?.avatarUrl,
        name: item.meta?.name,
        username: item.username,
        email: item.meta?.email,
        emailVisibility: item.emailVisibility,
        role: item.role,
        hasCharge: item.hasCharge,
        startChargeTime: item.startChargeTime,
        expireChargeTime: item.expireChargeTime,
        created: item.created,
        initials: item.meta?.name?.substring(0, 2) || 'کا',
        isNew: item.meta?.isNew,
        avatar: item.meta?.avatarUrl || '/img/logo.png'
      }))
      
      if (page === 1) {
        searchResults.value = transformedResults
      } else {
        searchResults.value.push(...transformedResults)
      }
      
      return transformedResults
    } catch (error) {
      console.error('خطا در جستجوی کاربران:', error)
      return []
    } finally {
      isSearching.value = false
    }
  }
  
  // Debounced search
  const debouncedSearch = (query: string, role?: string, delay = 500) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    searchTimeout = setTimeout(() => {
      searchQuery.value = query
      if (query.trim()) {
        searchUsers(query, role)
      } else {
        searchResults.value = []
        searchQuery.value = ''
      }
    }, delay)
  }
  
  // Clear search
  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
  }

  // Send system notification (predefined templates)
  const sendSystemNotification = async (
    template: 'welcome' | 'reminder' | 'warning' | 'maintenance',
    recipientIds: string[],
    customData?: Record<string, any>
  ) => {
    const templates = {
      welcome: {
        title: 'خوش آمدید!',
        message: 'به پلتفرم ذهنا خوش آمدید. برای شروع، پروفایل خود را تکمیل کنید.',
        type: 'success' as const,
        priority: 'medium' as const,
        action_url: '/profile',
        action_text: 'تکمیل پروفایل'
      },
      reminder: {
        title: 'یادآوری',
        message: 'شما یک جلسه در انتظار دارید.',
        type: 'warning' as const,
        priority: 'high' as const,
        action_url: '/sessions',
        action_text: 'مشاهده جلسات'
      },
      warning: {
        title: 'هشدار سیستم',
        message: 'لطفاً به اطلاعات حساب کاربری خود دقت کنید.',
        type: 'warning' as const,
        priority: 'high' as const,
        action_url: '/settings',
        action_text: 'بررسی حساب'
      },
      maintenance: {
        title: 'تعمیرات سیستم',
        message: 'سیستم به زودی وارد حالت تعمیرات خواهد شد.',
        type: 'info' as const,
        priority: 'urgent' as const,
      }
    }

    const templateData = { ...templates[template], ...customData }
    
    return await sendBulkNotification(templateData, {
      sendToAll: false,
      selectedRecipients: recipientIds
    })
  }

  return {
    // State
    isLoading,
    isSending,
    allNotifications,
    users,
    userRoles,
    
    // Pagination state
    currentPage,
    hasMoreUsers,
    isLoadingMore,
    totalUsers,
    
    // Search state
    isSearching,
    searchQuery,
    searchResults,

    // Computed
    getNotificationStats,

    // Methods
    fetchUsers,
    loadMoreUsers,
    fetchAllNotifications,
    sendBulkNotification,
    deleteNotificationAdmin,
    updateNotification,
    getUsersByRole,
    searchUsers,
    debouncedSearch,
    clearSearch,
    sendSystemNotification,
  }
} 