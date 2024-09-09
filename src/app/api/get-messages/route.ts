import dbConnect from "@/db/Connect";
import UserModel from "@/models/UserModel";
import { getSession } from "@/libs/Session";
import mongoose from "mongoose";

export async function GET(){
    await dbConnect();
    try {
        const userData = getSession();
        if (!userData) {
            return Response.json({ type: 'error', message: 'Authentication Failed' });
        }
        const userId = new mongoose.Types.ObjectId(userData._id);
        const messages = await UserModel.aggregate([
            {$match : { id : userId}},
            {$unwind : '$messages'},
            {$sort : {'messages.createdAt' : -1}},
            {$group : { _id : '$_id', messages : {$push : '$messages'}}}
        ]);
        return Response.json({ type: 'success', message: 'Messages retrieved successfully !!', data : messages });
    } catch (error) {
        console.log('Error occured on getting messages :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !' })
    }
}