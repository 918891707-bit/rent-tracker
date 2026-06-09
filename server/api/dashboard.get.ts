import { prisma, getUserFromEvent } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const now = new Date()

  // Get all properties with units and recent payments
  const properties = await prisma.property.findMany({
    where: { userId: user.id },
    include: {
      units: {
        include: {
          tenants: { where: { isActive: true } },
          payments: {
            orderBy: { dueDate: 'desc' },
            take: 6,
          }
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  const allPayments = properties.flatMap(p =>
    p.units.flatMap(u => u.payments)
  )

  // Calculate key metrics
  const totalUnits = properties.reduce((sum, p) => sum + p.units.length, 0)
  const occupiedUnits = properties.reduce((sum, p) =>
    sum + p.units.filter(u => u.tenants.length > 0).length, 0
  )

  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const thisMonthPayments = allPayments.filter(p => {
    const d = new Date(p.dueDate)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const totalExpectedRent = properties.reduce((sum, p) =>
    sum + p.units.reduce((s, u) => s + (u.rentAmount || 0), 0), 0
  )

  const collectedThisMonth = thisMonthPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingThisMonth = thisMonthPayments
    .filter(p => p.status === 'pending' || p.status === 'late' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0)

  // Upcoming due dates (next 7 days)
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const dueThisWeek = allPayments.filter(p => {
    const d = new Date(p.dueDate)
    return d <= nextWeek && d >= now && p.status !== 'paid'
  })

  // Overdue payments
  const overduePayments = allPayments.filter(p => {
    return new Date(p.dueDate) < now && (p.status === 'pending' || p.status === 'late' || p.status === 'overdue')
  })

  return {
    properties: properties.length,
    totalUnits,
    occupiedUnits,
    vacancyRate: totalUnits > 0 ? Math.round(((totalUnits - occupiedUnits) / totalUnits) * 100) : 0,
    totalExpectedRent,
    collectedThisMonth,
    pendingThisMonth,
    collectionRate: totalExpectedRent > 0 ? Math.round((collectedThisMonth / totalExpectedRent) * 100) : 0,
    dueThisWeek: dueThisWeek.length,
    overduePayments: overduePayments.length,
    overdueAmount: overduePayments.reduce((sum, p) => sum + p.amount, 0),
    recentPayments: allPayments
      .filter(p => p.status === 'paid')
      .sort((a, b) => new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime())
      .slice(0, 5),
    upcomingDue: dueThisWeek.slice(0, 5),
  }
})
