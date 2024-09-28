import { AuthContext } from "@/contexts/AuthContext";
import { AuthContextType } from "@/types/AuthContext";
import { useContext } from "react";

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};