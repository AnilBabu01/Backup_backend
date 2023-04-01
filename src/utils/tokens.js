const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');

/**
 * Generate token
 * @param {int} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId,role ,expires,secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    role:role,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {

  let role = user.role_id
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes')
  const accessToken = generateToken(user.id,role, accessTokenExpires);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate().toISOString(),
    },
  };
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
