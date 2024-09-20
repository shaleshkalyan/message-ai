import dbConnect from "@/db/Connect";
import { getSession, setSession, unSetSession } from "@/lib/Session";
import UserModel from "@/models/UserModel";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { acceptingmessages } = await request.json();
        const {userName, email, userToken} = getSession();
        const updated = await UserModel.findOneAndUpdate({username : userName }, { isAcceptingMessage: acceptingmessages }, { new: true });
        if (!updated) {
            return Response.json({ type: 'error', message: 'Status updation Failed' });
        }
        unSetSession();
        setSession({userName, email, userToken : updated.userToken});
        return Response.json({ type: 'success', message: 'Status updated successfully !!' });
    } catch (error) {
        console.log('Error occured on changing status :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !' })
    }
}