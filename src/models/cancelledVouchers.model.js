const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const cancelledVouchers = sequelize.define(tbl.Tbl_CANCELLEDVOUCHERS, {
  id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  voucherNo: {
    type: Sequelize.INTEGER(100),
    allowNull:false,
  },
  voucherId:{
    type: Sequelize.INTEGER(100),
    allowNull:false,
  },
  status: {
    type: Sequelize.BOOLEAN,
   defaultValue:false,
  },
  rsn:{
    type: Sequelize.STRING(255),
    defaultValue:''
  }

});

module.exports = cancelledVouchers;
