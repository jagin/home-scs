const Handlers = require('./handlers')

module.exports = [
  { method: 'GET', path: '/home/health-check', config: Handlers.healthCheck }
]
