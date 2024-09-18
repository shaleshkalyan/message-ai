export interface ApiResponse {
    type : 'success' | 'error' | 'warning',
    message : string,
    isAcceptingMessage?: boolean,
    data ?: object
}