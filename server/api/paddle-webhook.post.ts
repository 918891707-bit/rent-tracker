import { prisma } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const rawBody = await readRawBody(event)
  if (!rawBody) throw createError({ statusCode: 400 })

  const body = JSON.parse(rawBody)
  const eventType = body.event_type

  console.log('Paddle webhook:', eventType, JSON.stringify(body.data?.id))

  switch (eventType) {
    case 'subscription.activated':
    case 'subscription.created': {
      const subData = body.data
      const userId = subData?.custom_data?.user_id
      const paddleSubId = subData?.id

      if (userId && paddleSubId) {
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeSubscriptionId: paddleSubId, // reuse field
            stripeCustomerId: subData?.customer_id,
            plan: 'premium',
            status: 'active',
          },
          update: {
            plan: 'premium',
            status: 'active',
            stripeSubscriptionId: paddleSubId,
          }
        })
      }
      break
    }

    case 'subscription.canceled':
    case 'subscription.past_due': {
      const paddleSubId = body.data?.id
      if (paddleSubId) {
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: paddleSubId },
          data: { status: 'canceled', plan: 'free' }
        })
      }
      break
    }

    case 'subscription.updated': {
      const paddleSubId = body.data?.id
      const newStatus = body.data?.status
      if (paddleSubId && newStatus === 'active') {
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: paddleSubId },
          data: { status: 'active', plan: 'premium' }
        })
      }
      break
    }
  }

  return { received: true }
})
