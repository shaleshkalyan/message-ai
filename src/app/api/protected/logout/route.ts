import dbConnect from "@/db/Connect";
import { unSetSession } from "@/lib/Session";

export async function POST(request: Request) {
    await dbConnect();
    try {
        unSetSession();
        return Response.json({ type: 'success', message: 'User Logged out Successfully !!' });
    } catch (error) {
        console.log('Error occured on logout :' + error);
        return Response.json({ type: 'error', message: 'Logout Failed' })
    }

}