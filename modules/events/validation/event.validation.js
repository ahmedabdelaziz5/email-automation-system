const Joi = require('joi') ; 

module.exports = {

    scheduleEventValid : {
        
        body:Joi.object().required().keys({

            emailSubject : Joi.string().required().messages({
                "string.empty" : "email subject can not be empty",
                "any.required" : "email subject is required"
            }),


        })
    }, 

    
}