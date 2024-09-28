"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import AuthContextProvider, {
  useAuthContext,
} from "@/global-context/AuthProvider";
import { Avatar, AvatarFallback } from "../ui/avatar";

const Navbar = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  let { sessionData, setSessionData } = useAuthContext();
  const logoutUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/logout`, {});
      toast({
        title: "success",
        description: response.data.message,
        variant: "default",
      });
      setSessionData(null);
      router.replace(`/login`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const err = axiosError.response?.data.message;
      toast({
        title: "SignUp Failed",
        description: err,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Undercover Words
        </a>
        {sessionData?.userName ? (
          <>
            <span className="mr-4">Welcome, {sessionData?.userName}</span>
            <Avatar>
              <AvatarFallback>{sessionData?.email.substring(0,1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button
              onClick={logoutUser}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            className="w-full md:w-auto bg-slate-100 text-black"
            variant={"outline"}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </>
            ) : (
              "Login"
            )}
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
