import { authActionType, authStateType } from "@/types/AuthContext";

export const authReducer = (
    state: authStateType,
    action: authActionType
): authStateType => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                userName: action.payload.userName,
                email: action.payload.email,
                userToken: action.payload.userToken,
                tokenExpiry: action.payload.tokenExpiry,
            };
        case "LOGOUT":
            return {
                ...state,
                userName: '',
                email: '',
                userToken: 0,
                tokenExpiry: null,
            };
        default:
            return state;
    }
};