# email-automation-system

#### This was my third task on my internship @Asterisc Technocrat 

#### I used these technologies :
![Static Badge](https://img.shields.io/badge/5.1.1-bcrypt-red)
![Static Badge](https://img.shields.io/badge/16.3.1-dotenv-yellow)
![Static Badge](https://img.shields.io/badge/4.18.2-express-blue)
![Static Badge](https://img.shields.io/badge/17.10.1-joi-green)
![Static Badge](https://img.shields.io/badge/9.0.2-jsonwebtoken-purple)
![Static Badge](https://img.shields.io/badge/20.5.0-node-darkgreen)
![Static Badge](https://img.shields.io/badge/3.0.1-nodemon-09c)
![Static Badge](https://img.shields.io/badge/cors-2.8.5-0f3)
![Static Badge](https://img.shields.io/badge/node_schedule-2.1.1-darkblue)
![Static Badge](https://img.shields.io/badge/nodemailer-6.9.5-orange)
![Static Badge](https://img.shields.io/badge/mongoose-7.5.0-white)


#### Email automation is a way to create emails that reach the right people with the right message at the right moment—without doing the work every time, sending automated messages leveraging a marketing automation tool.

# Modules

# User module :

#### User schema : 

```JavaScript
{
    email  : { type : String, required : true } , 
    bussinesName  : { type : String, required : true } , 
    userName  : { type : String, required : true  } , 
    password  : { type : String, required : true  } , 
    whyToUse : {type : String , required : true }, // why to use our automated mails service ( student , bussines owner , hr , other , etc.....)
    userTemplates : [{
        emailSubject  : { type : String, required : true  } , 
        emailContent  : { type : String, required : true  } , 
        createdAt : {type : Date , required : true },
        templateName : {type : String , required : true },
    }],
    isVerified : {type : Boolean, default : false}
}

```

#### User endPoints : 

|Endpoint|Method|Usage
|-------:|-----:|-----
|/signUp|POST|allows user to create an account 
|/login|POST|allows user to sign in and login to his account  
|/forgetPassword|POST|allows user to ask for a new password
|/sendEmail|POST|allows user to send emails to a group of users
|/editProfile|PATCH|allows user to edit/update his profile 
|/changePassword|PATCH|allows user to change his password 
|/verifyAccount|GET|allows customer to recive a verify his email after creating account


# Event module :

#### Event schema : 

```JavaScript
{
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
}

```

#### Event endPoints : 

|Endpoint|Method|Usage
|-------:|-----:|-----
|/getAllScheduledEvents|GET|allows user to get all his scheduled events 
|/addEvent|POST|allows user to create and schedule event ( schedule emails )  
|/cancelScheduledEvent/:jobId|DELETE|allows user to cancel any scheduled event 


# Template module :

#### Template schema : 

template schema will be found as an array of obj and it's part of user schema : 
```JavaScript

    userTemplates : [{
        emailSubject  : { type : String, required : true  } , 
        emailContent  : { type : String, required : true  } , 
        createdAt : {type : Date , required : true },
        templateName : {type : String , required : true },
    }],

```

#### Template endPoints : 

|Endpoint|Method|Usage
|-------:|-----:|-----
|/getAllTemplates|GET|allows user to get all his templates 
|/addTemplate|PATCH|allows user to add/create a new template  
|/editSpecificTemplate/:templateId|PATCH|allows user to edit template
|/deleteTemplate/:templateId|PUT|allows user to delete template

# notes :

#### all the services is full production using `onrender` cloud services

#### you can run the project using the following command : `npm start`

#### all get request has a pagination you can send page ( default = 1 ) and limit default = 10 ) in the URL 
