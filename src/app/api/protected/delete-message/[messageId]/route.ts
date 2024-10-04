import dbConnect from "@/db/Connect";
import UserModel from "@/models/UserModel";

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    await dbConnect();
    try {
        const messageId = params.messageId;
        const userName = request.headers.get('userName');
        if (userName === '') {
            return Response.json({ type: 'error', message: 'Authentication Failed' });
        }
        const updateResult = UserModel.updateOne({ username: userName }, { $pull: { messages: { _id: messageId } } });
        if((await updateResult).modifiedCount == 0){
            return Response.json({ type: 'error', message: 'Message not found or already deleted.' });
        }
        return Response.json({ type: 'success', message: 'Messages deleted successfully !!' });
    } catch (error) {
        console.log('Error occured on getting messages :' + error);
        return Response.json({ type: 'error', message: 'Something went wrong !' })
    }
}