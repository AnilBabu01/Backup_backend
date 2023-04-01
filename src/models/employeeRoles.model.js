const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const empRoles = sequelize.define(tbl.TBL_EMP_ROLES, {
    id:{
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    roleName:{
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    roleDesc:{
        type: Sequelize.STRING(150),
     
    },
    DAdd:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },

    DDel:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    Dedt:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    Denq:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    RAdd:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },

    RDel:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    Redt:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    Renq:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
})


module.exports = empRoles