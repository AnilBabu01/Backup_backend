const tbl = require('./TableName')
const  Sequelize = require('sequelize');
const sequelize = require('../db/db-connection')

    const Donation = sequelize.define(tbl.TBL_DONATION, {
        id: {
            type: Sequelize.INTEGER(50),
            primaryKey: true,
            autoIncrement:true,
            allowNull:false,
        }, 
        receiptNo: {
            type: Sequelize.STRING(100),     
            trim: true,
            allowNull:false,
        },
        name: {
            type: Sequelize.STRING(150),     
            trim: true,
        },
        phoneNo: {
            type: Sequelize.STRING(15),     
            trim: true,
        },
        address: {
            type: Sequelize.STRING(255),     
            trim: true,
        },
        new_member: {
            type: Sequelize.STRING(5),  
            trim: true,
        },
        donation_date: {
            type: Sequelize.DATE,
            trim: true,
        },
        donation_time:{
            type:Sequelize.TIME,
            trim: true,
        },
        created_by:{
            type:Sequelize.INTEGER(50),
            trim: true,
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue:1
        }
    })
    module.exports = Donation;
