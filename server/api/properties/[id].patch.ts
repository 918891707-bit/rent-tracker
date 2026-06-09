import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const id = getRouterParam(event, 'id')!
  const existing = await prisma.property.findFirst({ where: { id, userId: user.id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Property not found' })

  const body = await readBody(event)
  return prisma.property.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      address: body.address ?? existing.address,
      city: body.city ?? existing.city,
      state: body.state ?? existing.state,
      zipCode: body.zipCode ?? existing.zipCode,
      notes: body.notes ?? existing.notes,
    }
  })
})
