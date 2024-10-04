import dbConnect from "@/db/Connect";
import UserModel from "@/models/UserModel";
import { initialAuthState } from "@/providers/AuthProvider";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { otpValue } = await request.json();
        const user = request.headers.get('authorization');
        let userData = initialAuthState ;
        if(user !== null){
            userData = JSON.parse(user);
        }
        if (userData?.userName === '') {
            return Response.json({ type: 'error', message: 'Authentication Failed' });
        }
        const data = await UserModel.findOne({ username: userData?.userName });
        if (otpValue === data.token && data.token == userData?.userToken) {
            return Response.json({ type: 'success', message: 'User Verified' });
        }
        return Response.json({ type: 'error', message: 'Incorrect OTP' });
    } catch (error) {
        console.log('Error occured on verification :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !!!' })
    }
}