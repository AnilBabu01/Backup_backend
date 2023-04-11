const shortid = require('shortid');
const request = require("request");

const sendSms = (mobile, amount, url, type, itemName, weight, Rno) => {

  if (mobile.length !== 10 || !url || !amount) {
    return {
      status: false,
      message: "Please check arguments"
    };
  }

  const payload = {
    flow_id: "63bc029a28949f0a2c471ee5",
    sender: "KNDLPR",
    recipients: [{
      mobiles: `91${mobile}`,
      receipt: Rno,
      date: new Date().toLocaleDateString(),
      ...(type ? { ItemName: itemName, weight: weight } : { amount: amount }),
    }],
  };
console.log(payload)
  const options = {
    url: "https://api.msg91.com/api/v5/flow/",
    headers: {
      authkey: "293235Ak5u9izJS564319a6aP1",
      "content-type": "application/json",
    },
    json: true,
    body: payload,
  };

  request.post(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return {
        status: false,
        message: error
      }
    } else {
      return {
        status: true,
        message: body
      }
    }
  });
};

module.exports = sendSms;
