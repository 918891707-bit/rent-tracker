<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 font-bold text-2xl text-blue-600">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          RentTrack
        </NuxtLink>
      </div>

      <div class="card">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Start your free trial</h1>
        <p class="text-gray-500 mb-6">No credit card required. Free for your first unit.</p>

        <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {{ error }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
            <input v-model="name" type="text" class="input-field" placeholder="John Smith" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="email" type="email" required class="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input v-model="password" type="password" required minlength="8" class="input-field" placeholder="At least 8 characters" />
          </div>
          <button type="submit" :disabled="loading" class="btn-primary w-full py-2.5">
            {{ loading ? 'Creating account...' : 'Create free account' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-500">
          Already have an account?
          <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-700 font-medium">Log in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { register } = useAuth()
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await register(email.value, password.value, name.value || undefined)
    await navigateTo('/app/dashboard')
  } catch (e: any) {
    error.value = e.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
