const userRepository = require('../repositories/userRepository')
const { hashPassword, comparePassword } = require('../utils/hash')
const { AppError, UnauthorizedError } = require('../utils/errors')

async function register(fastify, { name, email, password }) {
  const existingUser = await userRepository.findByEmail(email)
  if (existingUser) {
    throw new AppError('E-mail já cadastrado', 409)
  }

  const hashed = await hashPassword(password)
  const user = await userRepository.create({ name, email, password: hashed })

  const token = fastify.jwt.sign({ id: user.id, email: user.email })

  return { user, token }
}

async function login(fastify, { email, password }) {
  const user = await userRepository.findByEmail(email)
  if (!user) {
    throw new UnauthorizedError('E-mail ou senha inválidos')
  }

  const valid = await comparePassword(password, user.password)
  if (!valid) {
    throw new UnauthorizedError('E-mail ou senha inválidos')
  }

  const token = fastify.jwt.sign({ id: user.id, email: user.email })

  const { password: _, ...userWithoutPassword } = user

  return { user: userWithoutPassword, token }
}

module.exports = { register, login }
