const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const OTP = sequelize.define(tbl.TBL_OTP, {
  id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.INTEGER(50),
    trim: true,
  },
  otp:{
    type: Sequelize.STRING(6),
    trim: true,
  },
});

module.exports = OTP;
