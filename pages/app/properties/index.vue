<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Properties</h1>
        <p class="text-gray-500 mt-1">Manage your rental properties</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary">+ Add Property</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 3" :key="i" class="card animate-pulse">
        <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="properties.length === 0" class="card text-center py-16">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
      <p class="text-gray-500 mb-4">Add your first property to get started tracking rent.</p>
      <button @click="showAddModal = true" class="btn-primary">Add your first property</button>
    </div>

    <!-- Property cards -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="prop in properties"
        :key="prop.id"
        class="card hover:shadow-md transition-shadow cursor-pointer"
        @click="navigateTo(`/app/properties/${prop.id}`)"
      >
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ prop.name }}</h3>
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-xs font-medium',
              prop._occupiedUnits === prop.units.length ? 'bg-green-100 text-green-700' :
              prop._occupiedUnits > 0 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            ]"
          >
            {{ prop._occupiedUnits }}/{{ prop.units.length }} occupied
          </span>
        </div>
        <p v-if="prop.address" class="text-sm text-gray-500 mb-3">{{ prop.address }}{{ prop.city ? `, ${prop.city}` : '' }}{{ prop.state ? `, ${prop.state}` : '' }} {{ prop.zipCode || '' }}</p>
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500">{{ prop.units.length }} unit{{ prop.units.length !== 1 ? 's' : '' }}</span>
          <span class="font-medium text-gray-900">
            ${{ prop._monthlyRent?.toLocaleString() || '0' }}/mo
          </span>
        </div>
        <!-- Last payment status -->
        <div v-if="prop._latestStatus" class="mt-3 pt-3 border-t border-gray-50">
          <span
            :class="[
              'text-xs font-medium px-2 py-1 rounded-full',
              prop._latestStatus === 'paid' ? 'bg-green-100 text-green-700' :
              prop._latestStatus === 'late' || prop._latestStatus === 'overdue' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            ]"
          >
            {{ prop._latestStatus === 'paid' ? 'All paid' : prop._latestStatus === 'overdue' ? 'Overdue' : 'Pending' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Add Property Modal -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="showAddModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Add Property</h2>
          <form @submit.prevent="handleAddProperty" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
              <input v-model="form.name" required class="input-field" placeholder="e.g., Maple Street Duplex" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input v-model="form.address" class="input-field" placeholder="123 Main St" />
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input v-model="form.city" class="input-field" placeholder="City" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input v-model="form.state" class="input-field" placeholder="TX" maxlength="2" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                <input v-model="form.zipCode" class="input-field" placeholder="12345" />
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" @click="showAddModal = false" class="btn-secondary flex-1">Cancel</button>
              <button type="submit" :disabled="saving" class="btn-primary flex-1">
                {{ saving ? 'Adding...' : 'Add Property' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })

const loading = ref(true)
const properties = ref<any[]>([])
const showAddModal = ref(false)
const saving = ref(false)

const form = ref({ name: '', address: '', city: '', state: '', zipCode: '' })

async function loadProperties() {
  try {
    const data = await $fetch('/api/properties', {
      headers: { Authorization: `Bearer ${localStorage.getItem('rent_track_token')}` }
    })
    properties.value = data.map((p: any) => ({
      ...p,
      _occupiedUnits: p.units.filter((u: any) => u.tenants.length > 0).length,
      _monthlyRent: p.units.reduce((sum: number, u: any) => sum + (u.rentAmount || 0), 0),
      _latestStatus: getOverallStatus(p.units),
    }))
  } catch (e) {
    console.error('Failed to load properties', e)
  } finally {
    loading.value = false
  }
}

function getOverallStatus(units: any[]): string {
  const allPayments = units.flatMap((u: any) => u.payments)
  if (allPayments.length === 0) return 'pending'
  const latest = allPayments.sort((a: any, b: any) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
  const hasOverdue = latest.some((p: any) =>
    p.status !== 'paid' && new Date(p.dueDate) < new Date()
  )
  if (hasOverdue) return 'overdue'
  const allPaid = latest.every((p: any) => p.status === 'paid')
  return allPaid ? 'paid' : 'pending'
}

async function handleAddProperty() {
  saving.value = true
  try {
    await $fetch('/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('rent_track_token')}`,
      },
      body: JSON.stringify(form.value),
    })
    showAddModal.value = false
    form.value = { name: '', address: '', city: '', state: '', zipCode: '' }
    await loadProperties()
  } catch (e: any) {
    console.error('Failed to add property', e)
  } finally {
    saving.value = false
  }
}

onMounted(loadProperties)
</script>
