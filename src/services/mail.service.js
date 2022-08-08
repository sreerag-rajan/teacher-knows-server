require('dotenv').config();
const nodemailer = require('nodemailer')

const mailer = async ({from, to, subject, text, html}) => {
  try{
    let transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      // host: 'smt.gmail.com',
      port: 2525,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
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