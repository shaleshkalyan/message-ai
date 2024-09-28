"use client";

import React, { createContext, useContext, useReducer } from "react";
import {
  authActionType,
  AuthContextType,
  authStateType,
} from "@/types/AuthContext";

export const initialAuthState: authStateType = {
  userName: "",
  email: "",
  userToken: 0,
  tokenExpiry: null,
};

const authReducer = (
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
      return initialAuthState;
    default:
      return state;
  }
};

const [latestState, dispatch] = useReducer(authReducer, initialAuthState);
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const handleAuth = ({
  type: action,
  payload: currrentState = initialAuthState,
}: authActionType) => {
  dispatch({ type: action, payload: currrentState });
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { Provider: AuthContextProvider } = AuthContext;
  return (
    <AuthContextProvider
      value={{ authState: latestState, authAction: handleAuth }}
    >
      {children}
    </AuthContextProvider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
