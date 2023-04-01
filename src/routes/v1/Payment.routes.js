const express = require("express");
const router = express.Router();
const path = require("path");
const shortid = require("shortid");
const Razorpay = require("razorpay");
const httpStatus = require("http-status");

const razorpay = new Razorpay({
  key_id: "rzp_test_vDtYuuL3iHbPDn",
  key_secret: "EgUAkPNwpT5l398uKfYvC5a8",
});

router.get("/logo.svg", (req, res) => {
  res.sendFile(path.join(__dirname, "logo512.png"));
});

router.post("/verification", (req, res) => {
  // do a validation
  const secret = "12345678";
  const crypto = require("crypto");
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  if (digest === req.headers["x-razorpay-signature"]) {
    res.status(httpStatus.OK).send({
      status: 1,
    });
    // require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
  } else {
    res.status(httpStatus.OK).send(
      res.status(httpStatus.OK).send({
        status: 0,
      })
    );
  }
});

router.post("/razorpay", async (req, res) => {
  const payment_capture = 1;
  const amount = parseInt(req.query.ammount) * 100;
  const currency = "INR";
  const options = {
    amount: amount,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
