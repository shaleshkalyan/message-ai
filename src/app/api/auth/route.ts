import dbConnect from "@/db/Connect";
import { getSession } from "@/lib/Session";
import UserModel from "@/models/UserModel";

export async function POST()
{
    await dbConnect();
    try {
        const {userName, email, userToken} = getSession();
        if (userName === '' || email === '' || userToken === 0) {
            return Response.json({ type: 'error', message : 'Session expired Please login again...'})  
        }
        const userExists = await UserModel.findOne({ token : userToken, username : userName});
        if(userExists){
            return Response.json({ type: 'success', message : 'User Authenticated !!'});
        }
        return Response.json({ type: 'error', message : 'Invalid User'})
    } catch (error) {
        console.log('Error occured on authentication :' + error);
        return Response.json({ type : 'error', message : 'Authentication Failed'})
    }   
}

