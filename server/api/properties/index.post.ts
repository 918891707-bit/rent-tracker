import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const body = await readBody(event)
  if (!body.name) throw createError({ statusCode: 400, message: 'Property name is required' })

  return prisma.property.create({
    data: {
      userId: user.id,
      name: body.name,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      notes: body.notes,
    }
  })
})
