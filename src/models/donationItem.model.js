const tbl = require('./TableName')
const  Sequelize = require('sequelize');
const sequelize = require('../db/db-connection')

    const DonationItem = sequelize.define(tbl.TBL_DONATION_ITEM, {
        id: {
            type: Sequelize.INTEGER(50),
            primaryKey: true,
            autoIncrement:true,
            allowNull:false,
        },
        donationId:{
            type: Sequelize.INTEGER(50),
            allowNull:false,
        },
        itemId: {
            type: Sequelize.INTEGER(11),
            allowNull:false,
        },
        amount: {
            type: Sequelize.FLOAT(10,2),
            allowNull:false,
        },
        remark: {
            type: Sequelize.STRING(255),
            allowNull:false,
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue:1
        }
    })
    module.exports = DonationItem;
