const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Roles = sequelize.define(tbl.TBL_NEWS, {
  id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull:false,
  },
  desc: {
    type: Sequelize.STRING(255),
    allowNull:false,
  },
});

module.exports = Roles;
