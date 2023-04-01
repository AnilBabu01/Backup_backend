const uploadimage = require('../middlewares/imageupload');
const db = require('../models');
const TblUser = db.ItrModel;



class ItrCollaction {

    itr_register = async (params, file, body) => {
        const { F_NAME, L_NAME, EMAIL, PHONENO, PANNUMBER, ADHARNUM } = body
        const { PANIMG, ADHARIMG, FRM16, BANKSTATEMENT, DETAILSOFINV, DETAILSOFLONE } = file

        const up_PANIMG = uploadimage(PANIMG);
        const up_ADHARIMG = uploadimage(ADHARIMG);
        const up_FRM16 = uploadimage(FRM16);
        const up_BANKSTATEMENT = uploadimage(BANKSTATEMENT);
        const up_DETAILSOFINV = uploadimage(DETAILSOFINV);
        const up_DETAILSOFLONE = uploadimage(DETAILSOFLONE);
        let result = "";

        const query = await TblUser.create({
            F_NAME,
            L_NAME,
            EMAIL,
            PHONENO,
            PANNUMBER,
            PANIMG: up_PANIMG,
            ADHARNUM,
            ADHARIMG: up_ADHARIMG,
            FRM16: up_FRM16,
            BANKSTATEMENT: up_BANKSTATEMENT,
            DETAILSOFINV: up_DETAILSOFINV,
            DETAILSOFLONE: up_DETAILSOFLONE,
            ISDELETED: false
        }).then((res) => {
            result = {
                status: 1,
                message: "Created Successfully",
                data: res.dataValues
            }
        }).catch(err => {
            result = {
                status: 0,
                message: "Somthing Went Wrong",
                data: err
            }
        });

        return result;

    }




}

module.exports = new ItrCollaction(); 
