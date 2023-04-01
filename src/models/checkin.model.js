const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Room = sequelize.define(tbl.TBL_CHECKIN, {
  id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  RoomNo: {
    type: Sequelize.INTEGER(50),
    allowNull: false,
  
  },
  booking_id: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  dharmasala: {
    type: Sequelize.INTEGER(50),
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
  },
  time: {
    type: Sequelize.TIME,
  },
  contactNo: {
    type: Sequelize.STRING(20),
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING(255),

  },

  address: {
    type: Sequelize.STRING(400),
  },
  city: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  state: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  proof: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  idNumber: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  male: {
    type: Sequelize.INTEGER(50),
    allowNull: false,
  },
  modeOfBooking: {
    type: Sequelize.INTEGER(50), /// 1 for offline and 2 for online
    allowNull: false,
  },
  paymentStatus: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  paymentid:{
    type: Sequelize.STRING(255)
  },
  female: {
    type: Sequelize.INTEGER(50),
    allowNull: false,
  },
  child: {
    type: Sequelize.INTEGER(50),
    allowNull: false,
  },
  coutDate: {
    type: Sequelize.DATE,
  },
  coutTime: {
    type: Sequelize.TIME,
  },
  Fname:{
    type: Sequelize.STRING(255),
  },
  nRoom:{
    type: Sequelize.INTEGER(50),
  },
  extraM:{
    type: Sequelize.INTEGER(50),
    allowNull: true,
  },
  booked_by:{
    type: Sequelize.INTEGER(50),
    allowNull: false,
  }
});

module.exports = Room;
