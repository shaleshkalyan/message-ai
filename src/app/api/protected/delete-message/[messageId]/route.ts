import dbConnect from "@/db/Connect";
import UserModel from "@/models/UserModel";
import { initialAuthState } from "@/providers/AuthProvider";

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    await dbConnect();
    try {
        const messageId = params.messageId;
        const user = request.headers.get('authorization');
        let userData = initialAuthState;
        if (user !== null) {
            userData = JSON.parse(user);
        }
        if (userData?.userName === '') {
            return Response.json({ type: 'error', message: 'Authentication Failed' });
        }
        const updateResult = UserModel.updateOne({ username: userData?.userName }, { $pull: { messages: { _id: messageId } } });
        if ((await updateResult).modifiedCount == 0) {
            return Response.json({ type: 'error', message: 'Message not found or already deleted.' });
        }
        return Response.json({ type: 'success', message: 'Messages deleted successfully !!' });
    } catch (error) {
        console.log('Error occured on getting messages :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !' })
    }
}