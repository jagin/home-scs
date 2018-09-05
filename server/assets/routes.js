const Handlers = require('./handlers')

module.exports = [
  { method: 'GET', path: '/home/assets/{param*}', config: Handlers.public }
]
