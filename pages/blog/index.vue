<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 py-16">
      <NuxtLink to="/" class="text-blue-600 hover:underline text-sm mb-8 inline-block">← Back to RentTrack</NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900 mb-8">RentTrack Blog</h1>
      <div class="space-y-6">
        <NuxtLink to="/blog/buildium-alternative" class="card block hover:shadow-md transition-shadow">
          <h2 class="text-lg font-semibold text-blue-600 mb-2">Best Buildium Alternatives for Small Landlords (2025)</h2>
          <p class="text-gray-600 text-sm">Why you don't need enterprise PM software for 1-20 units — and what to use instead.</p>
        </NuxtLink>
        <NuxtLink to="/blog/rent-tracking-spreadsheet" class="card block hover:shadow-md transition-shadow">
          <h2 class="text-lg font-semibold text-blue-600 mb-2">Why Spreadsheets Break After 3 Rental Units</h2>
          <p class="text-gray-600 text-sm">And how to track rent properly without spending hours on formulas.</p>
        </NuxtLink>
        <NuxtLink to="/blog/best-rent-tracking-apps" class="card block hover:shadow-md transition-shadow">
          <h2 class="text-lg font-semibold text-blue-600 mb-2">5 Best Rent Tracking Apps for Independent Landlords</h2>
          <p class="text-gray-600 text-sm">Honest comparison: pricing, features, and which one is right for your portfolio size.</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Rent Tracking Blog — Tips for Independent Landlords',
  meta: [
    { name: 'description', content: 'Practical guides for independent landlords: software comparisons, rent tracking tips, and tax preparation help. Written by a landlord, for landlords.' },
  ]
})
</script>
