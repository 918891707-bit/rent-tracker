import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const id = getRouterParam(event, 'id')!

  // Verify ownership through property
  const unit = await prisma.unit.findUnique({
    where: { id },
    include: { property: { select: { userId: true } } }
  })
  if (!unit || unit.property.userId !== user.id) {
    throw createError({ statusCode: 404, message: 'Unit not found' })
  }

  const body = await readBody(event)
  return prisma.unit.update({
    where: { id },
    data: {
      name: body.name ?? unit.name,
      rentAmount: body.rentAmount ?? unit.rentAmount,
    }
  })
})
