const httpStatus = require("http-status");
const { UserCollection, AuthCollection } = require("../collections");
const AuthCollaction = require("../collections/Auth.Collaction");
const crypto = require("crypto");
const ApiError = require("../utils/ApiError");
const {
  checkMobile,
  checkEmail,
  checkEmployeeMobile,
  checkEmployeeEmail,
} = require("../collections/User.Collaction");
const sendOtp = require("../utils/SendOtp");
const UserCollaction = require("../collections/User.Collaction");
const { donationController } = require("../controllers");
const { password } = require("../validations/custom.validation");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createuser = async (userBody, file) => {
  const user = await AuthCollaction.getAdminName(userBody.username);
  if (user) {
    return {
      status: false,
      message: "User already exists",
    };
  }
  console.log(user);
  const result = await UserCollection.createuser(userBody, file);

  return result;
};

const getSign = async (req) => {
  const user = await UserCollaction.getSign(req);

  return user;
};

const mobileLogin = async (body) => {
  const checkUser = await AuthCollaction.getUserName(body.mobile_no);

  if (checkUser) {
    // ---------check OTP TIME--------
    const checkOtpLastSend = await AuthCollaction.checkOtpLastSend(
      checkUser.id
    );

    if (!checkOtpLastSend) {
      let otp = Math.floor(100000 + Math.random() * 900000); //-----6 digit random number--------
      sendOtp(body.mobile_no, otp);
      const update_otp = await UserCollection.updateOTP(checkUser.id, otp);

      return update_otp;
    } else {
      let date_ob = new Date();
      var seconds = 60;
      var parsedDate = new Date(Date.parse(checkOtpLastSend.updatedAt));
      var newDate = new Date(parsedDate.getTime() + 1000 * seconds);
      const remaining = date_ob - newDate;
      const checkRemaining = Math.floor((remaining / 1000) % 60);
      if (checkRemaining > 0) {
        //----check remaining time-----
        let otp = Math.floor(100000 + Math.random() * 900000); //-----6 digit random number--------
        const update_otp = await UserCollection.updateOTP(checkUser.id, otp);
        sendOtp(body.mobile_no, otp);
        return update_otp;
      } else {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          `Please wait ${Math.abs(checkRemaining)} seconds.`
        );
      }
    }
  } else {
    const result = await UserCollection.selfRegister(body);

    if (!result) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Something went wrong. Please try again."
      );
    }
    let otp = Math.floor(100000 + Math.random() * 900000); //-----6 digit random number--------
    sendOtp(body.mobile_no, otp);
    const update_otp = await UserCollection.updateOTP(result, otp);
    return update_otp;
  }
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginuser = async (identity, password) => {
  const user = await AuthCollaction.getUserDetails(identity);
  console.log(user);
  if (
    !user ||
    !(await AuthCollaction.isPasswordMatch(password, user.password))
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Incorrect username or password"
    );
  }
  return user;
};

const loginAdmin = async (username, password) => {
  const user = await AuthCollaction.getAdminName(username);
  console.log(user);
  if (
    !user ||
    !(await AuthCollaction.isPasswordMatch(password, user.password))
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Incorrect username or password"
    );
  }
  return user;
};

const verifyOTP = async (username, otp) => {
  console.log(username, otp, "userdata");
  const isOTPMatch = await AuthCollaction.isOTPMatch(username, otp);

  console.log(isOTPMatch, "otpmatch");
  if (!isOTPMatch) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, "OTP mismatch.");
  }
  const user = await AuthCollaction.getUserDetails(username);
  console.log(user, "iser");
  return user;
};

const forgotPass = async (req) => {
  const data = await AuthCollaction.forgotPass(req);
  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Failed to Forgot Password");
  }

  return data;
};

const profileUpdate = async (req,res) => {
  const update = await UserCollection.updateProfile(req,res);
  return update;
};

const changePassForgot = async (req) => {
  const update = await AuthCollaction.changePassForgot(req);
  console.log(update)
  return update;
};
const profileList = async (req) => {
  const list = await UserCollection.profileList(req);
  if (!list) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Record not found.");
  }
  return list;
};

