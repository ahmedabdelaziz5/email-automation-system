const Joi = require('joi');

module.exports = {

    addTemplateValid: {

        body: Joi.object().required().keys({

            templateName: Joi.string().required().messages({
                "string.empty": "template name can not be empty",
                "any.required": "template name is required"
            }),

            emailSubject: Joi.string().required().messages({
                "string.empty": "email subject can not be empty",
                "any.required": "email subject is required"
            }),

            emailContent: Joi.string().required().messages({
                "string.empty": "email content can not be empty",
                "any.required": "email content is required"
            }),

        })

    },

    editSpecificTemplateValid: {

        body: Joi.object().required().keys({

            templateName: Joi.string(),

            emailSubject: Joi.string(),

            emailContent: Joi.string(),

        })
    }

}