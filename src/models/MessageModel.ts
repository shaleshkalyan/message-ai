import mongoose, { Schema, Document } from "mongoose";

export interface MessageType extends Document {
    content: string;
    createdAt: Date;
}

export const MessageSchema: Schema<MessageType> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// Check if the model already exists, otherwise define it
const MessageModel = mongoose.models.Message || mongoose.model<MessageType>("Message", MessageSchema);

export default MessageModel;