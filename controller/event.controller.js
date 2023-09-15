const { eventModel } = require('../modules/events/model/event.model');
const { scheduleEvent } = require('../schedulingServices/scheduleEmails')
const mongoose = require('mongoose');

exports.scheduleEvent = async (req, res) => {
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
        const { emailSubject, emailContent, templateName } = req.body;
        const templateId = req.params.templateId;

        const user = await userModel.findByIdAndUpdate(
            { _id: req.user.userId },
            {
                $set: {
                    "userTemplates.$[elem].emailSubject": emailSubject,
                    "userTemplates.$[elem].emailContent": emailContent,
                    "userTemplates.$[elem].templateName": templateName,
                },
            },
            {
                arrayFilters: [{ "elem._id": templateId }]
            }
        );

        if (!user) {
            return res.status(400).json({
                message: "there is no such user"
            })
        }

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

exports.getAllScheduledEvents = async (req, res) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let events = await eventModel.find({ userId }).sort({ sendAt: -1 }).skip(skip).limit(limit).lean();
        const totalNumOfItems = await eventModel.countDocuments({ userId });

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

