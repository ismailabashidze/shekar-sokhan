export interface ZoneConfig {
  name: string
  path: string
  icon: string
  label: string
  color?: string
  sidebarItems?: SidebarItem[]
  horizontalNavItems?: HorizontalNavItem[]
}

export interface SidebarItem {
  to: string
  label: string
  icon: string
  badge?: string | number
  children?: SidebarItem[]
}

export interface HorizontalNavItem {
  to: string
  label: string
  icon?: string
  badge?: string | number
}

export const ZONE_CONFIGS: Record<string, ZoneConfig> = {
  'admin': {
    name: 'admin',
    path: '/admin',
    icon: 'ph:shield-check',
    label: 'مدیریت',
    color: 'red',
    sidebarItems: [
      {
        to: '/admin',
        label: 'پیشخوان',
        icon: 'ph:house',
      },
      {
        to: '/admin/users',
        label: 'کاربران',
        icon: 'ph:users',
      },
      {
        to: '/admin/notifications',
        label: 'اعلان‌ها',
        icon: 'ph:bell',
      },
      {
        to: '/admin/campaigns',
        label: 'کمپین‌ها',
        icon: 'ph:megaphone',
      },
      {
        to: '/admin/feedbacks',
        label: 'بازخوردها',
        icon: 'ph:chat-circle',
      },
      {
        to: '/admin/session-dashboard',
        label: 'داشبورد جلسات',
        icon: 'ph:calendar',
      },
      {
        to: '/admin/monitoring',
        label: 'مانیتورینگ',
        icon: 'ph:monitor',
      },
    ],
    horizontalNavItems: [
      {
        to: '/admin',
        label: 'پیشخوان',
        icon: 'ph:house',
      },
      {
        to: '/admin/users',
        label: 'کاربران',
      },
      {
        to: '/admin/notifications',
        label: 'اعلان‌ها',
      },
      {
        to: '/admin/campaigns',
        label: 'کمپین‌ها',
      },
    ],
  },
  'hamdel': {
    name: 'hamdel',
    path: '/hamdel',
    icon: 'ph:heart',
    label: 'هم‌دل',
    color: 'pink',
    sidebarItems: [
      {
        to: '/hamdel',
        label: 'داشبورد',
        icon: 'ph:house',
      },
      {
        to: '/hamdel/patients',
        label: 'بیماران',
        icon: 'ph:users',
      },
      {
        to: '/hamdel/sessions',
        label: 'جلسات',
        icon: 'ph:calendar',
      },
      {
        to: '/hamdel/reports',
        label: 'گزارش‌ها',
        icon: 'ph:file-text',
      },
    ],
    horizontalNavItems: [
      {
        to: '/hamdel',
        label: 'داشبورد',
      },
      {
        to: '/hamdel/patients',
        label: 'بیماران',
      },
      {
        to: '/hamdel/sessions',
        label: 'جلسات',
      },
    ],
  },
  'darmana': {
    name: 'darmana',
    path: '/darmana',
    icon: 'ph:first-aid-kit',
    label: 'دارمانا',
    color: 'green',
    sidebarItems: [
      {
        to: '/darmana',
        label: 'داشبورد',
        icon: 'ph:house',
      },
      {
        to: '/darmana/patients',
        label: 'بیماران',
        icon: 'ph:users',
        children: [
          {
            to: '/darmana/patients',
            label: 'لیست بیماران',
            icon: 'ph:list',
          },
          {
            to: '/darmana/patients/new',
            label: 'بیمار جدید',
            icon: 'ph:plus',
          },
        ],
      },
      {
        to: '/darmana/therapists',
        label: 'درمانگران',
        icon: 'ph:user-gear',
        children: [
          {
            to: '/darmana/therapists',
            label: 'لیست درمانگران',
            icon: 'ph:list',
          },
          {
            to: '/darmana/therapists/new',
            label: 'درمانگر جدید',
            icon: 'ph:plus',
          },
          {
            to: '/darmana/therapists/ai',
            label: 'درمانگر هوشمند',
            icon: 'ph:robot',
          },
        ],
      },
      {
        to: '/darmana/sessions',
        label: 'جلسات درمانی',
        icon: 'ph:calendar',
      },
      {
        to: '/darmana/discount',
        label: 'تخفیف‌ها',
        icon: 'ph:tag',
      },
    ],
    horizontalNavItems: [
      {
        to: '/darmana',
        label: 'داشبورد',
      },
      {
        to: '/darmana/patients',
        label: 'بیماران',
      },
      {
        to: '/darmana/therapists',
        label: 'درمانگران',
      },
      {
        to: '/darmana/sessions',
        label: 'جلسات',
      },
    ],
  },
  'clinic': {
    name: 'clinic',
    path: '/clinic',
    icon: 'ph:hospital',
    label: 'کلینیک',
    color: 'blue',
    sidebarItems: [
      {
        to: '/clinic',
        label: 'داشبورد',
        icon: 'ph:house',
      },
      {
        to: '/clinic/schedule',
        label: 'وقت‌دهی',
        icon: 'ph:calendar',
      },
      {
        to: '/clinic/therapists',
        label: 'درمانگران',
        icon: 'ph:user-gear',
      },
    ],
    horizontalNavItems: [
      {
        to: '/clinic',
        label: 'داشبورد',
      },
      {
        to: '/clinic/schedule',
        label: 'وقت‌دهی',
      },
    ],
  },
  'therapy-journey': {
    name: 'therapy-journey',
    path: '/therapy-journey',
    icon: 'ph:map-trifold',
    label: 'سفر درمانی',
    color: 'purple',
    sidebarItems: [
      {
        to: '/therapy-journey',
        label: 'شروع',
        icon: 'ph:play',
      },
      {
        to: '/therapy-journey/assessment',
        label: 'ارزیابی',
        icon: 'ph:clipboard',
      },
      {
        to: '/therapy-journey/chat',
        label: 'گفتگو',
        icon: 'ph:chat',
      },
      {
        to: '/therapy-journey/result',
        label: 'نتایج',
        icon: 'ph:chart-bar',
      },
    ],
    horizontalNavItems: [
      {
        to: '/therapy-journey',
        label: 'شروع',
      },
      {
        to: '/therapy-journey/assessment',
        label: 'ارزیابی',
      },
      {
        to: '/therapy-journey/chat',
        label: 'گفتگو',
      },
    ],
  },
  'hampazhooh': {
    name: 'hampazhooh',
    path: '/hampazhooh',
    icon: 'ph:buildings',
    label: 'هم‌پژوه',
    color: 'orange',
    sidebarItems: [
      {
        to: 'hampazhooh',
        label: 'داشبورد',
        icon: 'ph:house',
      },
      {
        to: '/hampazhooh/projects',
        label: 'پروژه‌ها',
        icon: 'ph:folder',
      },
    ],
    horizontalNavItems: [
      {
        to: '/hampazhooh',
        label: 'داشبورد',
      },
      {
        to: '/hampazhooh/projects',
        label: 'پروژه‌ها',
      },
    ],
  },
}

