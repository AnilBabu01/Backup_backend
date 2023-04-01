const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const NewDonation = sequelize.define(tbl.TBL_NEW_DONATION, {
  id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  RECEIPT_NO: {
    type: Sequelize.STRING(100),
    trim: true,
    allowNull: false,
  },
  MobileNo:{
    type: Sequelize.STRING(12),
    trim: true,
    allowNull: false,
  },
  NAME: {
    type: Sequelize.STRING(150),
    trim: true,
    allowNull: true,
  },
  IMG:{
    type:Sequelize.STRING(150),
    defaultValue:''
  },

  ADDRESS:{
    type: Sequelize.STRING(510),
    trim: true,
    allowNull: true,
  },
  MODE_OF_DONATION: {
    type: Sequelize.STRING(50),
    trim: true,
    allowNull: true,
  },
  TYPE: {
    type: Sequelize.TEXT,
    allowNull: false,
    
  },
  REMARK: {
    type: Sequelize.STRING(150),
    trim: true,
    allowNull: false,
  },

  AMOUNT: {
    type: Sequelize.FLOAT(10, 2),
    trim: true,
    allowNull: true,
  },
  CHEQUE_NO: {
    type: Sequelize.STRING(150),
    trim: true,
    allowNull: true,
  },
  DATE_OF_CHEQUE: {
    type: Sequelize.STRING(150),
    trim: true,
    allowNull: true,
  },
  NAME_OF_BANK: {
    type: Sequelize.STRING(255),
    trim: true,
    allowNull: true,
  },
  PAYMENT_ID: {
    type: Sequelize.STRING(150),
    trim: true,
    allowNull: true,
  },
  PAYMENT_STATUS: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  DATE_OF_DAAN: {
    type: Sequelize.DATE,
    trim: true,
    allowNull: true,
  },
  TIME_OF_DAAN:{
      type: Sequelize.TIME,
      trim: true,
      allowNull: true,
  }
  ,
  ADDED_BY: {
    type: Sequelize.INTEGER(50),
    trim: true,
    allowNull: true,
  },
  active: {
    type: Sequelize.STRING,
    defaultValue: '',
    trim: true,
    allowNull: true,
  },
  GENDER:{
    type: Sequelize.STRING,
  },
  
  rsn:{
      type:Sequelize.STRING(),
      allowNull:true
  }
});

module.exports = NewDonation;
