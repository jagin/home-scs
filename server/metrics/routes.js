const Handlers = require('./handlers')

module.exports = [
  { method: 'GET', path: '/home/metrics', config: Handlers.metrics }
]
