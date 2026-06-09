import { prisma, getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const id = getRouterParam(event, 'id')!
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { unit: { include: { property: { select: { userId: true } } } } }
  })
  if (!payment || payment.unit.property.userId !== user.id) {
    throw createError({ statusCode: 404, message: 'Payment not found' })
  }

  const body = await readBody(event)
  return prisma.payment.update({
    where: { id },
    data: {
      amount: body.amount ?? payment.amount,
      dueDate: body.dueDate ? new Date(body.dueDate) : payment.dueDate,
      paidDate: body.paidDate !== undefined ? (body.paidDate ? new Date(body.paidDate) : null) : payment.paidDate,
      status: body.status ?? payment.status,
      method: body.method ?? payment.method,
      notes: body.notes ?? payment.notes,
    }
  })
})
