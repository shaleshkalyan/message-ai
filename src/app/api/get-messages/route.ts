import { MessageSchema, MessageType } from './../../../models/MessageModel';
import dbConnect from "@/db/Connect";
import UserModel from "@/models/UserModel";
import { getSession } from "@/lib/Session";

export async function GET(){
    await dbConnect();
    try {
        const {userName, email, userToken} = getSession();
        if (userName === '' || email === '' || userToken === 0) {
            return Response.json({ type: 'error', message: 'Authentication Failed' });
        }
        const messages : MessageType[] = await UserModel.aggregate([
            {$match : { username : userName}},
            {$unwind : '$messages'},
            {$sort : {'messages.createdAt' : -1}},
            {$group : { _id : '$_id', messages : {$push : '$messages'}}}
        ]);
        return Response.json({ type: 'success', message: 'Messages retrieved successfully !!', userAllMessages : messages });
    } catch (error) {
        console.log('Error occured on getting messages :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !' })
    }
}