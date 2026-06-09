import { prisma, getUserFromEvent } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const config = useRuntimeConfig()
  const apiKey = process.env.LEMONSQUEEZY_API_KEY || ''
  const storeId = process.env.LEMONSQUEEZY_STORE_ID || ''
  const variantId = process.env.LEMONSQUEEZY_MONTHLY_VARIANT_ID || ''
  const appUrl = config.public.appUrl || 'http://localhost:3000'

  if (!apiKey || !storeId || !variantId) {
    throw createError({ statusCode: 500, message: 'Payment not configured yet' })
  }

  // Create checkout via LemonSqueezy API
  const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: user.email,
            custom: {
              user_id: user.id,
            },
          },
          product_options: {
            redirect_url: `${appUrl}/app/dashboard?checkout=success`,
          },
        },
        relationships: {
          store: {
            data: { type: 'stores', id: storeId },
          },
          variant: {
            data: { type: 'variants', id: variantId },
          },
        },
      },
    }),
  })

  const json: any = await response.json()

  if (!response.ok) {
    console.error('LemonSqueezy checkout error:', JSON.stringify(json))
    throw createError({ statusCode: 500, message: 'Failed to create checkout' })
  }

  return { url: json.data?.attributes?.url }
})
