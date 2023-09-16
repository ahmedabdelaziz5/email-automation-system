const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const { userModel } = require('../modules/user/model/user.model');
const { eventModel } = require('../modules/events/model/event.model'); 
const { setUpMails } = require('../mailServices/verificationMail');
const {setUpReceiversMails} = require('../mailServices/sendEmails');
const { hashPassword } = require('../helpers/passwordHashing');
const { generatePasswod } = require('../helpers/generatePassword');

exports.signUp = async (req, res) => {
    try {
        const
            {
                userName, email, password, confirmPassword,
                bussinesName, bussinesIndustry, whyToUse
            } = req.body;

        let user = await userModel.findOne({ $or: [{ email }, {userName}] }).lean();

        if (user) {
            return res.status(400).json({
                message: "this email already registerd"
            })
        }

        if (password != confirmPassword) {
            return res.status(400).json({
                message: "password and confirm passwrod must be the same"
            })
        }

        let result;
        let newPassword = await hashPassword(password);
        await userModel.create({ email, bussinesName, userName, password: newPassword, bussinesIndustry, whyToUse })
            .then(async () => {
                result = await setUpMails(emailType = "verificationMail", { email });
            })
        return res.status(result.statusCode).json({
            message: result.message
        })

    }

    catch (err) {
        res.status(500).json({
            message: "error",
            err
        })
    };
}

exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        let user = await userModel.findOne({ userName }).lean();

        if (!user) {
            return res.status(401).json({
                message: "you should register first "
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                message: "you should verify your account first "
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "incorrct password "
            });
        }
        
        let token = jwt.sign({ email: user.email, userName: user.userName, userId : user._id }, process.env.SECRET_TOKEN);
        delete user.password;
        delete user.isVerified;
        delete user.userTemplates;
        return res.status(200).json({
            message: "success",
            token,
            user
        });

    }
    catch (err) {
        res.status(500).json({
            message: "error",
            err
        })
    };
}

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        let isFound = await userModel.findOne({ email }).lean().select("_id isVerified");

        if (!isFound) {
            return res.status(200).json({
                message: "you do not have an account yet , please register first "
            })
        }

        if (!isFound.isVerified) {
            return res.status(200).json({
                message: "you should verify your account first "
            })
        }

        let newPassword = generatePasswod(); // get new password 
        await setUpMails(emailType = "resestPasswordMail", { email, newPassword })
            .then(async (result) => {
                if (result.statusCode == 400) {
                    return res.status(400).json({
                        message: "could not chang your password !"
                    })
                }
                let hashedPassword = await hashPassword(newPassword); // hash it 
                await userModel.updateOne({ email }, { password: hashedPassword });
                return res.status(200).json({
                    message: "success"
                })
            })
    }
    catch (err) {
        return res.status(500).json({
            message: "error",
            err
        });
    }
}

exports.editProfile = async (req, res) => {
    try {
        const { userName, email, bussinesName, bussinesIndustry } = req.body;

        const userMail = req.user.email;
        let user = await userModel.findOneAndUpdate({ email: userMail }, {userName, email, bussinesName, bussinesIndustry}).lean().select("email userName");

        if (!user) {
            return res.status(400).json({
                message: "you should register first !"
            })
        }

        res.status(200).json({
            message: "success"
        })
    }

    catch (err) {
        res.status(500).json({
            message: "error",
            err
        })
    };
}

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, password, confirmPassword } = req.body;

        const userMail = req.user.email;
        const user = await userModel.findOne({ email: userMail }).lean().select("email password userName");

        if (!user) {
            return res.status(400).json({
                message: "there is no such user !"
            })
        }

        if (password != confirmPassword) {
            return res.status(400).json({
                message: "password and confirm passowrd must be the same "
            })
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({
                message: "wrong password, please type your correct password !"
            })
        }

        let newPassword = await hashPassword(password);
        await userModel.updateOne({ email: userMail, userName: user.userName }, { password: newPassword });
        res.status(200).json({
            message: "success"
        })

    }
    catch (err) {
        res.status(500).json({
            message: " error",
            err
        })
    }
}

exports.verifyAccount = async (req, res) => {
    let { token } = req.query;
    let decodedMail = jwt.verify(token, process.env.SECRET_TOKEN);
    let user = await userModel.findOneAndUpdate({ email: decodedMail.userMail }, { isVerified: true });
    if (!user) {
        return res.send('there is no such email , please register first');
    }
    return res.send("your account was verified successfully !")
}
 
exports.sendEmail = async (req, res) => {
    try{
        const { email, userName, userId } = req.user;
        const { templateName, eventName, recivers, emailCredentials } = req.body;
        const eventId = new mongoose.Types.ObjectId();

        let saveEventPromise = eventModel.create({
            _id : eventId,
            userMail: email,
            userName: userName,
            userId: userId,
            templateName: templateName,
            eventName: eventName,
            recivers: recivers,
            createdAt: new Date(),
            isScheduled: false,
            sendAt: Date.now(),
            emailSubject: emailCredentials.emailSubject,
            emailContent: emailCredentials.emailContent,
        })

        res.status(200).json({
            message : "success"
        })

        let sendEmailsPromise = setUpReceiversMails(emailCredentials, recivers);
        
        let [saveEventResult, sendEmailsResult] = await Promise.allSettled([saveEventPromise, sendEmailsPromise]);

        if (saveEventResult.status === 'fulfilled' && sendEmailsResult.status === 'fulfilled') {
            let sendConfirmationMailPromise = setUpMails(emailType = "confirmationEmail", {email: email}); 
            let updateEventStatusPromise = eventModel.updateOne({ _id: eventId, userId }, { eventStatus : "done" });
            await Promise.all([sendConfirmationMailPromise, updateEventStatusPromise]);
        }
        else{
           const  updateStatusPromis =  eventModel.updateOne({ _id: eventId, userId }, { eventStatus : "faild" });
           const sendFailerEmailPromis =  setUpMails("failerEmail", emailCredentials = { email, result });
           await Promise.all([updateStatusPromis, sendFailerEmailPromis]);
        }

    }
    catch(err){
        return res.status(500).json({
            message: "error",
            err
        })
    }
}