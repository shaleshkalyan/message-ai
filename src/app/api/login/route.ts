import dbConnect from "@/db/Connect";
import { setSession } from "@/libs/Session";
import UserModel from "@/models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(request:Request)
{
    await dbConnect();
    try {
        let correctPassword = false;
        const { email, password } = await request.json();
        const emailExists = await UserModel.findOne({ email : email});
        if (emailExists) {
            correctPassword = await bcrypt.compare(password, emailExists.password); 
        }
        if(correctPassword ==  true){
            const userToken = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const tokenExpiry = new Date();
            tokenExpiry.setHours(tokenExpiry.getHours() + 1);
            const update = {
                token : userToken,
                tokenExpiredTill : tokenExpiry
            }
            const updated = await UserModel.updateOne({ email : email}, update);
            if (updated) {
                setSession(updated);
                return Response.json({ type: 'success', message : 'User Logged In Successfully !!', data : {user : emailExists, token : userToken}}) 
            }
            return Response.json({ type: 'error', message : 'Something went wrong'});
        }
        return Response.json({ type: 'error', message : 'Invalid email OR Incorrect Password '})
    } catch (error) {
        console.log('Error occured on login :' + error);
        return Response.json({ type : 'error', message : 'Login Failed'})
    }
    
}

