import dbConnect from "@/db/Connect";
import { getSession } from "@/lib/Session";
import UserModel from "@/models/UserModel";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { otpValue } = await request.json();
        const { userName, userToken } = getSession();
        const data = await UserModel.findOne({ username: userName });
        if (otpValue === data.token && Number(data.token) === userToken) {
            return Response.json({ type: 'success', message: 'User Verified' });
        }
        return Response.json({ type: 'error', message: 'Incorrect OTP' });
    } catch (error) {
        console.log('Error occured on verification :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !!!' })
    }
}