// function to send verification mail to new mails 
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

exports.setUpMails = async (emailType, emailCredentials) => {

  let mailOptions = {
    from: '1st task',
    to: `${emailCredentials.email}`,
  };

  if (emailType === "verificationMail") {
    let token = jwt.sign({ userMail: emailCredentials.email }, process.env.SECRET_TOKEN, { expiresIn: `1d` });
    mailOptions['subject'] = "verify your account";
    mailOptions['text'] = "please click the verify button to verify your account";
    mailOptions['html'] = `<b> <a href= 'http://localhost:2000/verifyAccount?token=${token}' target= '_blank'>verify</b>`;

  }

  else if (emailType === "resestPasswordMail") {
    mailOptions['subject'] = "forget passowrd access";
    mailOptions['text'] = `
    your email is : "${emailCredentials.email}"
    your new password is : "${emailCredentials.newPassword}" `
  }

  else if (emailType === "scheduledEmail") {
    mailOptions['subject'] = "status update for your scheduled email"
    
    if (emailCredentials.result.statusCode === 200) {
      mailOptions['text'] = `Hi ,

      Your meal delivery has been confirmed and sent successfully on ${new Date().toLocaleDateString()}.
      
      Thank you for being a customer!
      
      Sincerely.`
    }
    else {
      mailOptions['text'] = "your emails were not sent , please try again !";
    }

  }

  let result = await sendEmails(mailOptions);
  return result;

}

const sendEmails = async (mailOptions) => {

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.MAIL}`,
      pass: `${process.env.PASS}`
    },
  });

  let obj = {
    statusCode: 200,
    message: "success and your email was sent !"
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      obj.statusCode = 400,
        obj.message = "could not send your email"
    }
  })

  return obj;
}