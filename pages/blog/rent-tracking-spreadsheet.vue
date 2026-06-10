<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 py-16">
      <NuxtLink to="/blog" class="text-blue-600 hover:underline text-sm mb-8 inline-block">← Blog</NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Why Spreadsheets Break After 3 Rental Units</h1>
      <p class="text-gray-400 text-sm mb-8">Updated June 2025 · 4 min read</p>

      <article class="prose prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed">
        <p>When you buy your first rental property, a Google Sheet or Excel workbook feels like the obvious solution. It's free, you already know how to use it, and with just one tenant, there's not much to track.</p>
        <p>Then you buy a second property. And a third. Suddenly your "simple spreadsheet" has 14 tabs, cross-referenced formulas, and you're spending Sunday afternoons reconciling who paid what.</p>

        <h2 class="text-xl font-bold text-gray-900 mt-8">The 3-Unit Breaking Point</h2>
        <p>Almost every landlord I've talked to hits the same wall at 3 units. Here's what happens:</p>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Formula errors multiply.</strong> One wrong cell reference cascades through your entire tracking system. You think you're tracking everything correctly, but a single typo means you've been calculating someone's balance wrong for months.</li>
          <li><strong>No automatic reminders.</strong> You have to remember to text or email each tenant individually. Forget once, and they "forget" to pay on time.</li>
          <li><strong>Tax preparation becomes a nightmare.</strong> Come tax season, you're digging through bank statements and spreadsheet tabs trying to reconstruct 12 months of income and expenses.</li>
          <li><strong>You can't check anything on your phone.</strong> Spreadsheets on mobile are unusable. If a tenant asks "did I pay last month?" while you're out, you can't answer.</li>
        </ul>

        <h2 class="text-xl font-bold text-gray-900 mt-8">What to Use Instead</h2>
        <p>The good news: you don't need to pay $200/month for enterprise property management software. There are tools built specifically for landlords with 1-20 units that cost less than a single rent check.</p>
        <p>Look for something that:</p>
        <ul class="list-disc pl-5 space-y-2">
          <li>Lets you mark rent as paid in one click</li>
          <li>Sends automatic reminders to tenants</li>
          <li>Works on both desktop and mobile</li>
          <li>Takes less than 10 minutes to set up</li>
          <li>Doesn't force you to change banks</li>
        </ul>

        <p>I built <a href="https://rent-tracker-six.vercel.app" class="text-blue-600">RentTrack</a> exactly for this reason — simple rent tracking without the spreadsheet headache. Free for your first unit, $15/month for unlimited. But whatever tool you pick, the key is to stop using spreadsheets before they cost you real money in missed payments or tax mistakes.</p>
      </article>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Why Spreadsheets Break After 3 Rental Units | RentTrack',
  meta: [
    { name: 'description', content: 'Google Sheets and Excel work for 1-2 units, but fall apart at 3+. Learn the warning signs and what to use instead for rent tracking.' },
    { name: 'keywords', content: 'rent tracking spreadsheet, landlord spreadsheet template, excel rent tracking, google sheets landlord, rent collection tracking' },
  ]
})
</script>
