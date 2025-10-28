export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();

  // Public paths that don't require authentication
  const publicPaths = [
    '/auth',
    '/publicDomain',
  ];

  const isPublicPath = publicPaths.some(path => to.path.startsWith(path));

  // If path is public, allow access
  if (isPublicPath) {
    return true;
  }

  // Check if user is authenticated
  if (!nuxtApp.$pb.authStore.isValid || !nuxtApp.$pb.authStore.model?.id) {
    console.error('User not authenticated, redirecting to login');
    return navigateTo('/auth/login');
  }

  return true;
});
