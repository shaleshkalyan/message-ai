import dbConnect from "@/db/Connect";
import { resend } from "@/lib/Resend";
import { setSession } from "@/lib/Session";
import UserModel from "@/models/UserModel";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { VerificationEmail } from "../../../../emails/VerificationEmail";

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
            // const { data, error } = await resend.emails.send({
            //     from: 'shaleshkalyan123@gmail.com',
            //     to: [userExists.email],
            //     subject: 'Login OTP [Mystery Message]',
            //     react: VerificationEmail({ userName: username, otp: userToken }),
            // });
            // if (error) {
            //     console.log(error);
            //     return Response.json({ type: 'error', message: ' Error sending OTP' });
            // }
            const updated = await UserModel.updateOne({ username }, update);
            if (updated) {
                setSession({ userName: username, userToken: userToken });
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

