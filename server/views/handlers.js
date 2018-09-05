const Joi = require('joi')

module.exports.index = {
  handler: function (request, h) {
    return h.view('index')
  }
}

module.exports.partials = {
  navigation: {
    handler: async function (request, h) {
      const scs = request.query.scs

      return h.view('partials/navigation', { scs }, { layout: false })
    },
    validate: {
      query: {
        scs: Joi.string().required().valid(['home', 'items', 'account'])
      }
    }
  },

  menu: {
    handler: async function (request, h) {
      const config = request.server.settings.app
      const scs = request.query.scs

      return h.view('partials/menu', { scs, active: scs === config.scs }, { layout: false })
    },
    validate: {
      query: {
        scs: Joi.string().required().valid(['home', 'items', 'account'])
      }
    }
  },

  footer: {
    handler: async function (request, h) {
      return h.view('partials/footer', {}, { layout: false })
    }
  }
}
