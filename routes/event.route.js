const app = require('express').Router();

const {
    scheduleEvent,
    getAllScheduledEvents,
    cancelScheduledEvent,
} = require('../controller/event.controller'); // controllers 

const {
    scheduleEventValid,
} = require('../modules/templates/validation/templates.validation'); // validation schemas 

const { validateRequest } = require('../validator/req.validation'); // middleware to validate request body 
const decodeToken = require('../Auth/tokenDecoding'); // middleware to decode token 

app.get('/getAllScheduledEvents', decodeToken(), getAllScheduledEvents);
app.post('/scheduleEvent', decodeToken(), validateRequest(scheduleEventValid), scheduleEvent);
app.delete('/cancelScheduledEvent/:eventId', decodeToken(), cancelScheduledEvent);

module.exports = app ; 