export default defineNuxtRouteMiddleware((to) => {
  // Only run on client
  if (process.server) return

  const token = localStorage.getItem('rent_track_token')
  if (!token) {
    return navigateTo('/auth/login')
  }
})
