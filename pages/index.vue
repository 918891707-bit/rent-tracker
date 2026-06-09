<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Header -->
    <header class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2 font-bold text-2xl text-blue-600">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          RentTrack
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/auth/login" class="text-gray-600 hover:text-gray-900 font-medium">Log in</NuxtLink>
          <NuxtLink to="/auth/register" class="btn-primary">Start Free Trial</NuxtLink>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      <div class="max-w-3xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Built for independent landlords
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          The simplest way to<br/>
          <span class="text-blue-600">track rent payments</span>
        </h1>
        <p class="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Stop wrestling with spreadsheets or overpaying for bloated property management software.
          RentTrack gives you exactly what you need: rent tracking, automated reminders, and a clear dashboard.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/auth/register" class="btn-primary text-lg px-8 py-3 w-full sm:w-auto">
            Start free trial — no credit card
          </NuxtLink>
          <a href="#how-it-works" class="btn-secondary text-lg px-8 py-3 w-full sm:w-auto text-center">
            See how it works
          </a>
        </div>
        <p class="mt-4 text-sm text-gray-400">Free for 1 unit. $15/month unlimited.</p>
      </div>
    </section>

    <!-- Features -->
    <section id="how-it-works" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900">Everything you need. Nothing you don't.</h2>
        <p class="mt-4 text-gray-500 text-lg">Built specifically for landlords with 1-20 units.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="card text-center">
          <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">One-Click Rent Tracking</h3>
          <p class="text-gray-500">Mark rent as paid in one click. See who's current, who's late, and your monthly cash flow at a glance.</p>
        </div>

        <div class="card text-center">
          <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Automated Reminders</h3>
          <p class="text-gray-500">Tenants get friendly email reminders before rent is due. No more awkward "hey, rent is late" conversations.</p>
        </div>

        <div class="card text-center">
          <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Clean Dashboard</h3>
          <p class="text-gray-500">See your entire portfolio in one view: occupancy, collection rate, upcoming dues, and cash flow summary.</p>
        </div>
      </div>
    </section>

    <!-- Comparison -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900">Made for <span class="text-blue-600">you</span>, not for property management companies</h2>
      </div>

      <div class="overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Feature</th>
              <th class="text-center py-4 px-6 text-sm font-medium text-gray-500">Spreadsheets</th>
              <th class="text-center py-4 px-6 text-sm font-medium text-gray-500">Buildium/AppFolio</th>
              <th class="text-center py-4 px-6 text-sm font-medium text-white bg-blue-600 rounded-t-lg">RentTrack</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr>
              <td class="py-3 px-6 text-sm text-gray-900">Rent tracking</td>
              <td class="text-center py-3 px-6 text-sm text-gray-500">Manual</td>
              <td class="text-center py-3 px-6 text-sm text-gray-500">Overly complex</td>
              <td class="text-center py-3 px-6 text-sm text-green-600 font-medium bg-blue-50/50">One click ✓</td>
            </tr>
            <tr>
              <td class="py-3 px-6 text-sm text-gray-900">Tenant reminders</td>
              <td class="text-center py-3 px-6 text-sm text-gray-500">✗</td>
              <td class="text-center py-3 px-6 text-sm text-gray-500">Requires setup</td>
              <td class="text-center py-3 px-6 text-sm text-green-600 font-medium bg-blue-50/50">Automatic ✓</td>
            </tr>
            <tr>
              <td class="py-3 px-6 text-sm text-gray-900">Monthly cost</td>
              <td class="text-center py-3 px-6 text-sm text-gray-500">Free (but 10hrs/mo)</td>
              <td class="text-center py-3 px-6 text-sm text-red-500 font-medium">$50-200+</td>
              <td class="text-center py-3 px-6 text-sm text-green-600 font-medium bg-blue-50/50">$15 flat</td>
            </tr>
            <tr>
              <td class="py-3 px-6 text-sm text-gray-900">Setup time</td>
              <td class="text-center py-3 px-6 text-sm text-gray-500">Hours to build</td>
              <td class="text-center py-3 px-6 text-sm text-red-500">Days-weeks</td>
              <td class="text-center py-3 px-6 text-sm text-green-600 font-medium bg-blue-50/50">5 minutes ✓</td>
            </tr>
            <tr>
              <td class="py-3 px-6 text-sm text-gray-900">Use your own bank</td>
              <td class="text-center py-3 px-6 text-sm text-gray-500">N/A</td>
              <td class="text-center py-3 px-6 text-sm text-red-500">Sometimes forced</td>
              <td class="text-center py-3 px-6 text-sm text-green-600 font-medium bg-blue-50/50">Always ✓</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="bg-blue-600 rounded-3xl p-10 sm:p-16 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Start tracking rent in 5 minutes</h2>
        <p class="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
          Free for your first unit. No credit card required. Upgrade to unlimited when you're ready.
        </p>
        <NuxtLink to="/auth/register" class="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors">
          Get started free
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-100 py-10 mt-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
        &copy; {{ new Date().getFullYear() }} RentTrack. Built for independent landlords.
      </div>
    </footer>
  </div>
</template>
