const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Employees = sequelize.define(tbl.TBL_EMPLOYEES, {
  id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Username: {
    type: Sequelize.STRING(50),
    unique:true,
    allowNull: false,
  },
  Email: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  Mobile: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true,
  },

  Address: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  Password: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  Role: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  Rid: {
    type: Sequelize.INTEGER(50),
    allowNull: false,
  },
  role_id: {
    type: Sequelize.INTEGER(50),
    allowNull: false,
  },
  Status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isRequest: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  signature: {
    type: Sequelize.STRING(255),
    allowNull:true
  },
  profile_image:{
    type: Sequelize.STRING(255),
    allowNull:true
  }
});

module.exports = Employees;
