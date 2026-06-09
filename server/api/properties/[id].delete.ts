import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const id = getRouterParam(event, 'id')!
  const existing = await prisma.property.findFirst({ where: { id, userId: user.id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Property not found' })

  await prisma.property.delete({ where: { id } })
  return { success: true }
})
