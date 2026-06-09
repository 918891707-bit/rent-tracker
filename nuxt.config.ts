// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    // Server-side only
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    // Public
    public: {
      appUrl: process.env.APP_URL || 'http://localhost:3000',
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    }
  },
  app: {
    head: {
      title: 'RentTrack — Simple Rent Management for Independent Landlords',
      meta: [
        { name: 'description', content: 'The simplest way to track rent payments, send automated reminders, and stay organized. Built for landlords with 1-20 units.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
})
