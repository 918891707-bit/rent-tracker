<template>
  <div>
    <!-- Back + header -->
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/app/properties" class="text-gray-400 hover:text-gray-600">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-gray-900">{{ property?.name }}</h1>
        <p v-if="property?.address" class="text-gray-500 text-sm">{{ property.address }}{{ property.city ? `, ${property.city}` : '' }} {{ property.state }} {{ property.zipCode }}</p>
      </div>
      <button @click="showAddUnit = true" class="btn-primary text-sm">+ Add Unit</button>
    </div>

    <div v-if="loading" class="card text-center py-12 text-gray-400">Loading...</div>

    <div v-else-if="property" class="space-y-6">
      <!-- Units -->
      <div v-for="unit in property.units" :key="unit.id" class="card">
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ unit.name }}</h3>
              <span v-if="unit.tenants.length > 0" class="text-sm text-gray-400">· {{ unit.tenants[0]?.name }}</span>
            </div>
            <p class="text-sm text-gray-500">Rent: ${{ (unit.rentAmount || 0).toLocaleString() }}/mo</p>
          </div>
          <div class="flex gap-2">
            <button @click="openAddPayment(unit)" class="btn-secondary text-sm py-1.5">+ Payment</button>
            <button @click="openAddTenant(unit)" class="btn-secondary text-sm py-1.5">+ Tenant</button>
            <button @click="deleteUnit(unit.id)" class="text-red-400 hover:text-red-600 text-sm py-1.5 px-2">🗑</button>
          </div>
        </div>

        <!-- Payment history table -->
        <div v-if="unit.payments.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left py-2 text-gray-500 font-medium">Due Date</th>
                <th class="text-left py-2 text-gray-500 font-medium">Paid Date</th>
                <th class="text-right py-2 text-gray-500 font-medium">Amount</th>
                <th class="text-center py-2 text-gray-500 font-medium">Status</th>
                <th class="text-right py-2 text-gray-500 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in unit.payments" :key="p.id" class="border-b border-gray-50">
                <td class="py-2 text-gray-900">{{ formatDate(p.dueDate) }}</td>
                <td class="py-2 text-gray-500">{{ p.paidDate ? formatDate(p.paidDate) : '—' }}</td>
                <td class="py-2 text-right font-medium">${{ p.amount.toLocaleString() }}</td>
                <td class="py-2 text-center">
                  <span :class="statusClass(p.status)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                    {{ p.status }}
                  </span>
                </td>
                <td class="py-2 text-right">
                  <button
                    v-if="p.status !== 'paid'"
                    @click="markPaid(p)"
                    class="text-green-600 hover:text-green-700 text-xs font-medium"
                  >
                    Mark Paid
                  </button>
                  <span v-else class="text-gray-300 text-xs">✓</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-sm text-gray-400 text-center py-4">No payments recorded yet</p>

        <!-- Tenant info -->
        <div v-if="unit.tenants.length > 0" class="mt-4 pt-4 border-t border-gray-100">
          <p class="text-sm text-gray-500">
            <span class="font-medium text-gray-700">Tenant:</span>
            {{ unit.tenants[0].name }}
            <span v-if="unit.tenants[0].email">· {{ unit.tenants[0].email }}</span>
            <span v-if="unit.tenants[0].phone">· {{ unit.tenants[0].phone }}</span>
          </p>
        </div>
      </div>

      <div v-if="property.units.length === 0" class="card text-center py-12 text-gray-400">
        No units yet. Add your first unit to start tracking rent.
      </div>
    </div>

    <!-- Add Unit Modal -->
    <Teleport to="body">
      <div v-if="showAddUnit" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="showAddUnit = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
          <h2 class="text-xl font-bold mb-4">Add Unit</h2>
          <form @submit.prevent="handleAddUnit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Unit Name *</label>
              <input v-model="unitForm.name" required class="input-field" placeholder="e.g., Unit A, Apt 1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ($)</label>
              <input v-model.number="unitForm.rentAmount" type="number" min="0" step="0.01" class="input-field" placeholder="1500" />
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" @click="showAddUnit = false" class="btn-secondary flex-1">Cancel</button>
              <button type="submit" :disabled="saving" class="btn-primary flex-1">Add Unit</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Add Payment Modal -->
    <Teleport to="body">
      <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="showPaymentModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
          <h2 class="text-xl font-bold mb-4">Record Payment</h2>
          <form @submit.prevent="handleAddPayment" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Amount ($) *</label>
              <input v-model.number="paymentForm.amount" type="number" required min="0" step="0.01" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input v-model="paymentForm.dueDate" type="date" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Paid Date (leave empty if not paid)</label>
              <input v-model="paymentForm.paidDate" type="date" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Method</label>
              <select v-model="paymentForm.method" class="input-field">
                <option value="">Select...</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="online">Online (Zelle/Venmo/etc)</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input v-model="paymentForm.notes" class="input-field" placeholder="Optional notes" />
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" @click="showPaymentModal = false" class="btn-secondary flex-1">Cancel</button>
              <button type="submit" :disabled="saving" class="btn-primary flex-1">Save Payment</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Add Tenant Modal -->
    <Teleport to="body">
      <div v-if="showTenantModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="showTenantModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
          <h2 class="text-xl font-bold mb-4">Add Tenant</h2>
          <form @submit.prevent="handleAddTenant" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input v-model="tenantForm.name" required class="input-field" placeholder="Tenant full name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="tenantForm.email" type="email" class="input-field" placeholder="tenant@email.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input v-model="tenantForm.phone" type="tel" class="input-field" placeholder="+1 (555) 123-4567" />
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" @click="showTenantModal = false" class="btn-secondary flex-1">Cancel</button>
              <button type="submit" :disabled="saving" class="btn-primary flex-1">Add Tenant</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })
