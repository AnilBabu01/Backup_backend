const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");
const { INTEGER } = require("sequelize");

const donationTypes = sequelize.define(tbl.TBL_DONATION_TYPES, {
  id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  type_en: {
    type: Sequelize.STRING(255),

  },
  type_hi: {
    type: Sequelize.TEXT,

  },
  itemType_en: {
    type: Sequelize.STRING(255),

  },
  itemType_hi: {
    type: Sequelize.TEXT,
  },
  modeOfType: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  status: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  rsn:{
    type: Sequelize.STRING(255),
    allowNull:true
  }
});

module.exports = donationTypes;
