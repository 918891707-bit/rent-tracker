import { prisma, createToken, hashPassword } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, name } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, message: 'Password must be at least 8 characters' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, message: 'An account with this email already exists' })
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashPassword(password),
      name: name || email.split('@')[0],
      settings: {
        create: {
          reminderEnabled: true,
          reminderDaysBefore: 3,
          reminderDaysAfter: 5,
        }
      },
      subscription: {
        create: {
          plan: 'free',
          status: 'active',
        }
      }
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    }
  })

  const token = createToken(user.id, user.email)
  return { user, token }
})
