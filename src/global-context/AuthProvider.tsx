"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { cookies } from "next/headers";

interface AuthContextType {
  session: sessionType | null;
  checkLoggedIn: Function;
}
interface sessionType {
  userName: string;
  email: string;
  userToken: number;
  sessionExpiry: Date;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  checkLoggedIn: () => {},
});

const router = useRouter();
const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<sessionType | null>(null);
  const checkLoggedIn = () => {
    useEffect(() => {
      const sessionData = cookies().get("userSession")?.value;
      if (sessionData) {
        let data = JSON.parse(sessionData);
        setSession(data);
      } else {
        router.push("/login");
      }
    }, []);
  };
  const { Provider: AuthContextProvider } = AuthContext;
  return (
    <AuthContextProvider value={{ session, checkLoggedIn }}>
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
