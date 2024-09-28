"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import { initialAuthState } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuthContext } from "@/hooks/UseAuth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Navbar = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  let { authState, authAction } = useAuthContext();

  const logoutUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/logout`, {});
      toast({
        title: "success",
        description: response.data.message,
        variant: "default",
      });
      if (response.data.type === "success") {
        await authAction({ type: "LOGOUT", payload: initialAuthState });
        router.push(`/login`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const err = axiosError.response?.data.message;
      toast({
        title: "Logout Failed",
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
        {authState.userName ? (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Avatar>
                  <AvatarFallback className="bg-slate-100 text-black">
                    {authState.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <p className="text-sm text-muted-foreground">
                  Welcome, {authState.userName}
                </p>
                <div className="grid gap-2">
                  <Button
                    onClick={logoutUser}
                    className="w-full md:w-auto bg-slate-100 text-black"
                    variant="outline"
                  >
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Button
            className="w-full md:w-auto bg-slate-100 text-black"
            variant={"outline"}
            onClick={() => router.push("/login")}
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
