const tbl = require('./TableName')
const  Sequelize = require('sequelize');
const sequelize = require('../db/db-connection')

const vouchers = sequelize.define(tbl.TBL_VOUCHERS,{
    id:{
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement:true,
        allowNull:false,
    },
    vPrefix:{
        type: Sequelize.STRING(100),
        defaultValue:''
    },
    from:{
        type: Sequelize.INTEGER, 
        allowNull:false,
    },
    to:{
        type: Sequelize.INTEGER,
        allowNull:false,
    },
    assign:{
        type: Sequelize.STRING(100),
        allowNull:false,
    },
    name:{
        type: Sequelize.STRING(255),
        allowNull:false,
    },
    voucher:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    status:{
        type:Sequelize.BOOLEAN,
        defaultValue:true
    }
})


module.exports = vouchers

