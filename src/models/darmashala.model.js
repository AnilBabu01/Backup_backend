const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Dharmasala = sequelize.define(tbl.Tbl_DHARAMSALA, {
  dharmasala_id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name:{
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  nameH:{
    type: Sequelize.TEXT,
    allowNull: true,
  },
  desc:{
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  image1: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  status:{
    type: Sequelize.BOOLEAN,
   defaultValue:true
  }

});

Dharmasala.associate = (models) => {
  Dharmasala.hasMany(models.tbl_rooms, { foreignKey: 'dharmasalaId' });
};

module.exports = Dharmasala;