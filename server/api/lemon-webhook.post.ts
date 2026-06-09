import { prisma } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const rawBody = await readRawBody(event)
  if (!rawBody) throw createError({ statusCode: 400, message: 'Missing body' })

  const body = JSON.parse(rawBody)
  const eventName = body.meta?.event_name

  // Verify webhook signature
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || ''
  if (secret) {
    const signature = getHeader(event, 'x-signature')
    // In production, verify HMAC signature here
    if (!signature) {
      throw createError({ statusCode: 401, message: 'Missing signature' })
    }
  }

  console.log('LemonSqueezy webhook:', eventName)

  switch (eventName) {
    case 'subscription_created':
    case 'order_created': {
      const userId = body.meta?.custom_data?.user_id
      const subscriptionId = body.data?.attributes?.subscription_id?.toString()
      const orderId = body.data?.id

      if (userId && subscriptionId) {
        await prisma.subscription.updateMany({
          where: { userId },
          data: {
            plan: 'premium',
            status: 'active',
            stripeSubscriptionId: subscriptionId, // reuse column for LemonSqueezy ID
          }
        })
        console.log(`User ${userId} upgraded to premium (order: ${orderId})`)
      }
      break
    }

    case 'subscription_expired':
    case 'subscription_cancelled': {
      const subscriptionId = body.data?.attributes?.subscription_id?.toString()
      if (subscriptionId) {
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { plan: 'free', status: 'canceled' }
        })
      }
      break
    }
  }

  return { received: true }
})
