const { Op, QueryTypes } = require("sequelize");
const sequelize = require("../db/db-connection");
const db = require("../models");
const bcrypt = require("bcryptjs");
const uploadimage = require("../middlewares/imageupload");
const removefile = require("../middlewares/removefile");
const TblUser = db.userModel;
const TblOTP = db.otpModel;
const TblUsersRoles = db.usersRolesModel;
const TblPasswordReset = db.passwordReset;
const TblEmployees = db.employees;
const TblAdmin = db.admin;

class UserCollaction {
  updatePassword = async (body) => {
    const { identity, new_password } = body;
    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(new_password, salt);

    const update = await TblUser.update(
      { password: hashencrypt },
      {
        where: {
          roles: "user",
          [Op.or]: [
            { username: identity },
            { email: identity },
            { mobileNo: identity },
          ],
        },
      }
    )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
    return update[0];
  };

  selfRegister = async (body) => {
    let password = "abcd@1029";
    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(password, salt);

    const addNew = await TblUser.create({
      username: body.mobile_no,
      mobileNo: body.mobile_no,
      password: hashencrypt,
      role_id: 2,
    })
      .then((res) => {
        return res.id;
      })
      .catch((err) => {
        console.log(err);
      });

    return addNew;
  };

  createuser = async (body, file) => {
    const { username, mobileNo, name, email, gender, password } = body;
    const { profile_image } = file;
    const imagePath = uploadimage(profile_image);

    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(password, salt);
    try {
      const query = await TblAdmin.create({
        username,
        mobileNo,
        name,
        email,
        gender,
        profile_image: imagePath,
        password: hashencrypt,
        role_id: 1,
      });
      return {
        status: true,
        message: "Admin Registered Successfully",
      };
    } catch (err) {
      console.log(err);
    }
  };

