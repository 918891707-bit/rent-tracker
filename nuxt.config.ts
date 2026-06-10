// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    // Server-side only
    lemonsqueezyApiKey: process.env.LEMONSQUEEZY_API_KEY || '',
    lemonsqueezyWebhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    // Public
    public: {
      appUrl: process.env.APP_URL || 'http://localhost:3000',
      lemonsqueezyStoreId: process.env.LEMONSQUEEZY_STORE_ID || '',
    }
  },
  app: {
    head: {
      title: 'RentTrack — Simple Rent Tracking for Independent Landlords (1-20 Units)',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'The simplest rent tracking app for independent landlords. Track payments, send automatic reminders, and see your cash flow at a glance. Free for 1 unit, $15/mo unlimited. No bloat, no bank account required.' },
        { name: 'keywords', content: 'rent tracking, landlord software, rent collection, rental property management, small landlord, rent reminder, rent payment tracker, Buildium alternative, Stessa alternative, Landlord Studio alternative' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'RentTrack' },
        // Open Graph
        { property: 'og:title', content: 'RentTrack — Simple Rent Tracking for Independent Landlords' },
        { property: 'og:description', content: 'Track rent payments, send automatic reminders, and stay organized. Built for landlords with 1-20 units. Free to start.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://rent-tracker-six.vercel.app' },
        { property: 'og:site_name', content: 'RentTrack' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'RentTrack — Simple Rent Tracking for Landlords' },
        { name: 'twitter:description', content: 'Track rent payments, send reminders, stay organized. Free for 1 unit.' },
        // Schema
        { name: 'application-name', content: 'RentTrack' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://rent-tracker-six.vercel.app' },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RentTrack',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Simple rent tracking and payment reminder software for independent landlords with 1-20 units.',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              description: 'Free for 1 unit',
            },
          }),
        },
      ],
    }
  },
  css: ['~/assets/css/main.css'],
})
