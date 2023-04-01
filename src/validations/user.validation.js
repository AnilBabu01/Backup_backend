const Joi = require('@hapi/joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    mobileNo: Joi.string().required(),
    name: Joi.string().required(),
    gender: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    identity: Joi.string().required(),
    password: Joi.string().required(),
  })
}
const loginMobile = {
  body: Joi.object().keys({
    mobile_no: Joi.string().required()
  }),
};

const loginEmail = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),
};



const forgotPass = {
  body: Joi.object().keys({
    oldpassword:Joi.string().required().custom(password),
    newPassword:Joi.string().required().custom(password)
  })
}

const ReqforgotPass = {
  body: Joi.object().keys({
    email: Joi.string().required()
  })
}

module.exports = {
  login,
  register,
  loginMobile,
  loginEmail,
  forgotPass,
  ReqforgotPass
};
