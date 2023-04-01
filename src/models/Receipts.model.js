const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");


const Receipt = sequelize.define(tbl.TBL_RECEIPT,{
    id:{
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    type:{
      type: Sequelize.INTEGER(50),
      allowNull:false
    },
    receipt:{
        type: Sequelize.STRING(150),
        allowNull:false
    },
    status:{
        type: Sequelize.INTEGER(50),
        defaultValue:1
    }

})


module.exports = Receipt