const shortid = require('shortid');
const http = require("https");

const sendSms = (mobile, amount, url, type, itemName, weight, Rno) => {

  const longUrl ='https://shreebadebaba-562bd.web.app/onlinereceipt/online-2023-24-036'




  const options = {
    method: "POST",
    hostname: "api.msg91.com",
    port: null,
    path: "/api/v5/flow/",
    headers: {
      authkey: "293235AXhyyGJC63be5b10P1",
      "content-type": "application/json",
    },
  };

  const req = http.request(options, function (res) {
    const chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  let d = new Date();

  const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  if (type) {
    req.write(
      `{\n  \"flow_id\": \"63bc029a28949f0a2c471ee5\",\n  \"mobiles\": \"91${mobile}\",\n  \"ItemName\": \"${itemName}\",\n  \"weight\": \"${weight}\",,\n  \"mobiles\": \"91${mobile}\",\n  \"receipt\": ${Rno}\"${url}\",\n  \"date\": \"${date}\"\n}`
    );
  } else {
    req.write(
      `{\n  \"flow_id\": \"63bc029a28949f0a2c471ee5\",\n  \"mobiles\": \"91${mobile}\",\n  \"amount\": \"${amount}\",\n  \"receipt\": \"${url}\",\n  \"date\": \"${date}\"\n}`
    );
  }

  req.end();
};

module.exports = sendSms;
