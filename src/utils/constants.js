const empRoles = {
    "Administrator" : 0,
    "Donation And Booking": 1,
    "Room Booking": 2,
    "Accounts": 3,
    "Store": 4,
    "Super Admin": 5,
    "Manual Donation": 6,
    "Elect Donation": 7
}

const empRolesReverse = {
    0 :"Administrator",
    1: "Donation And Booking",
    2 :"Room Booking",
    3 :"Accounts",
    4 :"Store",
    5 :"Super Admin",
    6 :"Manual Donation",
    7 :"Elect Donation"
}

const voucherStatus = {
    exhausted : 0,
    running : 1,
    upcoming : 2
}

const reverseVoucherStatus = {
    0:'exhausted',
    1:'running',
    2:'upcoming'
}

module.exports = {
    empRoles,
    empRolesReverse,
    voucherStatus,
    reverseVoucherStatus
}

