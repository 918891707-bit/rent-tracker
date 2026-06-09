import Stripe from 'stripe'
import { prisma } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2024-11-20.acacia' as any })

  const sig = getHeader(event, 'stripe-signature')
  if (!sig) throw createError({ statusCode: 400, message: 'Missing stripe-signature header' })

  const rawBody = await readRawBody(event)
  if (!rawBody) throw createError({ statusCode: 400, message: 'Missing body' })

  let stripeEvent: Stripe.Event
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, config.stripeWebhookSecret)
  } catch (err: any) {
    throw createError({ statusCode: 400, message: `Webhook signature verification failed: ${err.message}` })
  }

  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      if (userId && session.subscription) {
        await prisma.subscription.update({
          where: { userId },
          data: {
            stripeSubscriptionId: session.subscription as string,
            plan: 'premium',
            status: 'active',
          }
        })
      }
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = stripeEvent.data.object as Stripe.Subscription
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { plan: 'free', status: 'canceled' }
      })
      break
    }
  }

  return { received: true }
})
