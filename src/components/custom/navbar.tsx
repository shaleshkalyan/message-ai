"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

const Navbar = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const userName = '';
//   const { userName, email, userToken } = getSession();
  const logoutUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/logout`, {});
      toast({
        title: "success",
        description: response.data.message,
        variant: "default",
      });
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
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between item-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Mystery Message
        </a>
        {userName !== '' ? (
          <>
            <span className="mr-4">Welcome {userName}</span>
            {/* <Avtar/> */}
            <Button className="w-full md:w-auto" onClick={logoutUser}>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button className="w-full md:w-auto">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
