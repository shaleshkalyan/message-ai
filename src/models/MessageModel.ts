import mongoose, {Schema, Document} from "mongoose";

export interface MessageType extends Document {
    content : string,
    createdAt : Date
}

export const MessageSchema : Schema<MessageType> = new Schema({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }
});
const MessageModel = (mongoose.models.Message as mongoose.Model<MessageType> || mongoose.model<MessageType>("UserMessage", MessageSchema));
export default MessageModel;