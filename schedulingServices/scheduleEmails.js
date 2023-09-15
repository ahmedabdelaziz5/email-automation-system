const schedule = require('node-schedule');
const { setUpReceiversMails } = require('../mailServices/sendEmails');
const { setUpMails } = require('../mailServices/verificationMail');
const { eventModel } = require('../modules/events/model/event.model');


exports.scheduleEvent = async (emailCredentials, recivers, eventId, email) => {
    const jobDate = new Date(emailCredentials.sendAt);
    let job = await schedule.scheduleJob(`${eventId}`, jobDate, async function(){
        let result = await setUpReceiversMails(emailCredentials, recivers);
        await eventModel.findByIdAndUpdate({ _id: eventId }, { eventStatus: "done" })
        await setUpMails("confirmationEmail", emailCredentials = { email, result });
    })
}



