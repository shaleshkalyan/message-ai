export interface ApiResponse {
    type : string,
    message : string,
    isAcceptingMessage?: boolean,
    data ?: object
}