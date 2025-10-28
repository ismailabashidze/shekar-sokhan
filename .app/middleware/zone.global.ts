export default defineNuxtRouteMiddleware((to, from) => {
  console.log('🔍 ZONE MIDDLEWARE - Navigating FROM:', from?.path, 'TO:', to.path);

  const nuxtApp = useNuxtApp();
  const { user } = useUser();

  // Skip zone middleware entirely if user is not authenticated
  // Let the global middleware handle auth redirects
  if (!nuxtApp.$pb.authStore.isValid || !user.value?.id) {
    return true;
  }

  // Skip zone middleware for public paths - these are handled by global middleware
  const publicPaths = [
    '/auth',
    '/publicDomain',
    '/lock',
    '/settings',
    '/bug-reports',
    '/notifications',
    '/posts',
    '/diagnosis',
    '/onboarding',
    '/payments',
    '/report',
    '/deeds',
    '/investors',
    '/videos',
    '/monitoring',
    '/changelog',
    '/coming-soon',
    '/markdown-tutorial',
    '/my-codes',
    '/debug',
  ];

  const isPublicPath = publicPaths.some((path) => to.path.startsWith(path));
  if (isPublicPath) {
    console.log('✅ ZONE MIDDLEWARE - Public path, no zone check needed');
    return true;
  }

  // Define zone mapping
  const zonePaths: Record<string, string> = {
    '/admin': 'admin',
    '/hamdel': 'hamdel',
    '/hammasir': 'hammasir',
    '/hampazhooh': 'hampazhooh',
    '/baham': 'baham',
    '/khebre': 'khebre',
    '/darmana': 'darmana',
    '/togetherMama': 'togetherMama',
    '/kanape': 'kanape',
    '/synapse': 'synapse',
    '/clinic': 'clinic',
    '/therapy-journey': 'therapy-journey',
  };

  // Get the zone for current path
  const pathZone = Object.keys(zonePaths).find((zone) => to.path.startsWith(zone));
  console.log('🔍 ZONE MIDDLEWARE - Detected zone:', pathZone);

  if (!pathZone) {
    // If no specific zone defined, allow access
    console.log('✅ ZONE MIDDLEWARE - No zone detected, allowing access');
    return true;
  }

  // User is authenticated, now check zone access
  const userZones = user.value.zones || [];
  console.log('🔍 ZONE MIDDLEWARE - User zones:', userZones);

  // Special handling for admin zone - requires admin role
  if (pathZone === '/admin') {
    const { role } = useUser();
    console.log('🔍 ZONE MIDDLEWARE - Admin zone check - User role:', role.value);
    if (role.value !== 'admin') {
      console.log('❌ ZONE MIDDLEWARE - Admin zone: User not admin, redirecting to zone restriction');
      return navigateTo(`/publicDomain/zone-restriction?zone=admin`);
    }
    console.log('✅ ZONE MIDDLEWARE - Admin zone: Access granted');
    return true;
  }

  // Check if user has access to the requested zone
  const requiredZone = zonePaths[pathZone];
  const hasAccess = userZones.includes(requiredZone);
  console.log('🔍 ZONE MIDDLEWARE - Required zone:', requiredZone, 'Has access:', hasAccess);

  if (!hasAccess) {
    // User doesn't have access to this zone
    console.log('❌ ZONE MIDDLEWARE - Zone: User does not have access, redirecting to zone restriction');
    return navigateTo(`/publicDomain/zone-restriction?zone=${requiredZone}`);
  }

  console.log('✅ ZONE MIDDLEWARE - Zone access granted');
  return true;
});
