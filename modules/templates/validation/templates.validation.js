const Joi = require('joi') ; 

module.exports = {

    scheduleEventValid : {
        
        body:Joi.object().required().keys({

            templateName : Joi.string().required().messages({
                "string.empty" : "template name can not be empty",
                "any.required" : "template name is required"
            }),

            eventName : Joi.string().required().messages({
                "string.empty" : "event name can not be empty",
                "any.required" : "event name is required"
            }),

            recivers : Joi.array().required().items(
                Joi.object({
                    email : Joi.string().email().required().messages({
                        "string.empty" : "email can not be empty",
                        "any.required" : "email is required"
                    })
                })
            ), 

            emailCredentials : Joi.object().required().keys({
                
                sendAt : Joi.date().required().messages({
                    "string.empty" : "sendAt can not be empty",
                    "any.required" : "sendAt is required"
                }),
                
                emailSubject : Joi.string().required().messages({
                    "string.empty" : "email subject can not be empty",
                    "any.required" : "email subject is required"
                }),

                emailContent : Joi.string().required().messages({
                    "string.empty" : "email content can not be empty",
                    "any.required" : "email content is required"
                }),
            
            })

        })
    }
    
}