const route = useRoute()

const property = ref<any>(null)
const loading = ref(true)
const showAddUnit = ref(false)
const showPaymentModal = ref(false)
const showTenantModal = ref(false)
const saving = ref(false)
const selectedUnit = ref<any>(null)

const unitForm = ref({ name: '', rentAmount: 0 })
const paymentForm = ref({
  amount: 0,
  dueDate: '',
  paidDate: '',
  method: '',
  notes: '',
})
const tenantForm = ref({ name: '', email: '', phone: '' })

async function loadProperty() {
  try {
    const data = await $fetch(`/api/properties/${route.params.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('rent_track_token')}` }
    })
    property.value = data
  } catch (e) {
    console.error('Failed to load property', e)
  } finally {
    loading.value = false
  }
}

async function handleAddUnit() {
  saving.value = true
  try {
    await $fetch('/api/units', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('rent_track_token')}`,
      },
      body: JSON.stringify({ propertyId: route.params.id, ...unitForm.value }),
    })
    showAddUnit.value = false
    unitForm.value = { name: '', rentAmount: 0 }
    await loadProperty()
  } catch (e) { console.error(e) }
  finally { saving.value = false }
}

function openAddPayment(unit: any) {
  selectedUnit.value = unit
  paymentForm.value = {
    amount: unit.rentAmount || 0,
    dueDate: new Date().toISOString().slice(0, 10),
    paidDate: '',
    method: '',
    notes: '',
  }
  showPaymentModal.value = true
}

async function handleAddPayment() {
  saving.value = true
  try {
    await $fetch('/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('rent_track_token')}`,
      },
      body: JSON.stringify({
        unitId: selectedUnit.value.id,
        tenantId: selectedUnit.value.tenants[0]?.id || null,
        amount: paymentForm.value.amount,
        dueDate: paymentForm.value.dueDate,
        paidDate: paymentForm.value.paidDate || null,
        method: paymentForm.value.method || null,
        notes: paymentForm.value.notes || null,
      }),
    })
    showPaymentModal.value = false
    await loadProperty()
  } catch (e) { console.error(e) }
  finally { saving.value = false }
}

function openAddTenant(unit: any) {
  selectedUnit.value = unit
  tenantForm.value = { name: '', email: '', phone: '' }
  showTenantModal.value = true
}

async function handleAddTenant() {
  saving.value = true
  try {
    await $fetch('/api/tenants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('rent_track_token')}`,
      },
      body: JSON.stringify({ unitId: selectedUnit.value.id, ...tenantForm.value }),
    })
    showTenantModal.value = false
    await loadProperty()
  } catch (e) { console.error(e) }
  finally { saving.value = false }
}

async function markPaid(payment: any) {
  try {
    await $fetch(`/api/payments/${payment.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('rent_track_token')}`,
      },
      body: JSON.stringify({
        paidDate: new Date().toISOString(),
        status: 'paid',
      }),
    })
    await loadProperty()
  } catch (e) { console.error(e) }
}

async function deleteUnit(unitId: string) {
  if (!confirm('Delete this unit? All data will be permanently removed.')) return
  try {
    await $fetch(`/api/units/${unitId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('rent_track_token')}` },
    })
    await loadProperty()
  } catch (e) { console.error(e) }
}

function formatDate(d: string | Date | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusClass(status: string) {
  return status === 'paid' ? 'bg-green-100 text-green-700' :
         status === 'overdue' ? 'bg-red-100 text-red-700' :
         status === 'late' ? 'bg-orange-100 text-orange-700' :
         'bg-yellow-100 text-yellow-700'
}

onMounted(loadProperty)
</script>
