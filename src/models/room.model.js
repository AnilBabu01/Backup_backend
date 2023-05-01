const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");
const { Tbl_DHARAMSALA } = require("./TableName");
const Facilities = require("./facility.model");

const Roomes = sequelize.define(tbl.TBL_ROOMS, {
  room_id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  FroomNo: {
    type: Sequelize.INTEGER(50),
    allowNull: false,
  },
  TroomNo: {
    type: Sequelize.INTEGER(50),
    allowNull: false,
  },
  Rate: {
    type: Sequelize.INTEGER(255),
    allowNull: false,
  },
  dharmasala_id: {
    type: Sequelize.INTEGER(255),
    allowNull: false,
  },
  category_id: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },

  advance: {
    type: Sequelize.INTEGER(255),
    allowNull: false,
  },

  facility_id: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  coTime: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  roomType: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  image1: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  image2: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  image3: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  image4: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
});

Roomes.associate = (models) => {
  Roomes.belongsTo(models.tbl_dharmasala, { foreignKey: 'dharmasalaId' });
};

module.exports = Roomes;
