import { MessageType } from "@/models/MessageModel";

export interface MessageCardProps {
    message : MessageType,
    onDelete : (id: string) => void
}