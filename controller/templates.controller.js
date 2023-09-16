const mongoose = require('mongoose');
const { userModel } = require('../modules/user/model/user.model');

exports.addTemplate = async (req, res) => {
    try {
        const { emailSubject, emailContent, templateName } = req.body;

        let user = await userModel.findByIdAndUpdate({ _id: req.user.userId }, {
            $push: { userTemplates: { emailSubject, emailContent, templateName, createdAt: Date.now() } }
        })

        if (!user) {
            res.status(400).json({
                message: "there is no such user !"
            })
        }

        return res.status(200).json({
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

exports.editSpecificTemplate = async (req, res) => {
    try {
        const { emailSubject, emailContent, templateName } = req.body;
        const templateId = req.params.templateId;

        if (!mongoose.Types.ObjectId.isValid(templateId)) {
            return res.status(400).json({
                message: "invalid template id"
            })
        }

        const user = await userModel.findByIdAndUpdate(
            { _id: req.user.userId },
            {
                $set: {
                    "userTemplates.$[elem].emailSubject": emailSubject,
                    "userTemplates.$[elem].emailContent": emailContent,
                    "userTemplates.$[elem].templateName": templateName,
                },
            },
            {
                arrayFilters: [{ "elem._id": templateId }]
            }
        );

        if (!user) {
            return res.status(400).json({
                message: "there is no such user"
            })
        }

        return res.status(200).json({
            message: "success"
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "error",
            err
        })
    };
}

exports.getAllTemplates = async (req, res) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let user = await userModel.findOne({ _id: userId }).select("userTemplates").lean();

        if (!user) {
            return res.status(400).json({
                message: "there is no such user !"
            })
        }

        if (!user.userTemplates.length) {
            return res.status(200).json({
                message: "you do not have any templates yet !"
            })
        }

        return res.status(200).json({
            message: "success",
            data: user.userTemplates.slice(skip, skip + limit),
            page,
            totalNumOfItems: user.userTemplates.length,
            numOfPages: Math.ceil(user.userTemplates.length / limit)
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "error",
            err
        });
    }
}

exports.deleteTemplate = async (req, res) => {
    try {
        const templateId = req.params.templateId;

        if (!mongoose.Types.ObjectId.isValid(templateId)) {
            return res.status(400).json({
                message: "invalid template id"
            })
        }

        const user = await userModel.findByIdAndUpdate(
            { _id: req.user.userId },
            { $pull: { userTemplates: { _id: templateId } } },
        )

        if (!user) {
            return res.status(400).json({
                message: "there is no such user"
            })
        }

        return res.status(200).json({
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
