<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500 mt-1">Your rental portfolio at a glance</p>
      </div>
      <NuxtLink to="/app/properties" class="btn-primary">
        + Add Property
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="i in 4" :key="i" class="card animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>

    <!-- Stats -->
    <div v-else-if="stats" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="card">
        <p class="text-sm text-gray-500 font-medium">Monthly Expected</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">${{ stats.totalExpectedRent.toLocaleString() }}</p>
      </div>
      <div class="card">
        <p class="text-sm text-gray-500 font-medium">Collected This Month</p>
        <p class="text-2xl font-bold text-green-600 mt-1">${{ stats.collectedThisMonth.toLocaleString() }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ stats.collectionRate }}% collection rate</p>
      </div>
      <div class="card">
        <p class="text-sm text-gray-500 font-medium">Overdue</p>
        <p class="text-2xl font-bold text-red-600 mt-1">${{ stats.overdueAmount.toLocaleString() }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ stats.overduePayments }} payments overdue</p>
      </div>
      <div class="card">
        <p class="text-sm text-gray-500 font-medium">Occupancy</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.occupiedUnits }}/{{ stats.totalUnits }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ stats.vacancyRate }}% vacancy</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && stats && stats.totalUnits === 0" class="card text-center py-16">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Welcome to RentTrack!</h2>
      <p class="text-gray-500 mb-6 max-w-md mx-auto">
        Start by adding your first property. It takes less than 2 minutes.
      </p>
      <NuxtLink to="/app/properties" class="btn-primary">Add your first property</NuxtLink>
    </div>

    <!-- Upcoming & Recent -->
    <div v-if="stats && stats.totalUnits > 0" class="grid lg:grid-cols-2 gap-6">
      <!-- Upcoming Due -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Due This Week</h3>
        <div v-if="stats.upcomingDue.length === 0" class="text-gray-400 text-sm py-4 text-center">
          Nothing due in the next 7 days ✓
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="p in stats.upcomingDue"
            :key="p.id"
            class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ p.unit?.name || 'Unit' }}
                <span v-if="p.tenant?.name" class="text-gray-400 font-normal">· {{ p.tenant.name }}</span>
              </p>
              <p class="text-xs text-gray-400">Due {{ formatDate(p.dueDate) }}</p>
            </div>
            <span :class="['text-sm font-semibold', p.status === 'overdue' ? 'text-red-600' : 'text-gray-900']">
              ${{ p.amount.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recent Payments -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
        <div v-if="stats.recentPayments.length === 0" class="text-gray-400 text-sm py-4 text-center">
          No payments recorded yet
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="p in stats.recentPayments"
            :key="p.id"
            class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ p.unit?.name || 'Unit' }}
                <span v-if="p.tenant?.name" class="text-gray-400 font-normal">· {{ p.tenant.name }}</span>
              </p>
              <p class="text-xs text-gray-400">Paid {{ formatDate(p.paidDate) }}</p>
            </div>
            <span class="text-sm font-semibold text-green-600">+${{ p.amount.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })

const loading = ref(true)
const stats = ref<any>(null)

onMounted(async () => {
  try {
    const data = await $fetch('/api/dashboard', {
      headers: { Authorization: `Bearer ${localStorage.getItem('rent_track_token')}` }
    })
    stats.value = data
  } catch (e) {
    console.error('Failed to load dashboard', e)
  } finally {
    loading.value = false
  }
})

function formatDate(d: string | Date | null | undefined) {
  if (!d) return 'N/A'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
