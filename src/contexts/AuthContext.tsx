import { AuthContextType } from "@/types/AuthContext";
import { createContext } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
