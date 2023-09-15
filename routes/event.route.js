const app = require('express').Router();

const {
    addEvent,
    getAllScheduledEvents,
    cancelScheduledEvent,
} = require('../controller/event.controller'); // controllers 

const {
    addEventValid,
} = require('../modules/templates/validation/templates.validation'); // validation schemas 

const { validateRequest } = require('../validator/req.validation'); // middleware to validate request body 
const decodeToken = require('../Auth/tokenDecoding'); // middleware to decode token 

app.get('/getAllScheduledEvents', decodeToken(), getAllScheduledEvents);
app.post('/addEvent', decodeToken(), validateRequest(addEventValid), addEvent);
app.delete('/cancelScheduledEvent/:eventId', decodeToken(), cancelScheduledEvent);

module.exports = app ; 