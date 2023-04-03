const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {

  if (err || info || !user) {
 
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }
  let role = user.role_id 
  if (user && role ==1 || role ===3) {
    req.user = user;
    if ( role ==1){
      req.user.isAdmin = true
      
    }else{
      req.user.isAdmin = false
    }
    resolve();
  }else{
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }

    req.user = user;
  resolve();

};

const adminAuth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = adminAuth;
