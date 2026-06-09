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

  const body = await readBody(event)
  return prisma.tenant.update({
    where: { id },
    data: {
      name: body.name ?? tenant.name,
      email: body.email ?? tenant.email,
      phone: body.phone ?? tenant.phone,
      isActive: body.isActive ?? tenant.isActive,
      leaseStart: body.leaseStart !== undefined ? new Date(body.leaseStart) : tenant.leaseStart,
      leaseEnd: body.leaseEnd !== undefined ? new Date(body.leaseEnd) : tenant.leaseEnd,
    }
  })
})
