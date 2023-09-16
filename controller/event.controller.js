const { eventModel } = require('../modules/events/model/event.model');
const { scheduleEvent } = require('../schedulingServices/scheduleEmails')
const schedule = require('node-schedule');
const mongoose = require('mongoose');

exports.addEvent = async (req, res) => {
    try {
        const { email, userName, userId } = req.user;
        const { templateName, eventName, recivers, emailCredentials } = req.body;
        const eventId = new mongoose.Types.ObjectId;

        await eventModel.create({
            _id: eventId,
            userMail: email,
            userName: userName,
            userId: userId,
            templateName: templateName,
            eventName: eventName,
            recivers: recivers,
            createdAt: new Date(),
            isScheduled: true,
            sendAt: emailCredentials.sendAt,
            emailSubject: emailCredentials.emailSubject,
            emailContent: emailCredentials.emailContent,
        })
        await scheduleEvent(emailCredentials, recivers, eventId, email);
        return res.status(200).json({
            message: "success"
        })

    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "error",
            err
        })
    };
}

exports.cancelScheduledEvent = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { userId } = req.user;
        const job = schedule.scheduledJobs[jobId];

        if (!job) {
            return res.status(400).json({
                message: "There is no such event!"
            });
        }
//
        job.cancel();
        delete schedule.scheduledJobs[jobId];
        await eventModel.deleteOne({ _id: jobId, userId });
        return res.status(200).json({
            message: "success"
        })
        // see all the schedueld events to make sure that the job is canceled
        const jobs = Object.keys(schedule.scheduledJobs).map((key) => ({
            id: key,
            name: schedule.scheduledJobs[key].name,
            nextInvocation: schedule.scheduledJobs[key].nextInvocation(),
        }));
        res.send(jobs);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "error",
            error: err,
        });
    }
};

exports.getAllScheduledEvents = async (req, res) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let events = await eventModel.find({ userId, isScheduled: true }).sort({ sendAt: -1 }).skip(skip).limit(limit).lean();
        const totalNumOfItems = await eventModel.countDocuments({ userId, isScheduled: true });

        if (!events || events.length === 0) {
            return res.status(400).json({
                message: "there is no scheduled events yet !"
            })
        }

        return res.status(200).json({
            message: "success",
            data: events,
            page,
            totalNumOfItems,
            numOfPages: Math.ceil(totalNumOfItems / limit)
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "error",
            err
        });
    }
}

