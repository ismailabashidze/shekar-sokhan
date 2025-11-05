# Zone-Specific Sidebar Implementation

## Overview
This document describes the implementation of zone-specific sidebars in the Zehna platform. Each zone now has its own dedicated sidebar with zone-specific navigation items.

## Architecture

### 1. Zones Configuration
All zones are configured in `composables/useZones.ts` with the following structure:
- **12 zones total**: admin, hamdel, darmana, clinic, therapy-journey, hammasir, baham, khebre, togetherMama, kanape, synapse, hampazhooh
- Each zone has:
  - `sidebarItems`: Navigation items specific to that zone
  - `horizontalNavItems`: Horizontal navigation items for mobile/alternative layouts
  - `icon`, `label`, `color`: Visual identification

### 2. Zone Sidebar Plugin
Location: `.app/plugins/zone-sidebar.client.ts`

The plugin dynamically updates the sidebar navigation based on the current zone:
- Runs on client-side only (`.client.ts` suffix)
- Listens to route changes via `page:finish` hook
- Transforms zone sidebar items to Tairo sidebar format
- Maintains common items (theme toggle, home, bug report, account menu)
- Handles nested sidebar items (children) if present

### 3. Default Sidebar (Hamdel Zone)
Location: `.app/app.config.ts`

The default sidebar configuration now belongs to the **hamdel** zone with items:
- داشبورد (Dashboard)
- بیماران (Patients)
- جلسات (Sessions)
- گزارش‌ها (Reports)

### 4. Existing Components
Two pre-built components exist but are not yet integrated:
- `components/ZoneSidebar.vue`: Full sidebar component with zone switcher
- `components/ZoneHeader.vue`: Horizontal header with zone navigation

These can be used as alternatives to the Tairo sidebar layout if needed.

## How It Works

### Flow
1. User navigates to a page
2. If within a zone (e.g., `/hampazhooh/projects`):
   - Zone middleware (`middleware/zone.global.ts`) validates access
   - Page loads with `layout: 'sidebar'` (from `definePageMeta`)
   - Zone sidebar plugin detects current zone via `useZones` composable
   - Plugin generates appropriate sidebar items for that zone
   - Sidebar items replace `appConfig.tairo.sidebar.navigation.items`
   - Tairo sidebar layout renders the zone-specific items
3. If NOT in a zone (e.g., `/dashboard`):
   - Plugin generates minimal sidebar (only theme toggle and account menu)
   - No zone-specific navigation items are shown
   - User can navigate to zones from dashboard cards

### Zone Detection
The `useZones` composable detects zones by matching route paths:
```typescript
if (path.startsWith('/hamdel')) return 'hamdel'
if (path.startsWith('/hampazhooh')) return 'hampazhooh'
// etc...
```

### Sidebar Item Mapping
Zone sidebar items are transformed to Tairo format:
```typescript
{
  label: 'پروژه‌ها',      // Zone format
  icon: 'ph:folder',
  to: '/hampazhooh/projects'
}
```
becomes:
```typescript
{
  title: 'پروژه‌ها',      // Tairo format
  icon: { name: 'ph:folder', class: 'w-5 h-5' },
  to: '/hampazhooh/projects',
  activePath: '/hampazhooh/projects',
  position: 'start'
}
```

## Zone Sidebar Items

### Admin Zone
- پیشخوان (Dashboard)
- کاربران (Users)
- اعلان‌ها (Notifications)
- کمپین‌ها (Campaigns)
- بازخوردها (Feedbacks)
- داشبورد جلسات (Session Dashboard)
- مانیتورینگ (Monitoring)

### Hamdel Zone (Default)
- داشبورد (Dashboard)
- بیماران (Patients)
- جلسات (Sessions)
- گزارش‌ها (Reports)

### Hampazhooh Zone
- داشبورد (Dashboard)
- پروژه‌ها (Projects)

### Darmana Zone
- داشبورد (Dashboard)
- بیماران (Patients) - with nested children
- درمانگران (Therapists) - with nested children
- جلسات درمانی (Therapy Sessions)
- تخفیف‌ها (Discounts)

### Other Zones
Each zone has its specific sidebar items defined in `useZones.ts`

## Adding a New Zone

To add a new zone with a custom sidebar:

1. **Define zone in `useZones.ts`:**
```typescript
'myzone': {
  name: 'myzone',
  path: '/myzone',
  icon: 'ph:icon-name',
  label: 'My Zone Label',
  color: 'blue',
  sidebarItems: [
    {
      to: '/myzone',
      label: 'Dashboard',
      icon: 'ph:house',
    },
    {
      to: '/myzone/feature',
      label: 'Feature',
      icon: 'ph:star',
    },
  ],
  horizontalNavItems: [
    // Similar structure
  ],
}
```

2. **Add zone path mapping:**
```typescript
const zonePaths: Record<string, string> = {
  '/myzone': 'myzone',
  // ... other zones
}
```

3. **Create zone pages:**
Create pages in `.app/pages/myzone/` with `layout: 'sidebar'`

4. **The plugin will automatically:**
   - Detect the zone from the route
   - Load the appropriate sidebar items
   - Render zone-specific navigation

## Future Enhancements

### Potential Improvements:
1. **Zone-specific toolbar items**: Extend to support per-zone toolbar customization
2. **Zone-specific themes**: Different color schemes per zone
3. **Zone-specific subsidebars**: Enhanced nested navigation
4. **Zone switching widget**: Quick zone switcher in sidebar/header
5. **Zone permissions**: More granular permission control per zone
6. **Zone analytics**: Track zone usage and navigation patterns

### Alternative Implementations:
- Replace Tairo sidebar with custom `ZoneSidebar.vue` component
- Use `ZoneHeader.vue` for a horizontal navigation approach
- Create zone-specific layouts (e.g., `layouts/hamdel.vue`)

## Testing

To test zone-specific sidebars:
1. Navigate to different zones (e.g., `/hamdel/sessions`, `/hampazhooh/projects`)
2. Verify sidebar items update correctly
3. Check that common items (home, theme, account) persist
4. Test zone switching and access control

## Notes

- The plugin only runs on client-side to avoid SSR issues
- Sidebar items are completely replaced on zone change to avoid duplicates
- Minimal sidebar (theme toggle + account menu) is shown when no zone is detected
- Zone access is controlled by `middleware/zone.global.ts`
- Dashboard page shows no zone-specific sidebar items
- Plugin uses a small delay (100ms) on initial load to ensure proper zone detection
