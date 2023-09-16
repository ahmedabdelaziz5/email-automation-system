const schedule = require('node-schedule');
const { setUpReceiversMails } = require('../mailServices/sendEmails');
const { setUpMails } = require('../mailServices/verificationMail');
const { eventModel } = require('../modules/events/model/event.model');


exports.scheduleEvent = async (emailCredentials, recivers, eventId, email) => {
    const jobDate = new Date(emailCredentials.sendAt);
    let job = schedule.scheduleJob(`${eventId}`, jobDate, async function(){
        let result = await setUpReceiversMails(emailCredentials, recivers);
        if(result.statusCode === 400){
            const updateStatusPromis =  eventModel.updateOne({ _id: eventId }, { eventStatus: "faild" });
            const sendFailerEmailPromis =  setUpMails("failerEmail", emailCredentials = { email, result });
            await Promise.all([updateStatusPromis, sendFailerEmailPromis]);
        } 
        else{
            const updateStatusPromis = eventModel.updateOne({ _id: eventId }, { eventStatus: "done" })
            const sendConfirmMail =  setUpMails("confirmationEmail", emailCredentials = { email, result });
            await Promise.all([updateStatusPromis, sendConfirmMail]);
        }

    })
} 



