const httpStatus = require("http-status");
const { userService, donationService } = require("../services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { generateAuthTokens } = require("../utils/tokens");

const adminLogin = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  
  const data = await userService.loginAdmin(username, password);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  const tokens = await generateAuthTokens(data);
  console.log(data);
  res.send({
    user: {
      id: data.id,
      username: data.username,
      name: data.name,
      profile_image: data.profile_image,
      signature:data.signature
    },
    tokens,
  });
});

const userRegister = catchAsync(async (req, res) => {
  // if (req.user.roleDetails.roles.role_name != "Admin") {
  //   res.status(httpStatus.CONFLICT).send({
  //     status: false,
  //     msg: "Only admin access.",
  //   });
  // }
  const userdata = await userService.createuser(req.body, req.files);
    console.log(userdata)
  if (!userdata) {
    res.status(httpStatus.UNAUTHORIZED).send({
      status: false,
      msg: "Something went wrong",
    });
  }
  res.status(httpStatus.CREATED).send(userdata);
});

const allList = catchAsync(async (req, res) => {
  // if (req.user.roleDetails.roles.role_name != "Admin") {
  //   res.status(httpStatus.CONFLICT).send({
  //     status: false,
  //     msg: "Only admin access.",
  //   });
  // }
  const list = await donationService.allList(req);
  res.status(200).send({
    status: true,
    msg: "All List",
    data: list,
  });
});

const delUser = catchAsync(async (req, res) => {
  const user = await userService.delUser(req);
  res.status(200).send({
    status: true,
    msg: "User deleted successfully",
  });
});

const changeuserStatus = catchAsync(async (req,res)=>{
  const status = await userService.changeUserStatus(req)

  res.status(200).send({
   status
  })

})

const editUser = catchAsync(async (req, res) => {
  const data = await userService.editUser(req);

  res.status(200).send({
    status: true,
    msg: "User updated successfully",
  });
});

const addDonationType = catchAsync(async (req, res) => {
  const data = await donationService.addDonationType(req);

  res.status(200).send({
    status: true,
    msg: "Donation Type added successfully",
  });
});



const getDonationType = catchAsync(async (req, res) => {
  const data = await donationService.getDonationType(req);
  res.status(200).send({
    status: true,
    data: data,
  });
});

const DelDonationType = catchAsync(async (req, res) => {
  const data = await donationService.DelDonationType(req);
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete Donation Type");
  }
  res.status(200).send({
    status: true,
    message:"Donation Type Deleted Successfully"
  });
});

const changeDonationType = catchAsync(async (req, res) => {
  const data = await donationService.changeDonationType(req);
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Change Donation Type");
  }
  res.status(200).send({
    data
  });
});

const EditDonationType = catchAsync(async (req, res) => {
  const data = await donationService.EditDonationType(req);
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update Donation Type");
  }
  res.status(200).send({
    status: true,
    message: "Donation type updated Successfully",
  });
});

const addEmployees = catchAsync(async (req, res) => {
  const data = await userService.addEmployees(req);
  if(!data){
   return res.status(httpStatus.UNAUTHORIZED).send({
      status: false,
      msg: "Failed to add employees.",
  })
}
  res.status(200).send({
    status: data.status,
    message:data.message
  });
});

const EmployeeLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  
  const data = await userService.loginEmployee(email, password);
  console.log(data)
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  const tokens = await generateAuthTokens(data);
  console.log(data);
  res.send({
    user: {
      id: data.id,
      username: data.Username,
      Mobile: data.Mobile,
      Role: data.Role,
      Rid: data.Rid,
      signature:data.signature

    },
    tokens,
  });
});


const getuserBynum = catchAsync(async (req, res) => {
const user = await userService.getuserBynum(req)
if(!user){
  throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
}

res.status(200).send({
  status: true,
  message:"Success",
  data:user
});

})




module.exports = {
  adminLogin,
  userRegister,
  allList,
  delUser,
  addDonationType,
  getDonationType,
  editUser,
  addEmployees,
  DelDonationType,
  EditDonationType,
  EmployeeLogin,
  changeDonationType,
  changeuserStatus,
  getuserBynum
};
