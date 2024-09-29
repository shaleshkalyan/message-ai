import dbConnect from "@/db/Connect";
import { getSession, setSession, unSetSession } from "@/lib/Session";
import UserModel from "@/models/UserModel";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { acceptingmessages } = await request.json();
        const { userName, email, userToken, tokenExpiry } = getSession();
        const updated = await UserModel.findOneAndUpdate({ username: userName }, { isAcceptingMessage: acceptingmessages }, { new: true });
        if (!updated) {
            return Response.json({ type: 'error', message: 'Status updation Failed' });
        }
        unSetSession();
        setSession({ userName, email, userToken, tokenExpiry });
        return Response.json({ type: 'success', message: 'Status updated successfully !!' });
    } catch (error) {
        console.log('Error occured on changing status :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !' })
    }
}


export async function GET(request: Request) {
    await dbConnect();
    try {
        const { userName, email, userToken } = getSession();
        const foundUser = await UserModel.findOne({ username: userName });
        if (!foundUser) {
            return Response.json({ type: 'error', message: 'User Not Found' });
        }

        return Response.json({ type: 'success', message: 'Status retrieved successfully !!', isAcceptingMessage : foundUser.isAcceptingMessage });
    } catch (error) {
        console.log('Error occured on fetching status :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !' })
    }
}