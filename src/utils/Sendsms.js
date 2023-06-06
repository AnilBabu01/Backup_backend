const shortid = require("shortid");
const request = require("request");

const sendSms = async (mobile, amount, url, type, itemName, weight, Rno) => {
  if (mobile.length !== 10 || !Rno || !amount) {
    return {
      status: false,
      message: "Please check arguments",
    };
  }

  const payload = {
    template_id: "63bc029a28949f0a2c471ee5",
    sender: "KNDLPR",
    // recipients: [{
    mobiles: `91${mobile}`,
    var2: Rno,
    // date: new Date().toLocaleDateString(),
    var1: amount,
    // ...(type ? { ItemName: itemName, weight: weight } : { amount: amount }),
    // }],
  };
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
        message: error,
      };
    } else {
      console.log(body);
      return {
        status: true,
        message: body,
      };
    }
  });
};

const sendroomSms = async (mobile, type) => {
  if (mobile.length !== 10) {
    return {
      status: false,
      message: "Please check arguments",
    };
  }

  const payload = {
    // template_id: "63bc029a28949f0a2c471ee5",
    // sender: "KNDLPR",
    // recipients: [{
    mobiles: `91${mobile}`,
    // var2: Rno,
    // date: new Date().toLocaleDateString(),
    // var1: amount
    // ...(type ? { ItemName: itemName, weight: weight } : { amount: amount }),
    // }],
  };

  if (type == "checkin") {
    payload.template_id = "63bc029a28949f0a2c471ee5";
    payload.sender = "KNDLPR";
  }

  if (type == "checkout") {
    payload.template_id = "647333fcd6fc05494055d092";
    payload.sender = "KNDLPR";
  }

  const options = {
    url: "https://api.msg91.com/api/v5/flow/",
    headers: {
      authkey: "293235Ak5u9izJS564319a6aP1",
      "content-type": "application/json",
    },
    json: true,
    body: payload,
  };
// console.log(options)
  request.post(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return {
        status: false,
        message: error,
      };
    } else {
      console.log(body);
      return {
        status: true,
        message: body,
      };
    }
  });
};

module.exports = { sendSms, sendroomSms };
