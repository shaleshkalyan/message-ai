"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SignUpValidation } from "@/app/schema/signUp";
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

const SignUpForm = (): React.ReactNode => {
  const [userName, setUserName] = useState<String>("");
  const [message, setMessage] = useState<String>("");
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const debounced = useDebounceCallback(setUserName, 300);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<zod.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    const verifyUniqueUserName = async () => {
      setMessage("");
      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-unique-username?user=${debounced}`
        );
        setMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setMessage("Error checking username");
      } finally {
        setIsLoading(false);
      }
    };
    // verifyUniqueUserName();
  // }, [useDebounceValue]);
  }, []);
  const submitForm = async (formData: zod.infer<typeof SignUpValidation>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`, formData);
      toast({
        title: "success",
        description: response.data.message,
      });
      router.replace(`/get-messages`);
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
    <div className="flex justify-center items-center min-h-screen bg-grey-100">
      <div className="wfull max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
          Join Mystery Message
        </h1>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">
          Sign up to start your anonymous adventure
        </h2>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitForm)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="User Name"
                        {...field}
                        onChange={(e) => {
                          e.preventDefault();
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
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
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <p>
              Already a member ? {' '} <Link href="login" className="text-blue-600 hover:text-blue-800">
              Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpForm;
