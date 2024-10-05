
export interface AuthContextType {
  authState: authStateType;
  authAction: (params: authActionType) => void;
}
export interface authStateType {
  userName: string;
  email: string;
  userToken: number;
  tokenExpiry: Date | null;
  theme: "light" | "dark";
}

export interface authActionType {
  type: 'LOGIN' | 'LOGOUT' | "THEME",
  payload: authStateType
}