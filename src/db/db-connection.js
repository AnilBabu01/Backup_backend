const { Sequelize } = require('sequelize');
const config = require('../config/config');
const logger = require('../config/logger');

const sequelize = new Sequelize(config.oracle.database, config.oracle.user, config.oracle.password, {
  host: config.oracle.host,
  dialect: 'mysql',
  logging:false,
  sync:true,
  pool: { max: 5, min: 0, idle: 10000 }
})

sequelize.authenticate({
  alter: true,
  force: false,
}).then(() => {
  logger.log('info', 'connected')
}).catch((err) => {
  logger.error('error', err);
})


module.exports = sequelize






