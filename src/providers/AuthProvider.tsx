"use client";

import React, { useReducer } from "react";
import {
  authActionType,
  authStateType,
} from "@/types/AuthContext";
import { AuthContext } from "../contexts/AuthContext";
import { authReducer } from "@/reducers/AuthReducer";

export const initialAuthState: authStateType = {
  userName: "",
  email: "",
  userToken: 0,
  tokenExpiry: null,
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [latestState, dispatch] = useReducer(authReducer, initialAuthState);
  const { Provider: AuthContextProvider } = AuthContext;
  const handleAuth = ({
    type: action,
    payload: currrentState = initialAuthState,
  }: authActionType) => {
    dispatch({ type: action, payload: currrentState });
  };
  return (
    <AuthContextProvider
      value={{ authState: latestState, authAction: handleAuth }}
    >
      {children}
    </AuthContextProvider>
  );
};
