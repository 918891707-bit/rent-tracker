import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const body = await readBody(event)
  if (!body.unitId || !body.amount || !body.dueDate) {
    throw createError({ statusCode: 400, message: 'Unit ID, amount, and due date are required' })
  }

  // Verify ownership
  const unit = await prisma.unit.findUnique({
    where: { id: body.unitId },
    include: { property: { select: { userId: true } } }
  })
  if (!unit || unit.property.userId !== user.id) {
    throw createError({ statusCode: 404, message: 'Unit not found' })
  }

  return prisma.payment.create({
    data: {
      unitId: body.unitId,
      tenantId: body.tenantId || null,
      amount: body.amount,
      dueDate: new Date(body.dueDate),
      paidDate: body.paidDate ? new Date(body.paidDate) : null,
      status: body.paidDate ? 'paid' : 'pending',
      method: body.method || null,
      notes: body.notes || null,
    }
  })
})
