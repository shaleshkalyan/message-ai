import { MessageType } from './../../../models/MessageModel';
import dbConnect from "@/db/Connect";
import UserModel from "@/models/UserModel";
import { getSession } from "@/libs/Session";
import mongoose from "mongoose";
import { use } from 'react';

export async function POST(request : Request){
    await dbConnect();
    const { userName, content} = await request.json();
    try {
        const userData = await UserModel.findOne({ username : userName})
        if (!userData) {
            return Response.json({ type: 'error', message: 'No User Found.' });
        }
        if (!userData.isAcceptingMessage) {
            return Response.json({ type: 'error', message: 'User is not accepting messages right now.' });
        }
        const message = { content, createdAt : new Date()};
        userData.messages.push(message as MessageType);
        await userData.save();
        return Response.json({ type: 'success', message: 'Messages sent successfully !!'});
    } catch (error) {
        console.log('Error occured on getting messages :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !' })
    }
}