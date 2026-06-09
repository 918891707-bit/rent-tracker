import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const query = getQuery(event)
  const unitId = query.unitId as string | undefined
  const status = query.status as string | undefined
  const limit = parseInt((query.limit as string) || '50')

  const where: any = {
    unit: {
      property: { userId: user.id }
    }
  }
  if (unitId) where.unitId = unitId
  if (status) where.status = status

  return prisma.payment.findMany({
    where,
    include: {
      unit: { select: { name: true, propertyId: true } },
      tenant: { select: { name: true } },
    },
    orderBy: { dueDate: 'desc' },
    take: limit,
  })
})
