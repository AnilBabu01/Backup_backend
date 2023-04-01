const express = require("express");

const router = express.Router();
const auth = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/adminAuth");
const { roomController } = require("../../controllers");

router.route("/checkin").post(auth(), roomController.checkIn);
router.route("/checkin").get(adminAuth(), roomController.getCheckin);
router.route("/checkin").delete(adminAuth(), roomController.delCheckin);
router.route("/checkin").put(adminAuth(), roomController.editCheckin);
router.route('/checkin-id').get(roomController.getCheckinbyId)
router.route('/checkin-payment').put(roomController.checkinPayment)
router.route('/checkin-user').get(auth(),roomController.checkinuser)
//checkin

router.route("/facility").post(adminAuth(), roomController.CreateFacilities);
router.route("/facility").get(adminAuth(), roomController.getFacilities);
router.route("/facility").delete(adminAuth(), roomController.delFacilities);
router.route("/facility").put(adminAuth(), roomController.editFacilities);
//facilites


router.route("/hold").post(adminAuth(), roomController.CreateHoldIn);
router.route("/hold").get(adminAuth(), roomController.getHoldIn);
router.route("/hold").delete(adminAuth(), roomController.delHoldIn);
router.route("/hold").put(adminAuth(), roomController.editHoldIn);
//holdIn

router.route("/").post(adminAuth(), roomController.CreateRooms);
router.route("/").get(adminAuth(), roomController.getRooms);
router.route("/").delete(adminAuth(), roomController.delRooms);
router.route("/").put(adminAuth(), roomController.editRooms);
router.route("/users-room").get(adminAuth(), roomController.getonlineRooms); //for online booking
//Rooms

router.route("/check-room").post(roomController.getAvailableRoom);
router.route("/check-room-catg").get(roomController.getAvailableRoombyCategory);
//ROOM AVAILBILITIES

router.route("/category").post(adminAuth(), roomController.CreateRoomCategory);
router.route("/category").get(adminAuth(), roomController.getRoomCategory);
router.route("/category").delete(adminAuth(), roomController.delRoomCategory);
router.route("/category").put(adminAuth(), roomController.editRoomCategory);
//Categories
router
  .route("/details-by-category")
  .get(adminAuth(), roomController.getbyCategory);

//dharmashala
router.route("/dharmashala").post(adminAuth(), roomController.createDharmasala);
router.route("/dharmashala").get(auth(), roomController.getDharmasala);
router.route("/dharmashala").put(adminAuth(), roomController.editDharmasala);

//booking parameters
router
  .route("/booking-parameters")
  .post(adminAuth(), roomController.createBookingPara);
// router.route("/booking-parameters").get(adminAuth(), roomController.getBookingPara)
// router.route("/booking-parameters").put(adminAuth(), roomController.updateBookingPara)

module.exports = router;
