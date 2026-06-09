<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

    <!-- Reminder Settings -->
    <div class="card mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Reminders</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">Enable rent reminders</p>
            <p class="text-xs text-gray-500">Automatically email tenants about upcoming and late payments</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.reminderEnabled" class="sr-only peer" @change="saveSettings" />
            <div class="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Send reminder {{ settings.reminderDaysBefore }} day(s) before due date
          </label>
          <input
            type="range"
            v-model.number="settings.reminderDaysBefore"
            min="1"
            max="14"
            class="w-full"
            @change="saveSettings"
          />
          <div class="flex justify-between text-xs text-gray-400">
            <span>1 day</span>
            <span>14 days</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Mark as late {{ settings.lateAfterDays }} day(s) after due date
          </label>
          <input
            type="range"
            v-model.number="settings.lateAfterDays"
            min="1"
            max="30"
            class="w-full"
            @change="saveSettings"
          />
          <div class="flex justify-between text-xs text-gray-400">
            <span>1 day</span>
            <span>30 days</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select v-model="settings.currency" class="input-field max-w-[200px]" @change="saveSettings">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="AUD">AUD (A$)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Subscription -->
    <div class="card mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Subscription</h2>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-900">
            Current plan: <span class="capitalize">{{ subscription?.plan || 'free' }}</span>
          </p>
          <p class="text-xs text-gray-500 mt-1">
            {{ subscription?.plan === 'premium' ? 'Unlimited properties and units' : 'Free for 1 unit. Upgrade for unlimited.' }}
          </p>
        </div>
        <button
          v-if="subscription?.plan !== 'premium'"
          @click="handleUpgrade"
          class="btn-primary"
        >
          Upgrade to Premium — $15/mo
        </button>
        <span v-else class="text-green-600 font-medium text-sm">Premium ✓</span>
      </div>
    </div>

    <!-- Account -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Account</h2>
      <p class="text-sm text-gray-500 mb-4">Logged in as {{ user?.email }}</p>
      <button @click="logout" class="btn-danger">Log out</button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })
const { user, logout } = useAuth()

const settings = ref({
  reminderEnabled: true,
  reminderDaysBefore: 3,
  reminderDaysAfter: 5,
  lateAfterDays: 5,
  currency: 'USD',
})
const subscription = ref<any>(null)

onMounted(async () => {
  try {
    const [s, sub] = await Promise.all([
      $fetch('/api/settings', {
        headers: { Authorization: `Bearer ${localStorage.getItem('rent_track_token')}` }
      }),
      $fetch('/api/subscription', {
        headers: { Authorization: `Bearer ${localStorage.getItem('rent_track_token')}` }
      }).catch(() => null),
    ])
    if (s) {
      settings.value.reminderEnabled = s.reminderEnabled
      settings.value.reminderDaysBefore = s.reminderDaysBefore
      settings.value.reminderDaysAfter = s.reminderDaysAfter
      settings.value.lateAfterDays = s.lateAfterDays
      settings.value.currency = s.currency
    }
    subscription.value = sub
  } catch (e) {
    console.error(e)
  }
})

let saveTimeout: ReturnType<typeof setTimeout>
async function saveSettings() {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(async () => {
    try {
      await $fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('rent_track_token')}`,
        },
        body: JSON.stringify(settings.value),
      })
    } catch (e) { console.error(e) }
  }, 500)
}

async function handleUpgrade() {
  try {
    const res: any = await $fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('rent_track_token')}`,
      },
      body: JSON.stringify({ plan: 'monthly' }),
    })
    if (res.url) {
      window.location.href = res.url
    }
  } catch (e) {
    console.error('Failed to start checkout', e)
  }
}
</script>
