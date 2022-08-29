require('dotenv').config();
const nodemailer = require('nodemailer')
const googleOAuth2 = require('../configs/googleApis');

const mailer = async ({from, to, subject, text, html}) => {
  try{

    //MAILTRAP
    // let transporter = nodemailer.createTransport({
    //   host: "smtp.mailtrap.io",
    //   // host: 'smt.gmail.com',
    //   port: 2525,
    //   secure: false,
    //   auth: {
    //     user: process.env.MAIL_USER,
    //     pass: process.env.MAIL_PASS
    //   }
    // })

    //GMAIL
    const accessToken = await googleOAuth2.getAccessToken();
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER, 
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      }
    })

    let info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });

    console.log(`mail sent to ${to}`)

  }
  catch(er){
    console.log('ERROR ::: mailer ::: ',er)
  }
}

module.exports = mailer