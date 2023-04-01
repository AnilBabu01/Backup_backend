const nodemailer = require('nodemailer');
const { google } = require("googleapis");


const oAuth2client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuth2client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })
async function sendMai1 (email,subject,text) {
  try{
      const accessToken = await oAuth2client.getAccessToken()
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken
        }

      })

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text
      }

      const result = await transporter.sendMail(mailOptions)

      return result

  }catch(e){
    console.log(e)
  } 
}


module.exports = sendMai1