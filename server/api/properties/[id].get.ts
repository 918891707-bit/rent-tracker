import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const id = getRouterParam(event, 'id')!
  const property = await prisma.property.findFirst({
    where: { id, userId: user.id },
    include: {
      units: {
        include: {
          tenants: true,
          payments: { orderBy: { dueDate: 'desc' }, take: 12 },
        }
      }
    }
  })
  if (!property) throw createError({ statusCode: 404, message: 'Property not found' })
  return property
})
