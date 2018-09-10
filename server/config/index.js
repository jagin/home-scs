const Joi = require('joi')
const Package = require('../../package')

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test'])
    .default('development'),
  HOST: Joi.string()
    .default('localhost'),
  PORT: Joi.number()
    .default(8000),
  JWT_KEY: Joi.string()
    .required(),
  JWT_AUDIENCE: Joi.string()
    .required(),
  JWT_ISSUER: Joi.string()
    .required()
}).unknown()
  .required()

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema)

const config = {
  scs: 'home',
  version: Package.version,
  env: envVars.NODE_ENV,
  isDevelopment: envVars.NODE_ENV === 'development',
  isTest: envVars.NODE_ENV === 'test',
  isProduction: envVars.NODE_ENV === 'production',
  jwt: {
    key: envVars.JWT_KEY,
    audience: envVars.JWT_AUDIENCE,
    issuer: envVars.JWT_ISSUER
  }
}

config.manifest = {
  server: {
    app: config,
    host: envVars.HOST,
    port: envVars.PORT,
    router: {
      stripTrailingSlash: true
    }
  },
  register: {
    plugins: [
      { plugin: 'inert' },
      { plugin: 'vision' },
      { plugin: 'hapi-auth-jwt2' },
      {
        plugin: './i18n',
        options: {
          supportedLngs: ['en', 'pl'],
          fallbackLng: config.isProduction ? 'en' : 'dev',
          saveMissing: config.isDevelopment
        }
      },
      {
        plugin: './auth',
        options: {
          jwt: {
            key: config.jwt.key,
            audience: config.jwt.audience,
            issuer: config.jwt.issuer,
            ignoreExpiration: !config.isProduction
          }
        }
      },
      { plugin: './assets' },
      { plugin: './views' },
      {
        plugin: './metrics',
        options: {
          ignorePaths: [
            '/health-check',
            '/metrics',
            '/home/assets'
          ]
        }
      },
      { plugin: './health-check' },
      {
        plugin: 'good',
        options: {
          ops: { interval: 60000 },
          reporters: {
            console: [
              { module: 'good-squeeze', name: 'Squeeze', args: [{ log: '*', request: '*', response: '*', error: '*' }] },
              { module: 'good-console' },
              'stdout'
            ]
          }
        }
      }
    ]
  }
}

if (!config.isProduction) {
  config.manifest.register.plugins.push({
    plugin: 'blipp'
  })
} else {
  config.manifest.server.debug = false
}

config.validate = function () {
  if (error) {
    throw new Error(`Config validation error: ${error.message}`)
  }

  return this
}

module.exports = config
