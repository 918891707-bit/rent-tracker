import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const id = getRouterParam(event, 'id')!
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: { unit: { include: { property: { select: { userId: true } } } } }
  })
  if (!tenant || tenant.unit.property.userId !== user.id) {
    throw createError({ statusCode: 404, message: 'Tenant not found' })
  }

  await prisma.tenant.delete({ where: { id } })
  return { success: true }
})
