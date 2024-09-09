import mongoose, {Schema, Document} from "mongoose";
import { MessageType, MessageSchema } from "./MessageModel";

export interface UserType extends Document {
    username : string,
    email : string,
    password : string,
    token : string,
    tokenExpiredTill : Date,
    isAcceptingMessage : boolean,
    messages : MessageType[]
}

const UserSchema : Schema<UserType> = new Schema({
    username : {
        type : String,
        required : [true, "User Name is required"],
        trim : true,
        unique : true
    },
    email : {
        type : String,
        required : [true, "User email is required"],
        unique : true
    },
    password : {
        type : String,
        required : [true, "Password is required"],
    },
    token : {
        type : String,
        default : null,
    },
    tokenExpiredTill : {
        type : Date,
    },
    isAcceptingMessage : {
        type : Boolean,
        default : false
    },
    messages :[MessageSchema]
});
const UserModel = (mongoose.models.User as mongoose.Model<UserType> || mongoose.model<UserType>("User", UserSchema));
export default UserModel;