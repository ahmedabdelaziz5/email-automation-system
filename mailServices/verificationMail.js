// function to send verification mail to new mails 
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

exports.setUpMails = async (emailType, emailCredentials) => {

  let mailOptions = {
    from: '3rd task',
    to: `${emailCredentials.email}`,
  };

  if (emailType === "verificationMail") {
    let token = jwt.sign({ userMail: emailCredentials.email }, process.env.SECRET_TOKEN, { expiresIn: `1d` });
    mailOptions['subject'] = "verify your account";
    mailOptions['text'] = "please click the verify button to verify your account";
    mailOptions['html'] = `<b> <a href= 'https://email-automation-system.onrender.com/verifyAccount?token=${token}' target= '_blank'>verify</b>`;

  }

  else if (emailType === "resestPasswordMail") {
    mailOptions['subject'] = "forget passowrd access";
    mailOptions['text'] = `
    your email is : "${emailCredentials.email}"
    your new password is : "${emailCredentials.newPassword}" `
  }

  else if (emailType === "confirmationEmail") {
    mailOptions['subject'] = "status update for your emails"

    mailOptions['text'] = `Hi ,

Your email delivery has been confirmed and sent successfully on ${new Date().toLocaleDateString()}.

Thank you for being a customer!
      
Sincerely.`


  }

  else if (emailType === "failerEmail") {
    mailOptions['subject'] = "status update for your emails"

    mailOptions['text'] = `Hi ,

Your email delivery faild to be sent on ${new Date().toLocaleDateString()}, please check your emails updates and try to send them later.

Thank you for being a customer!
      
Sincerely.`


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