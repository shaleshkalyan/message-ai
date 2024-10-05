"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2, MoonIcon, SunIcon } from "lucide-react";
import { initialAuthState } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuthContext } from "@/hooks/UseAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";

const Navbar = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  let { authState, authAction } = useAuthContext();
  const [themeMode, setThemeMode] = useState<"light" | "dark">(authState.theme);

  const toggleTheme = async () => {
    setThemeMode(themeMode === "dark" ? "light" : "dark");
    // Update authState directly without creating a copy
    authState.theme = themeMode;
    authAction({ type: "THEME", payload: authState });
    document.body.classList.toggle("dark");
  };
  const logoutUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        `/api/protected/logout`,
        {},
        {
          headers: {
            Authorization: JSON.stringify(authState),
          },
        }
      );
      toast({
        title: "success",
        description: response.data.message,
        variant: "default",
      });
      if (response.data.type === "success") {
        authAction({ type: "LOGOUT", payload: initialAuthState });
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
    <nav className="shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0 ml-2">
          Mystery Inbox
        </a>
        <div className="flex flex-col md:flex-row justify-between items-center mr-2">
          <div className="m-2 p-4 flex justify-center items-center">
            <Switch
              className="space-x-2"
              checked={themeMode === "light"}
              onCheckedChange={toggleTheme}
            />
            {themeMode === "light" ? (
              <SunIcon size={24} />
            ) : (
              <MoonIcon size={24} />
            )}
          </div>
          {authState.userName ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarFallback>
                      {authState.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="h-8">
                        Profile
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem className="h-5">
                            <span className="text-sm font-bold">
                              Username :{" "}
                            </span>
                            {authState.userName}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="h-5">
                            <span className="text-sm font-bold">Email : </span>
                            {authState.email}
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button
                      size="icon"
                      className="w-full text-sm h-5"
                      variant={"ghost"}
                      onClick={logoutUser}
                    >
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              className="w-full md:w-auto"
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
      </div>
    </nav>
  );
};

export default Navbar;
