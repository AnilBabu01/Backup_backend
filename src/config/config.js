const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    ORACLE_URL: Joi.string().required().description('SQL host'),
    ORACLE_DATABASE: Joi.string().required().description('SQL DATABASE'),
    ORACLE_USER: Joi.string().required().description('SQL Username'),
    //ORACLE_PASSWORD: Joi.string().required().description('SQL Password'),
    ORACLE_URL_PROD: Joi.string().required().description('SQL Production host'),
    ORACLE_USER_PROD: Joi.string().required().description('SQL Production Username'),
    ORACLE_PASSWORD_PROD: Joi.string().required().description('SQL Production Password'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    // SMTP_HOST: Joi.string().description('server that will send the emails'),
    // SMTP_PORT: Joi.number().description('port to connect to the email server'),
    // SMTP_USERNAME: Joi.string().description('username for email server'),
    // SMTP_PASSWORD: Joi.string().description('password for email server'),
    // EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    // CLIENT_NAME: Joi.string().description('the client of the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  oracle: {
    host: envVars.ORACLE_URL,
    database: envVars.ORACLE_DATABASE,
    user: envVars.ORACLE_USER,
    password: envVars.ORACLE_PASSWORD,
  },
  oracleprod: {
    host: envVars.ORACLE_URL_PROD,
    user: envVars.ORACLE_USER_PROD,
    password: envVars.ORACLE_PASSWORD_PROD,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 60,
  },
  // email: {
  //   smtp: {
  //     host: envVars.SMTP_HOST,
  //     port: envVars.SMTP_PORT,
  //     auth: {
  //       user: envVars.SMTP_USERNAME,
  //       pass: envVars.SMTP_PASSWORD,
  //     },
  //   },
  //   from: envVars.EMAIL_FROM,
  //   clientName: envVars.CLIENT_NAME,
  // },
};
