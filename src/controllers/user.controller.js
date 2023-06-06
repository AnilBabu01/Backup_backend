const httpStatus = require("http-status");
const { userService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { generateAuthTokens } = require("../utils/tokens");
const { isEmailValid } = require("../utils/checkEmail");
const ApiError = require("../utils/ApiError");
const crypto = require("crypto");
const UserCollaction = require("../collections/User.Collaction");
const {sendSms} = require("../utils/Sendsms");

const createUser = catchAsync(async (req, res) => {
  const userdata = await userService.createuser(req.body);
  res.status(httpStatus.CREATED).send(userdata);
});

const login = catchAsync(async (req, res) => {
  const { identity, password } = req.body;

  console.log(req.body);
  const data = await userService.loginuser(identity, password);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  const tokens = await generateAuthTokens(data);
  res.send({
    status: true,
    user: {
      id: data.id,
      username: data.username,
      name: data.name,
      roles: data.roles,
      profile_image: data.profile_image,
      signature: data.signature,
    },
    tokens,
  });
});

const getSign = catchAsync(async (req, res) => {
  const data = await userService.getSign(req);
  console.log(data, "SIG");
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!something Went Wrong");
  }

  res.send({
    status: true,
    data,
  });
});

const loginWithMobile = catchAsync(async (req, res) => {
  const login = await userService.mobileLogin(req.body);
  if (!login) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: 1,
    msg: "OTP successfully send to your mobile number.",
  });
});

const adminSignatureUpload = catchAsync(async (req, res) => {
  const upload = await userService.adminSignatureUpload(req);
  if (!upload) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Signature Uploaded Successfully",
  });
});

const employeeSignatureUpload = catchAsync(async (req, res) => {
  const upload = await userService.employeeSignatureUpload(req);
  if (!upload) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Signature Uploaded Successfully",
  });
});

const UseruploadSignature = catchAsync(async (req, res) => {
  const upload = await userService.UseruploadSignature(req);
  if (!upload) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Signature Uploaded Successfully",
  });
});

const ChangeemployeePass = catchAsync(async (req, res) => {
  const upload = await userService.ChangeemployeePass(req);
  if (!upload) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    upload,
  });
});

const ChangeadminPass = catchAsync(async (req, res) => {
  const upload = await userService.ChangeadminPass(req);
  if (!upload) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    upload,
  });
});

const loginWithEmail = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  let data = await userService.loginuser(email, password);
  console.log(data);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  const tokens = await generateAuthTokens(data);
  res.status(200).send({
    user: {
      id: data.id,
      username: data.username,
      name: data.name,
      email: data.email,
      gender: data.gender,
      role: data.role_name,
      role_id: data.role_id,
    },
    tokens,
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { username, otp } = req.body;

  const data = await userService.verifyOTP(username, otp);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  const tokens = await generateAuthTokens(data);
  res.status(200).send({
    user: {
      id: data.id,
      username: data.username,
      name: data.name,
      email: data.email,
      gender: data.gender,
      role: data.role_name,
      role_id: data.role_id,
    },
    tokens,
  });
});

const verifyForgotOtp = catchAsync(async (req, res) => {
  const { username, otp } = req.body;
  console.log(otp);
  const data = await userService.verifyOTP(username, otp);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }

  let resetPasswordToken = crypto.randomBytes(20).toString("hex");
  const update = await UserCollaction.generateResetTokenNew(
    resetPasswordToken,
    data.id
  );

  res.status(200).send({
    status: true,
    message: "Successfully Verified Otp",
    token: update,
  });
});

const changePassForgot = catchAsync(async (req, res) => {
  const data = await userService.changePassForgot(req);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }

  res.status(data.statusCode).send({
    status: data.status,
    message: data.message,
  });

  res.status(data.statusCode).send({
    status: data.status,
    message: data.message,
  });
});

