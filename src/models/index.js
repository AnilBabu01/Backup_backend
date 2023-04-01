const sequelize = require('../db/db-connection');
module.exports.userModel = require('./user.model');
module.exports.otpModel = require('./otp.model');
module.exports.roleModel = require('./role.model');
module.exports.usersRolesModel = require('./users_roles.model');
module.exports.passwordReset = require('./password_reset.model');
module.exports.donationModel = require('./donationDetail.model');
module.exports.newDonationModel = require('./donation.model');
module.exports.donationItem = require('./donationItem.model');
module.exports.ElecDonationModel = require('./electricDonation.model');
module.exports.itemList = require('./item.model');
module.exports.ElecDonationItem = require('./electricDonationItem.model');
module.exports.Vouchers = require('./voucher.model')
module.exports.donationTypes = require('./donationTypes.model')
module.exports.employees = require('./employees.model')
module.exports.admin = require('./admin.model')
module.exports.empRoles = require('./employeeRoles.model')
module.exports.Receipt = require('./Receipts.model')
module.exports.ManualDonation = require('./manualDonation.model')
module.exports.ManualDonationItem = require('./manualDonationItems.model')
module.exports.Checkin = require('./checkin.model')
module.exports.Rooms = require('./room.model')
module.exports.RoomCategory = require('./roomCategory.model')
module.exports.facility = require('./facility.model')
module.exports.holdIn = require('./holdin.model')
module.exports.cancelVouchers =  require('./cancelledVouchers.model')
module.exports.dharmashala = require('./darmashala.model')

sequelize.sync().then((result) => {
    console.log('data synced')
}).catch((e) => {
    console.log('error in sync', e)
});




