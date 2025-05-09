import User from "../models/UserModel.js"
import mongoose from "mongoose";
import Message from "../models/MessagesModel.js"

export const searchContacts = async (req, res, next) => {
    try {
        const { searchTerm } = req.body;

        if (!searchTerm || typeof searchTerm !== "string") {
            return res.status(400).json({ message: "SearchTerm is required" });
        }

        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized: Missing user ID" });
        }

        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(sanitizedSearchTerm, "i");

        const contacts = await User.find({
            _id: { $ne: req.userId }, 
            $or: [
                { firstName: { $regex: regex } },
                { lastName: { $regex: regex } },
                { email: { $regex: regex } }
            ]
        });

        return res.status(200).json({ contacts });
    } catch (error) {
        console.error("Error in searchContacts:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getContactsForDMList = async (req, res, next) => {
    try {
        let { userId } = req;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId}, { recipient: userId }],
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId]},
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" },
                },
            },
            {
                $lookup: {
                    from : "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                },
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",                    
                    firstName: "$contactInfo.firstName",                    
                    lastName: "$contactInfo.lastName",                    
                    image: "$contactInfo.image",                    
                    color: "$contactInfo.color",                    
                },
            },
        ]);

        return res.status(200).json({ contacts });
    } catch (error) {
        console.error("Error in searchContacts:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getAllContacts = async (req, res, next) => {
    try {
        const users = await User.find(
            { _id: { $ne: req.userId } },
            "firstName lastName _id"
        );

        const contacts= users.map((user) => ({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id,
        }))

        return res.status(200).json({ contacts });
    } catch (error) {
        console.error("Error in searchContacts:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
