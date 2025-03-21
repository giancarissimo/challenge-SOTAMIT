import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars {
  APP_PORT: number,
  FRONTEND_URL: string,
  MONGO_URI: string,
  JWT_SECRET: string,
  JWT_EXPIRES_IN: string
}

const envSchema = joi.object({
  APP_PORT: joi.number().required(),
  FRONTEND_URL: joi.string().required(),
  MONGO_URI: joi.string().required(),
  JWT_SECRET: joi.string().required(),
  JWT_EXPIRES_IN: joi.string().required()
})
  .unknown(true)

const { error, value } = envSchema.validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value

export const envs = {
  app_port: envVars.APP_PORT,
  frontend_url: envVars.FRONTEND_URL,
  mongo_uri: envVars.MONGO_URI,
  jwt_secret: envVars.JWT_SECRET,
  jwt_expires_in: envVars.JWT_EXPIRES_IN,
}
