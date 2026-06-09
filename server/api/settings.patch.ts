import { prisma, getUserFromEvent } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const body = await readBody(event)
  return prisma.settings.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      reminderEnabled: body.reminderEnabled ?? true,
      reminderDaysBefore: body.reminderDaysBefore ?? 3,
      reminderDaysAfter: body.reminderDaysAfter ?? 5,
      autoLateMark: body.autoLateMark ?? true,
      lateAfterDays: body.lateAfterDays ?? 5,
      currency: body.currency ?? 'USD',
      timezone: body.timezone ?? 'America/Chicago',
    },
    update: {
      reminderEnabled: body.reminderEnabled,
      reminderDaysBefore: body.reminderDaysBefore,
      reminderDaysAfter: body.reminderDaysAfter,
      autoLateMark: body.autoLateMark,
      lateAfterDays: body.lateAfterDays,
      currency: body.currency,
      timezone: body.timezone,
    }
  })
})
