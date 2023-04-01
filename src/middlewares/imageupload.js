const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');


const uploadimage = (file) => {
    const newdate = new Date().toLocaleDateString("fr-CA");    
    var dir = `public/uploads/${newdate}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    const ext = file.name.split(".")[1]
    const filename = Date.now() + uuidv4() + '.' + ext;
    const filepath =     newdate + '/' + filename;
    const newpath = path.join(process.cwd(), dir, filename);

  
    const files = file.mv(newpath, function (err) {
        if (err) console.log(err);
        else console.log('uploaddd');
    })
    
    return filepath;
}


module.exports = uploadimage

