// Mapa de clientes conectados: userId → response
const clients = new Map()

function addClient(userId, reply) {
  clients.set(userId, reply)
}

function removeClient(userId) {
  clients.delete(userId)
}

function sendToUser(userId, event, data) {
  const reply = clients.get(userId)
  if (reply) {
    reply.raw.write(`event: ${event}\n`)
    reply.raw.write(`data: ${JSON.stringify(data)}\n\n`)
  }
}

function broadcast(event, data, excludeUserId = null) {
  clients.forEach((reply, userId) => {
    if (userId !== excludeUserId) {
      reply.raw.write(`event: ${event}\n`)
      reply.raw.write(`data: ${JSON.stringify(data)}\n\n`)
    }
  })
}

function getConnectedCount() {
  return clients.size
}

module.exports = { addClient, removeClient, sendToUser, broadcast, getConnectedCount }
