const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const RoomCategory = sequelize.define(tbl.TBL_ROOM_CATEGORY, {
  category_id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: true,
    unique:true
  },
  comment: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
});

module.exports = RoomCategory;
