import { prisma, createToken, verifyPassword } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  if (!verifyPassword(password, user.passwordHash)) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  const token = createToken(user.id, user.email)
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }
  }
})
