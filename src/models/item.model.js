const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Items = sequelize.define(tbl.TBL_ITEM, {
  id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  item_name: {
    type: Sequelize.STRING(100),
    trim: true,
  },
  is_deleted: {
    type: Sequelize.DATE,
  }
});

module.exports = Items;
