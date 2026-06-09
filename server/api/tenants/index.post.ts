import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const body = await readBody(event)
  if (!body.unitId || !body.name) {
    throw createError({ statusCode: 400, message: 'Unit ID and tenant name are required' })
  }

  // Verify ownership
  const unit = await prisma.unit.findUnique({
    where: { id: body.unitId },
    include: { property: { select: { userId: true } } }
  })
  if (!unit || unit.property.userId !== user.id) {
    throw createError({ statusCode: 404, message: 'Unit not found' })
  }

  return prisma.tenant.create({
    data: {
      unitId: body.unitId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      leaseStart: body.leaseStart ? new Date(body.leaseStart) : undefined,
      leaseEnd: body.leaseEnd ? new Date(body.leaseEnd) : undefined,
    }
  })
})
