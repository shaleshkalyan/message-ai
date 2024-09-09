import dbConnect from "@/db/Connect";
import { getSession, setSession, unSetSession } from "@/libs/Session";
import UserModel from "@/models/UserModel";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { acceptingmessages } = await request.json();
        const userData = getSession();
        if (!userData) {
            return Response.json({ type: 'error', message: 'Authentication Failed' });
        }
        const updated = await UserModel.findByIdAndUpdate(userData._id, { isAcceptingMessage: acceptingmessages }, { new: true });
        if (!updated) {
            return Response.json({ type: 'error', message: 'Status updation Failed' });
        }
        unSetSession();
        setSession(updated);
        return Response.json({ type: 'success', message: 'Status updated successfully !!' });
    } catch (error) {
        console.log('Error occured on changing status :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !' })
    }
}