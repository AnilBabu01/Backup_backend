const express = require('express');
const adminRoutes = require('./admin.routes')
const userRoutes = require('./user.routes')
const payment = require('./Payment.routes');
const ccAvenue = require('./ccAvenue.routes');
const roomRoutes =  require('./room.routes')

const router = express.Router();



router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/payment', payment)
router.use('/ccAvenue', ccAvenue)
router.use('/room', roomRoutes);

module.exports = router;
