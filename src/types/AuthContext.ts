
export interface AuthContextType {
    authState : authStateType;
    authAction : (params : authActionType) => void;
  }
export interface authStateType {
    userName: string;
    email: string;
    userToken: number;
    tokenExpiry: Date | null;
  }
  
export interface authActionType {
    type : 'LOGIN' | 'LOGOUT',
    payload : authStateType
  }