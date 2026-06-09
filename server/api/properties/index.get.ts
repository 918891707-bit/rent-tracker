import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  return prisma.property.findMany({
    where: { userId: user.id },
    include: {
      units: {
        include: {
          tenants: { where: { isActive: true }, take: 1 },
          payments: { orderBy: { dueDate: 'desc' }, take: 1 },
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
})
