const tbl = require('./TableName')
const  Sequelize = require('sequelize');
const sequelize = require('../db/db-connection')

    const UsersRoles = sequelize.define(tbl.TBL_USERS_ROLES, {
        id: {
            type: Sequelize.INTEGER(50),
            primaryKey: true,
            autoIncrement:true,
            allowNull:false,
        }, 
        user_id: {
            type: Sequelize.INTEGER(100),
            allowNull:false,
        },
        role_id: {
            type: Sequelize.INTEGER(50),   
            allowNull:false,
        }
    })

    module.exports = UsersRoles;
