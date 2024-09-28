"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  sessionData: sessionType | null;
  setSessionData: React.Dispatch<React.SetStateAction<sessionType | null>>;
}
interface sessionType {
  userName: string;
  email: string;
  userToken: number;
  tokenExpiry: Date;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<sessionType | null>(null);
  const checkLoggedIn = () => {
    if (!sessionData) {
      router.replace("/login");
    }
  };
  useEffect(() => {
    checkLoggedIn();
  }, [sessionData, router]);
  const { Provider: AuthContextProvider } = AuthContext;
  return (
    <AuthContextProvider value={{ sessionData, setSessionData }}>
      {children}
    </AuthContextProvider>
  );
};

export default AuthContextProvider;

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
