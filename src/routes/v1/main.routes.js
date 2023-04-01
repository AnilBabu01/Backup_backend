const express = require('express');
const { ItrController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { userValidation } = require('../../validations');
const router = express.Router();


router.route('/fileitr').post(ItrController.itr_register);

// router.route('/login').post(auth('PortalManageMent'),validate(PortalmanagementValidation.createrole), PortalManagementController.createRoleAccess);

module.exports = router;