const sendDonationsms = catchAsync(async (req, res) => {
  const { mobile, amount, url, type, itemName, weight, rno } = req.body;
  const data = await sendSms(mobile, amount, url, type, itemName, weight, rno);
  if (!data?.status){
    return res.status(400).send(data)
  }
  return res.status(200).send({
    status: true,
    message: "Successfully send Sms",
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await userService.forgotPass(req);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Something went wrong!");
  }
  res.status(200).send({
    status: true,
    msg: "Password reset successfully.",
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const update = await userService.profileUpdate(req,res);
  if (!update) {
    throw new ApiError(httpStatus.NOT_FOUND, "Something wrong!");
  }
  res.status(200).send({
    status: true,
    msg: "Profile Update Successfully.",
  });
});

const profileList = catchAsync(async (req, res) => {
  const list = await userService.profileList(req);
  if (!list) {
    throw new ApiError(httpStatus.NOT_FOUND, "Something wrong!");
  }
  res.status(200).send({
    status: true,
    msg: "Profile List.",
    profile: list,
  });
});

const createAccount = catchAsync(async (req, res) => {
  const create = await userService.createAccount(req);
  if (create?.status === 0) {
    res.status(401).send({
      status: create.status,
      message: create.error,
    });
  }

  res.status(200).send({
    status: true,
    msg: "Account created successfully.",
  });
});

const getUsers = catchAsync(async (req, res) => {
  const create = await userService.getUsers(req);
  console.log(create);
  if (create?.status === 0) {
    res.status(401).send({
      status: create.status,
      message: create.error,
    });
  }
  res.status(200).send({
    status: true,
    data: create,
  });
});

const getEmployees = catchAsync(async (req, res) => {
  const employees = await userService.getEmployees(req);
  if (!employees) {
    throw new ApiError(httpStatus.NOT_FOUND, "Something wrong!");
  }
  res.status(200).send({
    status: true,
    data: employees,
  });
});

const delEmployees = catchAsync(async (req, res) => {
  const employees = await userService.delEmployees(req);
  if (!employees) {
    throw new ApiError(httpStatus.NOT_FOUND, "Something wrong!");
  }
  res.status(200).send({
    status: true,
    message: "User Deleted Successfully",
  });
});

const editEmployee = catchAsync(async (req, res) => {
  const employees = await userService.editEmployee(req);
  if (!employees) {
    throw new ApiError(httpStatus.NOT_FOUND, "Something wrong!");
  }
  res.status(200).send({
    status: true,
    message: "User updated Successfully",
  });
});

const forgotPasswordReqOtp = catchAsync(async (req, res) => {
  const data = await userService.forgotPasswordReqOtp(req);
  console.log(data);
  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: data.status,
    message: data.message,
  });
});

const employeeProfile = catchAsync(async (req, res) => {
  const data = await userService.employeeProfile(req);
  console.log(data);
  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }
  res.status(200).send({
    data,
  });
});

const adminProfile = catchAsync(async (req, res) => {
  const data = await userService.adminProfile(req);
  console.log(data);
  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }
  res.status(200).send({
    data,
  });
});

const getemployeeProfile = catchAsync(async (req, res) => {
  const data = await userService.getemployeeProfile(req);
  console.log(data);
  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }
  res.status(200).send({
    data,
  });
});

const getadminProfile = catchAsync(async (req, res) => {
  const data = await userService.getadminProfile(req);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }
  res.status(200).send({
    data,
  });
});

module.exports = {
  createUser,
  getemployeeProfile,
  getadminProfile,
  adminProfile,
  employeeProfile,
  login,
  loginWithMobile,
  ChangeadminPass,
  ChangeemployeePass,
  loginWithEmail,
  verifyOTP,
  employeeSignatureUpload,
  forgotPassword,
  updateProfile,
  getSign,
  profileList,
  createAccount,
  getUsers,
  getEmployees,
  delEmployees,
  forgotPasswordReqOtp,
  verifyForgotOtp,
  editEmployee,
  changePassForgot,
  sendDonationsms,
  adminSignatureUpload,
  UseruploadSignature,
};
