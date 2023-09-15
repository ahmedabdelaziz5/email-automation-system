const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    userMail: { type: String, required: true },
    userName: { type: String, required: true },
    userId : {type : mongoose.Types.ObjectId , required : true},
    templateName: { type: String, required: true },
    eventName: { type: String, required: true },
    eventStatus: { type: String, default : "pending"  }, // done , pending 
    recivers: [{
        email: { type: String, required: true },
    }],
    createdAt: { type: Date, required: true },
    sendAt: { type: Date, required: true }, 
    isScheduled: { type: Boolean, default: false },
});

exports.eventModel = mongoose.model("events", eventSchema);