import dbConnect from "@/db/Connect";
import UserModel from "@/models/UserModel";

export async function GET(request:Request)
{
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const userName = searchParams.get('user');
        const userNameExists = await UserModel.findOne({username: userName});
        if(userNameExists){
            return Response.json({ type: 'success', message : 'Username is already taken', data : false});
        }
        return Response.json({ type: 'success', message : 'Username is unique', data : true})
    } catch (error) {
        console.log('Error occured on registration :' + error);
        return Response.json({ type : 'error', message : 'Something went wrong !!'})
    }
    
}