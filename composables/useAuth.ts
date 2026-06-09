import { ref, computed } from 'vue'
import type { User } from '@prisma/client'

interface AuthState {
  user: Omit<User, 'passwordHash'> | null
  token: string | null
  loading: boolean
}

const state = ref<AuthState>({
  user: null,
  token: null,
  loading: true,
})

export const useAuth = () => {
  const isAuthenticated = computed(() => !!state.value.token && !!state.value.user)
  const user = computed(() => state.value.user)
  const loading = computed(() => state.value.loading)

  async function init() {
    const token = localStorage.getItem('rent_track_token')
    if (!token) {
      state.value.loading = false
      return
    }
    state.value.token = token
    try {
      const res = await $fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      state.value.user = res.user
    } catch {
      localStorage.removeItem('rent_track_token')
      state.value.token = null
    }
    state.value.loading = false
  }

  async function login(email: string, password: string) {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    state.value.token = res.token
    state.value.user = res.user
    localStorage.setItem('rent_track_token', res.token)
    return res
  }

  async function register(email: string, password: string, name?: string) {
    const res = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email, password, name }
    })
    state.value.token = res.token
    state.value.user = res.user
    localStorage.setItem('rent_track_token', res.token)
    return res
  }

  function logout() {
    state.value.user = null
    state.value.token = null
    localStorage.removeItem('rent_track_token')
    navigateTo('/')
  }

  return {
    isAuthenticated,
    user,
    loading,
    init,
    login,
    register,
    logout,
  }
}
