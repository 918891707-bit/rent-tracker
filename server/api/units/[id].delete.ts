import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const id = getRouterParam(event, 'id')!
  const unit = await prisma.unit.findUnique({
    where: { id },
    include: { property: { select: { userId: true } } }
  })
  if (!unit || unit.property.userId !== user.id) {
    throw createError({ statusCode: 404, message: 'Unit not found' })
  }

  await prisma.unit.delete({ where: { id } })
  return { success: true }
})
