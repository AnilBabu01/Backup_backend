const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const ManualDonationitem = sequelize.define(tbl.TBL_MANUAL_DONATION_ITEM, {
  id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  donationId: {
    type: Sequelize.INTEGER(50),
    allowNull: false,
  },
  type: {
    type: Sequelize.TEXT(),
    allowNull: false,
  },
  amount: {
    type: Sequelize.FLOAT(10, 2),
    allowNull: false,
  },
  ChequeNo: {
    type: Sequelize.TEXT(),
  },
  branch:{
    type: Sequelize.STRING(150),
  },
  BankName: {
    type: Sequelize.STRING(150),
  },
  transactionNo:{
    type: Sequelize.STRING(300),
  },
  ChequeDate: {
    type: Sequelize.STRING(150),
  },
  remark: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  size: {
    type: Sequelize.INTEGER,
  },
  itemType:{
    type: Sequelize.STRING(255),
  },
  quantity: {
    type: Sequelize.INTEGER,
  },
  approxValue: {
    type: Sequelize.INTEGER,
  },
  unit:{
    type: Sequelize.STRING
  }
});
module.exports = ManualDonationitem;
