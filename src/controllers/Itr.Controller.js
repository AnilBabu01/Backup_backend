const httpStatus = require('http-status');
const { userService, ItrService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const { generateAuthTokens } = require('../utils/tokens');

const itr_register = catchAsync(async (req, res) => {
    const userdata = await ItrService.itr_register(req.params,req.files,req.body);
    res.status(httpStatus.CREATED).send(userdata);  
});




module.exports = {
    itr_register

};
