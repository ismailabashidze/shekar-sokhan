/**
 * Plugin to dynamically update sidebar navigation based on current zone
 * This makes the sidebar zone-aware by reading from useZones composable
 */
export default defineNuxtPlugin((nuxtApp) => {
  const appConfig = useAppConfig();
  const route = useRoute();
  
  // Function to check if we should skip sidebar updates (e.g., on auth pages)
  const shouldSkipSidebarUpdate = () => {
    const publicPaths = ['/auth', '/publicDomain', '/lock'];
    return publicPaths.some(path => route.path.startsWith(path));
  };
  
  // Function to generate sidebar items based on current zone
  const generateSidebarItems = () => {
    // Don't generate items if on public/auth pages
    if (shouldSkipSidebarUpdate()) {
      return null;
    }
    
    const { user } = useUser();
    
    // Check if user is properly loaded - if not, return null to prevent clearing sidebar
    if (!user.value || !user.value.id) {
      console.log('⚠️ ZONE SIDEBAR - User not loaded yet, skipping sidebar update');
      return null;
    }
    
    const { currentZone, currentZoneConfig } = useZones();
    
    // Common items that appear in all sidebars
    const commonStartItems = [
      {
        title: 'تغییر تم',
        component: 'DemoThemeToggle',
        position: 'start',
      },
    ];
    
    const commonEndItems = [
      {
        title: 'خانه',
        icon: { name: 'ph:house-duotone', class: 'w-5 h-5' },
        to: '/dashboard',
        position: 'end',
      },
      {
        title: 'گزارش باگ',
        component: 'BugReportIcon',
        position: 'end',
      },
      {
        title: 'My Account',
        component: 'DemoAccountMenu',
        position: 'end',
      },
    ];
    
    // If no specific zone detected, return default sidebar (no zone-specific items)
    if (!currentZone.value || !currentZoneConfig.value) {
      console.log('✅ ZONE SIDEBAR - No zone detected, using default sidebar');
      return [...commonStartItems, ...commonEndItems];
    }
    
    // Map zone sidebar items to Tairo sidebar format
    const zoneSidebarItems = currentZoneConfig.value.sidebarItems?.map((item) => {
      const sidebarItem: any = {
        title: item.label,
        icon: { name: item.icon, class: 'w-5 h-5' },
        to: item.to,
        activePath: item.to,
        position: 'start',
      };
      
      if (item.badge) {
        sidebarItem.badge = item.badge;
      }
      
      // Handle nested children if present
      if (item.children && item.children.length > 0) {
        sidebarItem.subsidebar = {
          component: 'ZoneSubsidebar',
          props: { items: item.children },
        };
      }
      
      return sidebarItem;
    }) || [];
    
    console.log(`✅ ZONE SIDEBAR - Generated ${zoneSidebarItems.length} zone items for ${currentZone.value}`);
    return [...commonStartItems, ...zoneSidebarItems, ...commonEndItems];
  };
  
  // Override the sidebar items getter
  const updateSidebarForZone = () => {
    if (!appConfig.tairo?.sidebar?.navigation) return;
    
    const newItems = generateSidebarItems();
    
    // Only update if we got valid items back
    // If newItems is null, it means we should skip the update
    if (newItems !== null) {
      appConfig.tairo.sidebar.navigation.items = newItems;
    }
  };
  
  // Update sidebar on route change
  nuxtApp.hook('page:finish', () => {
    // Small delay to ensure useZones has detected the new zone
    nextTick(() => {
      updateSidebarForZone();
    });
  });
  
  // Initial update on client
  if (process.client) {
    // Wait for initial render before updating
    setTimeout(() => {
      updateSidebarForZone();
    }, 100);
  }
});
