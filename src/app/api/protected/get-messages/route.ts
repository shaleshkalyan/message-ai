import dbConnect from "@/db/Connect";
import UserModel from "@/models/UserModel";
import { initialAuthState } from "@/providers/AuthProvider";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const user = request.headers.get('authorization');
        let userDetails = initialAuthState;
        if (user !== null) {
            userDetails = JSON.parse(user);
        }
        if (userDetails?.userName === '') {
            return Response.json({ type: 'error', message: 'Authentication Failed' });
        }
        const userData = await UserModel.aggregate([
            { $match: { username: userDetails?.userName } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]).exec();
        if (!userData || userData.length === 0) {
            return Response.json({ type: 'error', message: 'User not found.' });
        }
        return Response.json({ type: 'success', message: 'Messages retrieved successfully !!', userAllMessages: userData[0].messages });
    } catch (error) {
        console.log('Error occured on getting messages :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !' })
    }
}