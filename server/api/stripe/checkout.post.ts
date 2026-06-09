import Stripe from 'stripe'
import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2024-11-20.acacia' as any })

  const body = await readBody(event)
  const plan = body.plan || 'monthly'

  const prices: Record<string, string> = {
    monthly: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly',
    yearly: process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly',
  }

  // Get or create Stripe customer
  let subscription = await prisma.subscription.findUnique({ where: { userId: user.id } })
  let customerId = subscription?.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || user.email,
    })
    customerId = customer.id
    await prisma.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        stripeCustomerId: customerId,
        plan: 'free',
        status: 'active',
      },
      update: {
        stripeCustomerId: customerId,
      }
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: prices[plan], quantity: 1 }],
    success_url: `${config.public.appUrl}/app/dashboard?checkout=success`,
    cancel_url: `${config.public.appUrl}/app/settings?checkout=canceled`,
    metadata: { userId: user.id },
  })

  return { url: session.url }
})
