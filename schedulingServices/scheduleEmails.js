const schedule = require('node-schedule');
const { setUpReceiversMails } = require('../mailServices/sendEmails');
const { setUpMails } = require('../mailServices/verificationMail');
const { eventModel } = require('../modules/events/model/event.model');

exports.scheduleEvent = async (emailCredentials, recivers, eventId, email) => {

    schedule.scheduleJob({ rule: emailCredentials.sendAt }, async () => {
        let result = await setUpReceiversMails(emailCredentials, recivers);
        await eventModel.findByIdAndUpdate({ _id: eventId }, { eventStatus: "done" })
        await setUpMails("scheduledEmail", emailCredentials = { email, result });
    });

}

