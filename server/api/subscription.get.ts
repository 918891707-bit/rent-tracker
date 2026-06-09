import { prisma, getUserFromEvent } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  let sub = await prisma.subscription.findUnique({ where: { userId: user.id } })
  if (!sub) {
    sub = await prisma.subscription.create({
      data: { userId: user.id, plan: 'free', status: 'active' }
    })
  }
  return sub
})
