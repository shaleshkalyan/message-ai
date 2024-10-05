import { initialAuthState } from '@/providers/AuthProvider';
import { authActionType, authStateType } from "@/types/AuthContext";

export const authReducer = (
    state: authStateType,
    action: authActionType
): authStateType => {
    switch (action.type) {
        case "LOGIN":
            const { userName, email, userToken, tokenExpiry } = action.payload;
            return {
                ...state,
                userName,
                email,
                userToken,
                tokenExpiry,
            };
        case "LOGOUT":
            return initialAuthState;
        case "THEME":
            const { theme } = action.payload
            return {
                ...state,
                theme
            };
        default:
            return state;
    }
};