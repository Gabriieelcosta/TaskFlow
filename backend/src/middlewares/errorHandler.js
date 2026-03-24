const { AppError } = require('../utils/errors')

async function errorHandler(error, request, reply) {
  // Erros que nós lançamos intencionalmente (AppError e subclasses)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
    })
  }

  // Erros de validação do Fastify (body/params inválidos)
  if (error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Validation Error',
      message: error.message,
    })
  }

  // Erros do JWT (@fastify/jwt)
  if (error.statusCode === 401) {
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token inválido ou expirado',
    })
  }

  // Qualquer outro erro inesperado
  request.log.error(error)

  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Ocorreu um erro interno no servidor',
  })
}

module.exports = { errorHandler }
