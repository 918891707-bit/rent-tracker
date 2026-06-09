import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const body = await readBody(event)
  if (!body.propertyId || !body.name) {
    throw createError({ statusCode: 400, message: 'Property ID and unit name are required' })
  }

  // Verify user owns the property
  const property = await prisma.property.findFirst({
    where: { id: body.propertyId, userId: user.id }
  })
  if (!property) throw createError({ statusCode: 404, message: 'Property not found' })

  return prisma.unit.create({
    data: {
      propertyId: body.propertyId,
      name: body.name,
      rentAmount: body.rentAmount || 0,
    }
  })
})
