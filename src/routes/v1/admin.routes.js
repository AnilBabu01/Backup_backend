const express = require("express");
const {
  adminController,
  userController,
  donationController,
  voucherController,
} = require("../../controllers");
const router = express.Router();
const validate = require("../../middlewares/validate");
const { userValidation, authValidation } = require("../../validations");
const auth = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/adminAuth");

router
  .route("/cheque-status")
  .post(adminAuth(), donationController.ChangeChequeStatus);
router
  .route("/login")
  .post(validate(authValidation.adminLogin), adminController.adminLogin);
router
  .route("/login-employee")
  .post(validate(authValidation.employeeLogin), adminController.EmployeeLogin);
router
  .route("/user-register")
  .post(validate(userValidation.register), adminController.userRegister);
router.route("/donation-list").get(adminController.allList);
router
  .route("/donation-list")
  .delete(adminAuth(), donationController.delDonation);
router
  .route("/donation-list")
  .put(adminAuth(), donationController.editDonation);
router.route("/donation-list/:id").get(adminController.allList);
router.route("/get-users").get(adminAuth(), userController.getUsers);
router.route("/get-users").put(adminAuth(), adminController.editUser);
router
  .route("/change-status-users")
  .get(adminAuth(), adminController.changeuserStatus);
router
  .route("/donation-type")
  .post(adminAuth(), adminController.addDonationType);
router.route("/donation-type").get(auth(), adminController.getDonationType);
router
  .route("/donation-type")
  .delete(adminAuth(), adminController.DelDonationType);
router
  .route("/change-donation-type")
  .post(adminAuth(), adminController.changeDonationType);

  
router
  .route("/delete-donation-type")
  .post(adminAuth(), donationController.deleteDonationType);

  
router
  .route("/donation-type")
  .put(adminAuth(), adminController.EditDonationType);
router.route("/add-employee").post(adminAuth(), adminController.addEmployees);
router.route("/add-employee").get(adminAuth(), userController.getEmployees);
router.route("/add-employee").delete(adminAuth(), userController.delEmployees);
router.route("/add-employee").put(adminAuth(), userController.editEmployee);
router.route("/create-role").post(adminAuth(), voucherController.EmployeeRole);
router
  .route("/create-role")
  .get(adminAuth(), voucherController.getEmployeeRole);
router
  .route("/create-role")
  .put(adminAuth(), voucherController.EditEmployeeRole);
router
  .route("/change-elec")
  .post(adminAuth(), donationController.ChangeElecStatus);
router
  .route("/change-manualDonation")
  .post(adminAuth(), donationController.ChangemanualDonation);
router
  .route("/create-receipt")
  .post(adminAuth(), voucherController.createReceipt);
router
  .route("/create-receipt")
  .put(adminAuth(), voucherController.changeReceiptStatus);
router.route("/get-receipt").get(adminAuth(), voucherController.getReceipt);
router.route("/voucher-get").get(adminAuth(), voucherController.getVoucherEach);
router
  .route("/getuser-by-num")
  .get(adminAuth(), donationController.getuserBynum);

router
  .route("/add-voucher")
  .delete(adminAuth(), voucherController.deleteVoucher);

router
  .route("/getuser-by-num-manual")
  .get(adminAuth(), donationController.getuserBynumManual);
router
  .route("/donation-report")
  .get(adminAuth(), donationController.donationReport);

router
  .route("/donation-manual-report")
  .get(adminAuth(), donationController.manualdonationReport);

router
  .route("/donation-online-report")
  .get(adminAuth(), donationController.onlineDonationReport);

router
  .route("/manual-donation")
  .post(adminAuth(), donationController.addmanualDonation);
router
  .route("/signature-upload")
  .put(adminAuth(), userController.adminSignatureUpload);
router
  .route("/signature-upload-emplo")
  .put(adminAuth(), userController.employeeSignatureUpload);
router
  .route("/manual-donation")
  .get(adminAuth(), donationController.getManualDonation);
router
  .route("/delete-electronic")
  .get(adminAuth(), donationController.deleteElecDonation);
router
  .route("/user-report")
  .get(adminAuth(), donationController.userDonationAmount);
router
  .route("/user-manual-report")
  .get(adminAuth(), donationController.manualuserDonationAmount);
router
  .route("/online-cheque-report")
  .get(adminAuth(), donationController.onlineuserDonationAmount);
router
  .route("/centralized-report")
  .get(adminAuth(), donationController.centralizeduserDonationAmount);
router
  .route("/change-pass")
  .put(adminAuth(), donationController.employeeChangePass);
router.route("/get-sign").get(adminAuth(), userController.getSign);
module.exports = router;

router
  .route("/donation-type-admin")
  .get(adminAuth(), donationController.getAdminDonationType);

router
  .route("/allocated-vouchers")
  .get(adminAuth(), donationController.getAllocatedVoucherList);
router
  .route("/cancel-each-voucher")
  .post(adminAuth(), donationController.cancelEachVoucher);
router
  .route("/update-employee-prof")
  .put(adminAuth(), userController.employeeProfile);
router
  .route("/update-admin-prof")
  .put(adminAuth(), userController.adminProfile);
router
  .route("/update-employee-prof")
  .get(adminAuth(), userController.getemployeeProfile);
router
  .route("/update-admin-prof")
  .get(adminAuth(), userController.getadminProfile);
router
  .route("/change-employee-pass")
  .put(adminAuth(), userController.ChangeemployeePass);
router
  .route("/change-admin-pass")
  .put(adminAuth(), userController.ChangeadminPass);

router
  .route("/vocher-edit-user")
  .put(adminAuth(), voucherController.editVoucher);

//search api

router
  .route("/search-electric")
  .get(adminAuth(), donationController.searchElectric);
router
  .route("/search-manual")
  .get(adminAuth(), donationController.searchManual);
router
  .route("/filter-online-cheque")
  .get(adminAuth(), donationController.searchOnlineCheque);
router
  .route("/search-online-cheque")
  .get(adminAuth(), donationController.SpecificsearchOnlinecheque);



  
//dashboard api admin
router
  .route("/dash-admin-total-elec")
  .get(adminAuth(), donationController.dashAdminTotal);
router
  .route("/dash-admin-total-manual")
  .get(adminAuth(), donationController.dashAdminTotalManual);
router
  .route("/dash-admin-total-online")
  .get(adminAuth(), donationController.dashAdminTotalOnline);



//dashboard api employee
router
  .route("/dash-employee-total-elec")
  .get(adminAuth(), donationController.dashemployeeTotal);
router
  .route("/dash-employee-total-manual")
  .get(adminAuth(), donationController.dashemployeeTotalManual);
router
  .route("/dash-employee-total-online")
  .get(adminAuth(), donationController.dashemployeeTotalOnline);

router.post('/delete-meanual-donation',adminAuth(), donationController.deletemanualDonation)