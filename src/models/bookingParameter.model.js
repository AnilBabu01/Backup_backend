const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Items = sequelize.define(tbl.TBL_BOOKING_PARAMETERS, {
  id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  cashierAc: {
    type: Sequelize.STRING(100),
    trim: true,
    allowNull:false
  },
 advanceAc: {
    type: Sequelize.INTEGER(50),
    allowNull:false
  },
  discountAc:{
    type: Sequelize.INTEGER(50),
    allowNull:false
  },
  onlineAc:{
    type: Sequelize.INTEGER(50),
    allowNull:false
  },



});

module.exports = Items;
