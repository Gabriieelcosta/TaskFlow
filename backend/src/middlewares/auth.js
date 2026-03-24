const { UnauthorizedError } = require('../utils/errors')

async function authenticate(request, reply) {
  try {
    await request.jwtVerify()
  } catch {
    throw new UnauthorizedError('Token inválido ou expirado')
  }
}

module.exports = { authenticate }
