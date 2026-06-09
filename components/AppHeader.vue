<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center gap-8">
          <NuxtLink to="/app/dashboard" class="flex items-center gap-2 font-bold text-xl text-blue-600">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            RentTrack
          </NuxtLink>
          <nav class="hidden md:flex items-center gap-1">
            <NuxtLink
              to="/app/dashboard"
              class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              active-class="text-blue-600 bg-blue-50"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/app/properties"
              class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              active-class="text-blue-600 bg-blue-50"
            >
              Properties
            </NuxtLink>
            <NuxtLink
              to="/app/settings"
              class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              active-class="text-blue-600 bg-blue-50"
            >
              Settings
            </NuxtLink>
          </nav>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500 hidden sm:block">{{ user?.email }}</span>
          <button @click="logout" class="btn-secondary text-sm py-1.5 px-3">
            Log out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
</script>
