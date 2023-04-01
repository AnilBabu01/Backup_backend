
const nodeCCAvenue = require('node-ccavenue');
const ccavnew = new nodeCCAvenue.Configure({
    merchant_id: '1927947',
    working_key: 'F95E5AA208B82769A8B9F85D8E9F4465',
});


exports.postReq = function (request, response) {
    console.log(request,"req check ")
    var body = '',
        workingKey = 'F95E5AA208B82769A8B9F85D8E9F4465',	//Put in the 32-Bit key shared by CCAvenues.
        accessCode = 'AVQX95KA49AU02XQUA',			//Put in the Access Code shared by CCAvenues.
        encRequest = '',
        formbody = '';
    request.on('data', function (data) {
        body += data;
        encRequest = ccavnew.encrypt(body);
        console.log(encRequest);
        formbody = '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';
    });

    request.on('end', function () {
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(formbody);
        response.end();
    });
    return;
};
