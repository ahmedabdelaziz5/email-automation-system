const app = require('express').Router();

const {
    addTemplate,
    editSpecificTemplate,
    getAllTemplates,
    deleteTemplate,
} = require('../controller/templates.controller'); // controllers 

const {
    addTemplateValid,
    editSpecificTemplateValid,
} = require('../modules/templates/validation/templates.validation'); // validation schemas 

const { validateRequest } = require('../validator/req.validation'); // middleware to validate request body 
const decodeToken = require('../Auth/tokenDecoding'); // middleware to decode token 

app.get('/getAllTemplates', decodeToken(), getAllTemplates);
app.patch('/addTemplate', decodeToken(), validateRequest(addTemplateValid), addTemplate);
app.patch('/editSpecificTemplate/:templateId', decodeToken(), validateRequest(editSpecificTemplateValid), editSpecificTemplate);
app.put('/deleteTemplate/:templateId', decodeToken(), deleteTemplate);

module.exports = app ; 