"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { LoginValidation } from "@/app/schema/login";
import { useAuthContext } from "@/global-context/AuthProvider";

const Login = (): React.ReactNode => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const {sessionData, setSessionData} = useAuthContext();
  const form = useForm<zod.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submitForm = async (formData: zod.infer<typeof LoginValidation>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/login`, formData);
      toast({
        title: "success",
        description: response.data.message,
      });
      const session = response.data?.data;
      setSessionData({ session?.userName,session?.email,session?.userToken,session?.tokenExpiry});
      router.replace(`/verify`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const err = axiosError.response?.data.message;
      toast({
        title: "Login Failed",
        description: err,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md m-2">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Undercover Words!
          </h1>
          <h2 className="pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">
            Are you ready to uncover some hidden secrets?
          </h2>
          <p className="pb-2 border-b mb-4">
            Login Here to see your secret admirer
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="User Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="Password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                size="sm"
                variant={"outline"}
                className="bg-gray-800 text-white"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <p>
            New Member ?{" "}
            <Link href="sign-up" className="text-blue-900 hover:text-gray-800">
              Sign Up Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
