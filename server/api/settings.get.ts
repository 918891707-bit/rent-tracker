import { prisma, getUserFromEvent } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  let settings = await prisma.settings.findUnique({ where: { userId: user.id } })
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        userId: user.id,
        reminderEnabled: true,
        reminderDaysBefore: 3,
        reminderDaysAfter: 5,
      }
    })
  }
  return settings
})
