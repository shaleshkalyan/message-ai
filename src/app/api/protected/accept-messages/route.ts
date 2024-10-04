import dbConnect from "@/db/Connect";
import UserModel from "@/models/UserModel";
import { initialAuthState } from "@/providers/AuthProvider";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { userName, acceptingmessages } = await request.json();
        const updated = await UserModel.findOneAndUpdate({ username: userName }, { isAcceptingMessage: acceptingmessages }, { new: true });
        if (!updated) {
            return Response.json({ type: 'error', message: 'Status updation Failed' });
        }
        return Response.json({ type: 'success', message: 'Status updated successfully !!' });
    } catch (error) {
        console.log('Error occured on changing status :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !' })
    }
}


export async function GET(request: Request) {
    await dbConnect();
    try {
        const user = request.headers.get('authorization');
        let userData = initialAuthState;
        if(user !== null){
            userData = JSON.parse(user);
        }
        const foundUser = await UserModel.findOne({ username: userData?.userName });
        if (!foundUser) {
            return Response.json({ type: 'error', message: 'User Not Found' });
        }
        return Response.json({ type: 'success', message: 'Status retrieved successfully !!', isAcceptingMessage : foundUser.isAcceptingMessage });
    } catch (error) {
        console.log('Error occured on fetching status :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !' })
    }
}