export const useZones = () => {
  const { user } = useUser()
  const route = useRoute()

  // Get current zone based on route
  const currentZone = computed(() => {
    const path = route.path
    for (const [zonePath, zoneName] of Object.entries({
      '/admin': 'admin',
      '/hamdel': 'hamdel',
      '/darmana': 'darmana',
      '/clinic': 'clinic',
      '/therapy-journey': 'therapy-journey',
      '/hampazhooh': 'hampazhooh',
    })) {
      if (path.startsWith(zonePath)) {
        return zoneName
      }
    }
    return null
  })

  // Get current zone config
  const currentZoneConfig = computed(() => {
    if (!currentZone.value) return null
    return ZONE_CONFIGS[currentZone.value]
  })

  // Get user zones with their configs
  const userZones = computed(() => {
    if (!user.value?.zones) return []
    return user.value.zones
      .map(zone => ZONE_CONFIGS[zone])
      .filter(Boolean)
  })

  // Check if user has access to a specific zone
  const hasZoneAccess = (zone: string) => {
    if (!user.value?.zones) return false
    if (zone === 'admin') {
      const { role } = useUser()
      return role.value === 'ADMIN'
    }
    return user.value.zones.includes(zone)
  }

  // Get sidebar items for current zone
  const sidebarItems = computed(() => {
    return currentZoneConfig.value?.sidebarItems || []
  })

  // Get horizontal nav items for current zone
  const horizontalNavItems = computed(() => {
    return currentZoneConfig.value?.horizontalNavItems || []
  })

  return {
    currentZone,
    currentZoneConfig,
    userZones,
    hasZoneAccess,
    sidebarItems,
    horizontalNavItems,
    ZONE_CONFIGS,
  }
}
