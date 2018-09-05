const Handlers = require('./handlers')

module.exports = [
  { method: 'GET', path: '/home/{lang}', config: Handlers.index },
  { method: 'GET', path: '/home/{lang}/partials/navigation', config: Handlers.partials.navigation },
  { method: 'GET', path: '/home/{lang}/partials/menu', config: Handlers.partials.menu },
  { method: 'GET', path: '/home/{lang}/partials/footer', config: Handlers.partials.footer }
]
