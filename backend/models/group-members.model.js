import mongoose from "mongoose";
const groupMembersModel =new mongoose.Schema(
    {
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Group",
        },
        memberId: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        role: {
            type: String,
            enum: ['member', 'admin'],
            default: 'member',
        },
    },  
    {
        timestamps: true,
    }
);
export const GroupMembers = mongoose.model("GroupMembers", groupMembersModel);  