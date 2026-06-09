import { prisma, getUserFromEvent } from '../../utils/auth'
import { sendRentReminder } from '../../utils/email'

// This endpoint triggers reminder checks.
// In production, you'd call this via a cron job (e.g., Vercel Cron, GitHub Actions).
export default defineEventHandler(async (event) => {
  // Optional auth — can also be called by cron with an API key
  const authHeader = getHeader(event, 'Authorization')
  const cronKey = getHeader(event, 'X-Cron-Key') || getQuery(event).cron_key

  const config = useRuntimeConfig()
  const expectedCronKey = process.env.CRON_API_KEY || 'cron-secret-key'

  let isAuthorized = false

  if (authHeader?.startsWith('Bearer ')) {
    const user = await getUserFromEvent(event)
    isAuthorized = !!user
  }

  if (cronKey === expectedCronKey) {
    isAuthorized = true
  }

  if (!isAuthorized) {
    throw createError({ statusCode: 401, message: 'Not authorized' })
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const results = { upcoming: 0, overdue: 0, errors: 0 }

  // Get all unpaid payments (pending, late, overdue)
  const unpaidPayments = await prisma.payment.findMany({
    where: {
      status: { in: ['pending', 'late', 'overdue'] },
    },
    include: {
      unit: {
        include: {
          property: {
            include: {
              user: {
                include: { settings: true }
              }
            }
          }
        }
      },
      tenant: true,
    },
  })

  for (const payment of unpaidPayments) {
    const settings = payment.unit.property.user.settings
    if (!settings || !settings.reminderEnabled) continue

    const dueDate = new Date(payment.dueDate)
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    const shouldRemindBefore = daysDiff > 0 && daysDiff <= settings.reminderDaysBefore
    const shouldRemindAfter = daysDiff < 0 && Math.abs(daysDiff) <= settings.reminderDaysAfter

    if (!shouldRemindBefore && !shouldRemindAfter) continue

    const tenant = payment.tenant
    if (!tenant?.email) continue

    const type = daysDiff < 0 ? 'overdue' : 'upcoming'

    // Check if we already sent a reminder for this payment in the last 24 hours
    const recentReminder = await prisma.reminderLog.findFirst({
      where: {
        paymentId: payment.id,
        type: 'email',
        sentAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      }
    })

    if (recentReminder) continue // Already reminded today

    const result = await sendRentReminder({
      to: tenant.email,
      tenantName: tenant.name,
      unitName: payment.unit.name,
      amount: payment.amount,
      dueDate: dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      daysUntilDue: daysDiff,
      type,
    })

    // Log the reminder
    await prisma.reminderLog.create({
      data: {
        paymentId: payment.id,
        type: 'email',
        status: result.success ? 'sent' : 'failed',
        error: result.success ? null : (result as any).error,
      }
    })

    if (result.success) {
      if (type === 'upcoming') results.upcoming++
      else results.overdue++
    } else {
      results.errors++
    }
  }

  // Auto-mark overdue payments
  for (const payment of unpaidPayments) {
    const settings = payment.unit.property.user.settings
    if (!settings || !settings.autoLateMark) continue

    const dueDate = new Date(payment.dueDate)
    const daysPastDue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysPastDue >= settings.lateAfterDays && payment.status === 'pending') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: daysPastDue > 30 ? 'overdue' : 'late' },
      })
    }
  }

  return {
    message: `Sent ${results.upcoming} upcoming and ${results.overdue} overdue reminders. ${results.errors} errors.`,
    ...results,
  }
})
