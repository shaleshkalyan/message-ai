import { MessageType } from "@/models/MessageModel"
import { authStateType } from "./AuthContext"

export interface ApiResponse {
    type : 'success' | 'error' | 'warning',
    message : string,
    isAcceptingMessage?: boolean,
    userData ?: authStateType,
    data?: object,
    userAllMessages ?: MessageType[]
}