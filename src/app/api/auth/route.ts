import dbConnect from "@/db/Connect";
import { getSession, userSessionType } from "@/libs/Session";
import UserModel from "@/models/UserModel";

export async function POST()
{
    await dbConnect();
    try {
        const userData : userSessionType = getSession();
        if (!userData) {
            return Response.json({ type: 'error', message : 'Session expired Please login again...'})  
        }
        const userExists = await UserModel.findOne({ token : userData.token, email : userData.email});
        if(userExists){
            return Response.json({ type: 'success', message : 'User Authenticated !!'});
        }
        return Response.json({ type: 'error', message : 'Invalid User'})
    } catch (error) {
        console.log('Error occured on authentication :' + error);
        return Response.json({ type : 'error', message : 'Authentication Failed'})
    }   
}

