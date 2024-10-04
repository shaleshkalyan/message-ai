import dbConnect from "@/db/Connect";
import UserModel from "@/models/UserModel";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { otpValue } = await request.json();
        const userName = request.headers.get('userName');
        const userToken = request.headers.get('userToken');
        if (userName === '') {
            return Response.json({ type: 'error', message: 'Authentication Failed' });
        }
        const data = await UserModel.findOne({ username: userName });
        if (otpValue === data.token && data.token == userToken) {
            return Response.json({ type: 'success', message: 'User Verified' });
        }
        return Response.json({ type: 'error', message: 'Incorrect OTP' });
    } catch (error) {
        console.log('Error occured on verification :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !!!' })
    }
}