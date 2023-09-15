// function to send scheduled emails
const nodemailer = require('nodemailer');

exports.setUpReceiversMails = async (emailCredentials, recivers) => {

  recivers.forEach(user => {
    let result = sendEmail(user, emailCredentials);
    if (result.statusCode === 400)  return result ;
  });
  return result = {
    statusCode: 200,
    message: "success and your email was sent !"
  } ;
}

const sendEmail = async (user, emailCredentials) => {

  let mailOptions = {
    from: '3rd task',
    to: `${user.email}`,
    subject: `${emailCredentials.emailSubject}`,
    text: `${emailCredentials.emailContent}`
  };

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
      obj.message = "error sending emails !"
    }
  })

  return obj;
}

//const promises = recivers.map(user => sendEmail(user, emailCredentials));
// const results = await Promise.all(promises);

// // Check if any email failed to send
// const failedEmail = results.find(result => result.statusCode === 400);
// if (failedEmail) {
//     return failedEmail;
// }

// return {
//     statusCode: 200,
//     message: "success and your email was sent!"
// };
