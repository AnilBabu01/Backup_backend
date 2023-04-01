const express = require('express');
const adminRoutes = require('./admin.routes')
const userRoutes = require('./user.routes')
const payment = require('./Payment.routes');
const ccAvenue = require('./ccAvenue.routes');
const roomRoutes =  require('./room.routes')

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/payment', payment)
router.use('/ccAvenue', ccAvenue)
router.use('/room', roomRoutes);

module.exports = router;
