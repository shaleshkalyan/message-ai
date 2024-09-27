import dbConnect from "@/db/Connect";
import { setSession } from "@/lib/Session";
import UserModel from "@/models/UserModel";
import bcrypt from "bcryptjs";
import { verificationEmail } from "@/helpers/VerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        let correctPassword = false;
        const { username, password } = await request.json();
        const userExists = await UserModel.findOne({ username });
        if (userExists) {
            correctPassword = await bcrypt.compare(password, userExists.password);
        }
        if (correctPassword == true) {
            const userToken = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const tokenExpiry = new Date();
            tokenExpiry.setHours(tokenExpiry.getHours() + 1);
            const update = {
                token: userToken,
                tokenExpiredTill: tokenExpiry
            }
            verificationEmail({userName : username, email : userExists.email, otp : userToken});
            const updated = await UserModel.updateOne({ username }, update);
            if (updated) {
                setSession({ userName: username, email : userExists.email, userToken });
                return Response.json({ type: 'success', message: 'User Logged In Successfully !!', data: { user: userExists, token: userToken } })
            }
            return Response.json({ type: 'error', message: 'Something went wrong' });
        }
        return Response.json({ type: 'error', message: 'Invalid email OR Incorrect Password ' })
    } catch (error) {
        console.log('Error occured on login :' + error);
        return Response.json({ type: 'error', message: 'Login Failed' })
    }

}

