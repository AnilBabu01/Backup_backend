const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const manualDonation = sequelize.define(tbl.TBL_MANUAL_DONATION, {
  id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  ReceiptNo: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  phoneNo: {
    type: Sequelize.STRING(15),
    trim: true,
  },
  name: {
    type: Sequelize.STRING(150),
    trim: true,
  },
  address: {
    type: Sequelize.STRING(255),
    trim: true,
  },
  donation_date: {
    type: Sequelize.DATE,
    trim: true,
  },
  isAdmin:{
    type: Sequelize.BOOLEAN
  },
  donation_time: {
    type: Sequelize.TIME,
    trim: true,
  },
  member: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  modeOfDonation: {
    type: Sequelize.STRING(15),
    allowNull: false,
  },
  created_by: {
    type: Sequelize.INTEGER(50),
    trim: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  rsn: {
    type: Sequelize.STRING(),
    allowNull: true,
  },
  gender: {
    type: Sequelize.STRING(),
    allowNull: false,
  },
});

module.exports = manualDonation;
