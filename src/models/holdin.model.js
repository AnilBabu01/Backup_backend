const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Holdin = sequelize.define(tbl.TBL_HOLDIN, {
  id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  mobile: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  roomNo: {
    type: Sequelize.INTEGER(50),
    allowNull: false,
  },
  since: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  sinceTime: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  dharmasala: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  remain: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  remainTime: {
    type: Sequelize.TIME,
    allowNull: false,
  },

  approvedBy: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  remarks: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
});

module.exports = Holdin;
