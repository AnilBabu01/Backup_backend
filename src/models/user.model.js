const tbl = require('./TableName')
const  Sequelize = require('sequelize');
const sequelize = require('../db/db-connection')

    const Users = sequelize.define(tbl.TBL_USER, {
        id: {
            type: Sequelize.INTEGER(50),
            primaryKey: true,
            autoIncrement:true,
            allowNull:false,
        }, 
        username: {
            type: Sequelize.STRING(100),     
            trim: true,
            
        },
        role_id:{
            type:Sequelize.INTEGER(50),
            defaultValue:2
        },
        mobileNo: {
            type: Sequelize.STRING(15),     
            trim: true,
            unique: true,
            allowNull:false,
        },
        email:{
            type:Sequelize.STRING(150),
            trim: true,
            unique: true,
        },
        password: {
            type: Sequelize.STRING(255),     
            trim: true,
        },
        verified_by:{
            type: Sequelize.ENUM('Mobile','Email'),     
        },
        veification_status:{
            type: Sequelize.BOOLEAN,
        },
        name:{
            type:Sequelize.STRING(150),
        },
        dob:{
            type:Sequelize.DATE,
            allowNull:true,
        },
        anniversary_date:{
            type:Sequelize.DATE,
            allowNull:true,
        },
        address:{
            type:Sequelize.STRING(255),
        },
        gender:{
            type:Sequelize.STRING(100),
            trim: true,
        },
        profile_image:{
            type:Sequelize.STRING(150),
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue:1
        },
        signature: {
            type: Sequelize.STRING(255),
            allowNull:true
          }
    })

    module.exports = Users;