const createAccount = async (req) => {
  //-----check mobile exist or not ------
  const mobile = await UserCollection.checkMobile(req.body.mobileno);

  if (mobile.length > 0) {
    return {
      status: 0,
      error: "Mobile number already exist.",
    };
  }
  const email = await UserCollection.checkEmail(req.body.email);
  if (email.length > 0) {
    return {
      status: 0,
      error: "Email already exist",
    };
  }
  //-----check email exist or not ------
  const create = await UserCollection.createAccount(req);
  console.log(create);
  return create;
};

const getUsers = async (req) => {
  const users = await UserCollection.getUsers(req);
  return users;
};

const delUser = async (req) => {
  const users = await UserCollection.delUser(req);
  return users;
};

const changeUserStatus = async (req) => {
  const users = await UserCollection.changeUserStatus(req);
  return users;
};

const adminSignatureUpload = async (req) => {
  const users = await UserCollection.adminSignatureUpload(req);
  return users;
};

const employeeSignatureUpload = async (req) => {
  const users = await UserCollection.employeeSignatureUpload(req);
  return users;
};

const editUser = async (req) => {
  const users = await UserCollection.editUser(req);
  return users;
};

const addEmployees = async (req) => {
  const mobile = await checkEmployeeMobile(req.body.Mobile);
  const email = await checkEmployeeEmail(req.body.Email);
  if (mobile.length > 0) {
    return {
      status: false,
      message: "Mobile number already exist.",
    };
  }

  if (email.length > 0) {
    return {
      status: false,
      message: "Email already exist.",
    };
  }
  try {
    const employees = await UserCollection.addEmployees(req);
    if (employees) {
      return {
        status: true,
        message: "User Added Successfully",
      };
    }
  } catch (e) {
    return {
      status: false,
      message: "Failed to add employee",
    };
  }
};

const getEmployees = async (req) => {
  const employees = await UserCollection.getEmployees(req);
  return employees;
};

const delEmployees = async (req) => {
  const employees = await UserCollection.delEmployees(req);
  return employees;
};

const editEmployee = async (req) => {
  const employees = await UserCollection.editEmployee(req);
  return employees;
};

const adminProfile = async (req) => {
  const employees = await UserCollection.adminProfile(req);
  return employees;
};

const employeeProfile = async (req) => {
  const employees = await UserCollection.employeeProfile(req);
  return employees;
};

const getadminProfile = async (req) => {
  const employees = await UserCollection.getadminProfile(req);
  return employees;
};

const ChangeemployeePass = async (req) => {
  let user = await AuthCollaction.getEmployee(req.user.id);

  let passCheck = await AuthCollection.isPasswordMatch(
    req.body?.oldpassword,
    user.Password
  );
console.log(passCheck)
  if (!passCheck) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is not matching");
  }
  const employees = await UserCollection.ChangeemployeePassword(req);
  return employees;
};

const ChangeadminPass = async (req) => {
  let user = await AuthCollaction.getAdminName(req.user.id);

  let passCheck = await AuthCollection.isPasswordMatch(
    req.body?.oldpassword,
    user.password
  );
console.log(passCheck)
  if (!passCheck) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is not matching");
  }
  const employees = await UserCollection.ChangeadminPassword(req);
  return employees;
};

const getemployeeProfile = async (req) => {
  const employees = await UserCollection.getemployeeProfile(req);
  return employees;
};

const forgotPasswordReqOtp = async (req) => {
  const data = await AuthCollaction.forgotPasswordReqOtp(req);
  return data;
};

const loginEmployee = async (email, password) => {
  const user = await AuthCollaction.getEmployee(email);

  console.log(user, "user");
  if (
    !user ||
    !(await AuthCollaction.isPasswordMatch(password, user.Password))
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Incorrect username or password"
    );
  }
  return user;
};

module.exports = {
  createuser,
  loginuser,
  verifyOTP,
  loginAdmin,
  forgotPass,
  ChangeadminPass,
  ChangeemployeePass,
  mobileLogin,
  profileUpdate,
  profileList,
  changePassForgot,
  createAccount,
  getUsers,
  employeeProfile,
  adminProfile,
  delUser,
  editUser,
  addEmployees,
  getEmployees,
  delEmployees,
  forgotPasswordReqOtp,
  loginEmployee,
  editEmployee,
  changeUserStatus,
  adminSignatureUpload,
  employeeSignatureUpload,
  getSign,
  getadminProfile,
  getemployeeProfile,
};
