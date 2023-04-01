const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Facilities = sequelize.define(tbl.TBL_FACILITY, {
  facility_id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  nameh: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  comments:{
    type: Sequelize.STRING(255),
    allowNull: true,
  },

  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});


module.exports = Facilities;
