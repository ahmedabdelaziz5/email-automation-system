const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
});

exports.userModel = mongoose.model("user", userSchema);