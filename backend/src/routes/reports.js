const { getSummary } = require('../controllers/reportController')
const { authenticate } = require('../middlewares/auth')

async function reportRoutes(fastify) {
  fastify.get('/reports/summary', {
    preHandler: authenticate,
    schema: {
      tags: ['Reports'],
      summary: 'Resumo de tarefas por status, prioridade e categoria',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Resumo geral do sistema',
          type: 'object',
          properties: {
            total: { type: 'integer' },
            overdue: { type: 'integer' },
            byStatus: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  count: { type: 'integer' },
                },
              },
            },
            byPriority: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  priority: { type: 'string' },
                  count: { type: 'integer' },
                },
              },
            },
            byCategory: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  categoryId: { type: 'string' },
                  count: { type: 'integer' },
                },
              },
            },
          },
        },
      },
    },
  }, getSummary)
}

module.exports = reportRoutes
