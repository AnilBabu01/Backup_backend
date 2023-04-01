const db = require("../models");
const { Op, QueryTypes } = require("sequelize");
const sequelize = require("../db/db-connection");

const TblUser = db.userModel;
const TblUsersRoles = db.usersRolesModel;
const TblOTP = db.otpModel;
const TblPasswordReset = db.passwordReset;
const TblEmployees = db.employees;
const TblAdmin = db.admin;

db.userModel.hasOne(db.otpModel, { foreignKey: "user_id", as: "otpDetails" });
db.otpModel.belongsTo(db.userModel, { foreignKey: "user_id", as: "userOTP" });

// db.roleModel.hasMany(db.usersRolesModel, {
//   foreignKey: "role_id",
//   as: "usersRoles",
// });
// db.usersRolesModel.belongsTo(db.roleModel, {
//   foreignKey: "role_id",
//   as: "roles",
// });

const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { UserCollection } = require(".");
const sendOtp = require("../utils/SendOtp");

class UserCollaction {
  getUserByEmail = async (email) => {
    let result = "";
    const query = await TblUser.findOne({
      where: {
        EMAIL: email,
      },
    }).then((res) => {
      result = res;
    });
    return result;
  };

  getUserDetails = async (identity) => {
    console.log(identity);

    let data = await TblUser.findOne({
      where: {
        [Op.or]: [
          { username: identity },
          { email: identity },
          { mobileNo: identity },
        ],
        status: 1,
      },
    });
    if (!data) {
      return null;
    }
    return data;
  };

  getUserName = async (username) => {
    const query = await TblUser.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: username },
          { mobileNo: username },
        ],
      },
    });
    return query;
  };

  getAdminName = async (username) => {
    let result = "";
    const query = await TblAdmin.findOne({
      where: {
        [Op.or]: [{ email: username }, { id: username }],
      },
    }).then((res) => {
      console.log(res);
      result = res;
    });

    return result;
  };

  getEmployee = async (email) => {
    let result = "";
    console.log(email, "email");
    const query = await TblEmployees.findOne({
      where: {
        [Op.or]: [{ Username: email }, { email: email }, { id: email }],
      },
    }).then((res) => {
      result = res;
    });
    console.log(query);
    return result;
  };

  isPasswordMatch = async function (password, userPassword) {
    return bcrypt.compare(password, userPassword);
  };

  isOTPMatch = async (username, otp) => {
    const data = await TblUser.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: username },
          { mobileNo: username },
        ],
      },
      include: [
        {
          model: TblOTP,
          as: "otpDetails",
          attributes: ["otp"],
        },
      ],
    });

    if (data?.otp != "" && data?.otpDetails?.dataValues?.otp == otp) {
      await TblOTP.update({ otp: null }, { where: { user_id: data.id } });
      await TblUser.update(
        { veification_status: 1, verified_by: "Mobile" },
        { where: { id: data.id } }
      );
      return 1;
    }
    return 0;
  };

  checkOtpLastSend = async (id) => {
    const result = await TblOTP.findOne({
      // logging: (sql, queryObject) => {
      //   sendToElasticAndLogToConsole(sql, queryObject)
      // },
      where: {
        user_id: id,
        otp: {
          [Op.not]: null,
        },
      },
    });
    return result;
  };

  updateForgotPassToken = async (id, otp, expire) => {
    const record = await TblPasswordReset.findOne({ where: { user_id: id } });
    if (record) {
      const data = await TblPasswordReset.update(
        { resetPasswordOtp: otp, resetPasswordExpires: expire },
        { where: { user_id: id } }
      );
      return await TblPasswordReset.findOne({ where: { user_id: id } });
    } else {
      return TblPasswordReset.create({
        user_id: id,
        resetPasswordOtp: otp,
        resetPasswordExpires: expire,
      });
    }
  };

  forgotOTPMatch = async (body) => {
    const { identity } = body;
    const user = await this.getUserName(identity);
    const data = await TblPasswordReset.findOne({
      where: { user_id: user.id },
    });

    if (data.resetPasswordOtp == body.otp) {
      return {
        resetPasswordToken: data.resetPasswordToken,
        resetPasswordExpires: data.resetPasswordExpires,
        user_id: user.id,
      };
    }
    return null;
  };

  forgotPass = async (req) => {
    const id = req.user.id;

    const { oldpassword, newPassword } = req.body;
    let data;

    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(newPassword, salt);

    const user = await TblUser.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Your not Authorized ");
    } else {
      let checkpass = await this.isPasswordMatch(oldpassword, user.password);
      console.log(checkpass);
      if (checkpass) {
        data = await TblUser.update(
          {
            password: hashencrypt,
          },
          {
            where: {
              id: user.id,
            },
          }
        );
      }
    }

    return data;
  };

  forgotPasswordReqOtp = async (req) => {
    const email = req.body.email;

    let user = await TblUser.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      // ---------check OTP TIME--------
      const checkOtpLastSend = await this.checkOtpLastSend(user.id);
      if (!checkOtpLastSend) {
        let otp = Math.floor(100000 + Math.random() * 900000); //-----6 digit random number--------
        sendOtp(body.mobile_no,otp)
        const update_otp = await UserCollection.updateOTP(user.id, otp);
        return {
          status: true,
          message: "Otp Will send to Your Registered Mail",
        };
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
          const update_otp = await UserCollection.updateOTP(user.id, otp);
          sendOtp(body.mobile_no,otp)
          if (update_otp[0] == 1) {
            return {
              status: true,
              message: "Otp Will send to Your Registered Mail",
            };
          } else {
            return {
              status: true,
              message: "Otp Will send to Your Registered Mail",
            };
          }
        } else {
          throw new ApiError(
            httpStatus.NOT_FOUND,
            `Please wait ${Math.abs(checkRemaining)} seconds.`
          );
        }
      }
    }
    return {
      status: true,
      message: "Otp Will send to Your Registered Mail",
    };
  };
  changePassForgot = async (req) => {
  try {
    const { token, password } = req.body;
    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(password, salt);

    let verify = await TblPasswordReset.findOne({
      where: { resetPasswordToken: token },
    });

    if (verify) {
      let res = await TblUser.update(
        {
          password: hashencrypt,
        },
        {
          where: {
            id: verify.user_id,
          },
        }
      );
      console.log(res);
      if (res[0] == 0) {
        return {
          statusCode: 401,
          status: false,
          message: "Password failed to update ",
        };
      }

      let destroyRes = await TblPasswordReset.destroy({
        where: {
          user_id: verify.user_id,
        },
      });
      console.log(destroyRes, "second");
      if (destroyRes[0] == 0) {
        return {
          statusCode: 401,
          status: false,
          message: "Password failed to update ",
        };
      }

      return {
        statusCode: 200,
        status: true,
        message: "Password updated successfully",
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: "Token is invalid",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 401,
      status: false,
      message: "Password failed to update ",
    };
  }}

} //end of class

function sendToElasticAndLogToConsole(sql, queryObject) {
  // save the `sql` query in Elasticsearch
  console.log(sql);

  // use the queryObject if needed (e.g. for debugging)
}

module.exports = new UserCollaction();
