const sendOtp = async (mobile,otp) => {
    const http = require("https");

    const options = {
      "method": "POST",
      "hostname": "api.msg91.com",
      "port": null,
      "path": "/api/v5/flow/",
      "headers": {
        "authkey": "293235AXhyyGJC63be5b10P1",
        "content-type": "application/json"
      }
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
    
    req.write(`{\n  \"flow_id\": \"63c971e3df1b1939f159d732\",\n  \"sender\": \"KNDLPR\",\n  \"recipients\": [\n    {\n      \"mobiles\": \"91${mobile}\",\n      \"otp\": \"${otp}\"\n    }\n  ]\n}`);
    req.end();

};

module.exports = sendOtp;
