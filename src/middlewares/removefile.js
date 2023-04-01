const path = require('path');
const fs = require('fs');


const removefile = (file) => {
    if (fs.existsSync(`public/${file}`)) {
        fs.unlinkSync(`public/${file}`);
    }
    return true;
}
module.exports = removefile

