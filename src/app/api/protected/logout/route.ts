import dbConnect from "@/db/Connect";
import UserModel from "@/models/UserModel";
import { initialAuthState } from "@/providers/AuthProvider";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const user = request.headers.get('authorization');
        let userData = initialAuthState;
        if(user !== null){
            userData = JSON.parse(user);
        }
        const updated = await UserModel.findOneAndUpdate({ username: userData?.userName }, { token: null });
        if (!updated) {
            return Response.json({ type: 'error', message: 'Logout action Failed' });
        }
        return Response.json({ type: 'success', message: 'User Logged out Successfully !!' });
    } catch (error) {
        console.log('Error occured on logout :' + error);
        return Response.json({ type: 'error', message: 'Logout Failed' })
    }

}