  adminSignatureUpload = async (req) => {
    const { sign } = req?.files;

    const signPath = uploadimage(sign);

    let data = await TblAdmin.update(
      {
        signature: signPath,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    if (data[0] === 0) {
      return false;
    }
    return true;
  };

  employeeSignatureUpload = async (req) => {
    const { sign } = req?.files;

    const signPath = uploadimage(sign);

    let data = await TblEmployees.update(
      {
        signature: signPath,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    if (data[0] === 0) {
      return false;
    }
    return true;
  };

  updateOTP = async (id, otp) => {
    const check = await TblOTP.findOne({ where: { user_id: id } });
    if (check) {
      //---------update OTP-------
      const result = await TblOTP.update(
        { otp: otp },
        { where: { user_id: id } }
      );
      return result;
    } else {
      //--------insert new data--------
      const result = await TblOTP.create({ user_id: id, otp: otp });
      return result;
    }
  };

  generateResetToken = async (token, id) => {
    let resetPasswordExpires = Date.now() + 3600000; //expires in an hour
    let data = await TblPasswordReset.update(
      {
        resetPasswordOtp: null,
        resetPasswordToken: token,
        resetPasswordExpires: resetPasswordExpires,
      },
      { where: { user_id: id } }
    ).catch((Err) => {
      console.log(Err);
    });

    console.log(data);
    return token;
  };

  generateResetTokenNew = async (token, id) => {
    let resetPasswordExpires = Date.now() + 3600000; //expires in an hour
    let data = await TblPasswordReset.create({
      user_id: id,
      resetPasswordOtp: null,
      resetPasswordToken: token,
      resetPasswordExpires: resetPasswordExpires,
    }).catch((Err) => {
      console.log(Err);
    });

    console.log(data);
    return token;
  };

  resetPassword = async (body, id) => {
    const { identity, new_password, token } = body;
    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(new_password, salt);
    await TblUser.update({ password: hashencrypt }, { where: { id: id } });
    await TblPasswordReset.update(
      { resetPasswordToken: null, resetPasswordExpires: null },
      { where: { user_id: id } }
    );
    return true;
  };

  updateProfile = async (req) => {
    const { name, email, dob, anniversary_date, address } = req.body;

    const salt = bcrypt.genSaltSync(12);

    const userId = req.user.id;
    const user = await TblUser.findByPk(userId);

    //------check old pick and remove----
    // ----********--------------------
    const { profile_image = "" } = req.files || "";

    const { sign = ""} = req?.files || ""

    let signature;
    let imagePath;

    if (sign) {
      signature = uploadimage(sign);
    } else {
      let uSign = await TblUser.findOne({
        where: userId,
      });
      signature = uSign.signature || "";
    }

    if (profile_image) {
      imagePath = uploadimage(profile_image);
    } else {
      let uProfile = await TblUser.findOne({
        id: userId,
      });
      imagePath = uProfile.profile_image || "";
    }



    user.name = name;
    user.email = email;
    user.dob = dob;
    user.anniversary_date = anniversary_date;
    user.address = address;
    user.profile_image = imagePath;
    user.signature = signature;

    let data = await user.save().catch((err) => {
      console.log(err);
    });
    console.log(data, "data");
    if (data[0] === 0) {
      return false;
    }
    return true;
  };

  profileList = async (req) => {
    const userId = req.user.id;
    const user = await TblUser.findOne({
      where: { id: userId },
      attributes: [
        "id",
        "username",
        "mobileNo",
        "email",
        "name",
        "dob",
        "anniversary_date",
        "address",
        "gender",
        "profile_image",
        "signature",
      ],
    });
    return user;
  };

  checkMobile = async (mobile) => {
    const query = await sequelize.query(
      `SELECT username,mobileNo,email,address,gender,dob,name FROM tbl_users WHERE mobileNo = '${mobile}' `,
      {
        nest: true,
        type: QueryTypes.SELECT,
      }
    );
    return query;
  };

  checkEmployeeMobile = async (mobile) => {
    const query = await sequelize.query(
      `SELECT * FROM tbl_employees WHERE Mobile = '${mobile}' `,
      {
        nest: true,
        type: QueryTypes.SELECT,
      }
    );
    return query;
  };

  checkEmail = async (email) => {
    console.log(email);
    const query = await sequelize.query(
      `SELECT * FROM tbl_users WHERE Email = '${email}' `,
      {
        nest: true,
        type: QueryTypes.SELECT,
      }
    );
    return query;
  };

  checkEmployeeEmail = async (email) => {
    console.log(email);
    const query = await sequelize.query(
      `SELECT * FROM tbl_employees WHERE email = '${email}' `,
      {
        nest: true,
        type: QueryTypes.SELECT,
      }
    );
    return query;
  };

  createAccount = async (req) => {
    const { fullname, mobileno, email, password } = req.body;

    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(password, salt);

    const query = await TblUser.create({
      username: mobileno,
      mobileNo: mobileno,
      name: fullname,
      email,
      password: hashencrypt,
      role_id: 2,
    });

    if (query) {
      return query;
    }
    return null;
  };

  getUsers = async (req) => {
    let { id, phone, name } = req.query;

    let users;

    if (phone && !name) {
      console.log("enm");
      users = await TblUser.findAll({
        where: {
          mobileNo: { [Op.like]: "%" + phone + "%" },
        },
        attributes: {
          exclude: ["password"],
        },
      });
    } else if (name && !phone) {
      console.log("enm");
      users = await TblUser.findAll({
        where: {
          name: { [Op.like]: "%" + name + "%" },
        },
        attributes: {
          exclude: ["password"],
        },
      });
    } else if (phone && name) {
      users = await TblUser.findAll({
        where: {
          [Op.and]: [
            {
              name: { [Op.like]: "%" + name + "%" },
              mobileNo: { [Op.like]: "%" + phone + "%" },
            },
          ],
        },
        attributes: {
          exclude: ["password"],
        },
      });
    } else if (!id && !phone && !name) {
      users = await TblUser.findAll({
        attributes: {
          exclude: ["password"],
        },
      });
    } else {
      users = await TblUser.findAll({
        where: {
          id: id,
        },
        attributes: {
          exclude: ["password"],
        },
      });
    }

    return users;
  };

  delUser = async (req) => {
    const { id } = req.query;
    const user = await TblUser.destroy({
      where: {
        id: id,
      },
    });
    return user;
  };

  changeUserStatus = async (req) => {
    const { id, status } = req.query;

    let data;
    if (status == "1") {
      const user = await TblUser.update(
        { status: 1 },
        {
          where: {
            id: id,
          },
        }
      ).then((res) => {
        data = {
          status: true,
          message: "Successfully updated user Status",
        };
      });
    } else if (status == "0") {
      const user = await TblUser.update(
        { status: 0 },
        {
          where: {
            id: id,
          },
        }
      ).then((res) => {
        data = {
          status: true,
          message: "Successfully updated user Status",
        };
      });
    }

    return data;
  };

  editUser = async (req) => {
    const { id, name, email, mobile, password } = req.body;
    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(password, salt);
    console.log(req.body);
    const user = await TblUser.update(
      { name: name, email: email, mobileNo: mobile, password: hashencrypt },
      { where: { id: id } }
    );
    console.log(user);
    return user;
  };

  addEmployees = async (req) => {
    const { Username, Mobile, Email, Address, Password, Role, Rid, Status } =
      req.body;

    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(Password, salt);
    const query = await TblEmployees.create({
      Username,
      Mobile,
      Email,
      Address,
      Password: hashencrypt,
      Role,
      role_id: 3,
      Rid,
      Status,
    })
      .then((res) => {
        return {
          status: true,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          status: false,
          data: err,
        };
      });
    console.log(query);
    return query;
  };

  editEmployee = async (req, res) => {
    const { Username, id, Mobile, Email, Address, Role, Rid, Status } =
      req.body;

    const employees = await TblEmployees.update(
      {
        Username: Username,
        Mobile: Mobile,
        Email: Email,
        Address: Address,
        Role: Role,
        Status: Status,
        Rid: Rid,
      },
      {
        where: {
          id: id,
        },
      }
    ).catch((Err) => {
      console.log(Err);
    });
    console.log(employees);
    return employees;
  };

  getEmployees = async (req) => {
    const { id, name, phone } = req.query;
    let data;

    if (name || phone) {
      data = await TblEmployees.findAll({
        where: {
          [Op.or]: {
            Mobile: { [Op.like]: "%" + phone + "%" },
            Username: { [Op.like]: "%" + name + "%" },
          },
        },
        attributes: [
          "id",
          "Username",
          "Mobile",
          "Email",
          "Address",
          "Role",
          "Rid",
          "Status",
          "signature",
        ],
      });
    } else if (id) {
      data = await TblEmployees.findAll({
        where: { id: id },
        attributes: [
          "id",
          "Username",
          "Mobile",
          "Email",
          "Address",
          "Role",
          "Rid",
          "Status",
          "signature",
        ],
      });
    } else {
      data = await TblEmployees.findAll({
        attributes: [
          "id",
          "Username",
          "Mobile",
          "Email",
          "Address",
          "Role",
          "Rid",
          "Status",
          "signature",
        ],
      });
    }

    return data;
  };

  delEmployees = async (req) => {
    const id = req.query.id;

    let user = await TblEmployees.destroy({
      where: {
        id: id,
      },
    });

    return user;
  };

  getSign = async (req) => {
    let userId = req.user.id;

    let data = await TblAdmin.findOne({
      where: {
        id: userId,
      },
      attributes: ["signature", "id", "name"],
    });

    return data;
  };

  adminProfile = async (req) => {
    let result;
    let userId = req.user.id;

    let { profile_image = "" } = req.files || ""
    let upload;
    if (profile_image) {
      upload = uploadimage(profile_image);
    } 
    await TblAdmin.update(
      {
        username: req.body.username,
        mobileNo: req.body.mobileNo,
        email: req.body.email,
        profile_image: upload,
      },
      {
        where: {
          id: userId,
        },
      }
    )
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Profile updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Profile failed to update",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Profile failed to update",
        };
      });

    if (!result) {
      result = {
        status: false,
        message: "Something went wrong updating profile",
      };
    }

    return result;
  };

  employeeProfile = async (req) => {
    let result;
    let userId = req.user.id;
    let upload;
    if (req.files.profile_image) {
      upload = uploadimage(req.files.profile_image);
    } else {
      upload = "";
    }

    await TblEmployees.update(
      {
        profile_image: upload,
      },
      {
        where: {
          id: userId,
        },
      }
    )
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Profile updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Profile failed to update",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Profile failed to update",
        };
      });

    if (!result) {
      result = {
        status: false,
        message: "Something went wrong updating profile",
      };
    }
    return result;
  };

  getadminProfile = async (req) => {
    let id = req.user.id;
    let result = await TblAdmin.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["password"],
      },
    });
    return result;
  };

  getemployeeProfile = async (req) => {
    let id = req.user.id;
    let result = await TblEmployees.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["Password"],
      },
    });
    return result;
  };

  ChangeemployeePassword = async (req) => {
    let result;
    let userId = req.user.id;
    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(req.body.password, salt);
    await TblEmployees.update(
      {
        Password: hashencrypt,
      },
      {
        where: {
          id: userId,
        },
      }
    )
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Profile updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Profile failed to update",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Profile failed to update",
        };
      });

    if (!result) {
      result = {
        status: false,
        message: "Something went wrong updating profile",
      };
    }
    return result;
  };

  ChangeadminPassword = async (req) => {
    let result;
    let userId = req.user.id;

    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(req.body.password, salt);

    await TblAdmin.update(
      {
        password: hashencrypt,
      },
      {
        where: {
          id: userId,
        },
      }
    )
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Profile updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Profile failed to update",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Profile failed to update",
        };
      });

    if (!result) {
      result = {
        status: false,
        message: "Something went wrong updating profile",
      };
    }
    return result;
  };

  //end of user collection
}

module.exports = new UserCollaction();
