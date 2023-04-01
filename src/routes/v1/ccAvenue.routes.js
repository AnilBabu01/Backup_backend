const express = require("express");
var http = require("http"),
  fs = require("fs"),
  qs = require("querystring");

const nodeCCAvenue = require("node-ccavenue");
const ccavnew = new nodeCCAvenue.Configure({
  merchant_id: "1927947",
  working_key: "F95E5AA208B82769A8B9F85D8E9F4465",
});
const router = express.Router();
var ccavReqHandler = require("../../utils/ccavRequestHandler"),
  ccavResHandler = require("../../utils/ccavResponseHandler");

// router.route('/ccavRequestHandler').post((req,res)=>{
//     // ccavReqHandler.postReq(req,res)
//     ccavReqHandler.postReq
// })

router.post("/ccavRequestHandler", function (request, response) {
  request.on("data", function (data) {
    body += data;
    let encRequest = ccavnew.encrypt(body);
    console.log(encRequest);
  });
  return false;
  ccavReqHandler.postReq(request, response);
});

router.post("/ccavResponseHandler", function (request, response) {
  ccavResHandler.postRes(request, response);
});

module.exports = router;
