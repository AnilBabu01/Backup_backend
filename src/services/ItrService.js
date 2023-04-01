const httpStatus = require('http-status');
const ItrCollaction = require('../collections/Itr.Collaction');
const ApiError = require('../utils/ApiError');




const itr_register = async (params,file,body) => {
  const user = await ItrCollaction.itr_register(params,file,body);  
  if (!user) {
    throw new ApiError(httpStatus['400_MESSAGE']);
  }
  return user;
};





  module.exports = {
    itr_register
  
  }


