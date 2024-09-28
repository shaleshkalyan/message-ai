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
import { displayMessage } from "@/types/Messages";
import { TypographyP } from "@/components/ui/typography";

const SignUpForm = (): React.ReactNode => {
  const [userName, setUserName] = useState<String>("");
  const [message, setMessage] = useState<displayMessage>({
    type: "error",
    message: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debounced = useDebounceCallback(setUserName, 500);
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
      setMessage({ type: "error", message: "" });
      if (!userName) return;
      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-unique-username?user=${userName}`
        );
        setMessage({
          type: response.data.type,
          message: response.data.message,
        });
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setMessage({ type: "error", message: "Error checking username" });
      } finally {
        setIsLoading(false);
      }
    };
    if (userName) {
      verifyUniqueUserName();
    }
  }, [userName]);

  const submitForm = async (formData: zod.infer<typeof SignUpValidation>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`, formData);
      if (response.data.type === "success") {
        toast({
          title: "success",
          description: response.data.message,
        });
        router.replace(`/login`);
      } else {
        toast({
          title: response.data.type,
          description: response.data.message,
          variant: "destructive",
        });
      }
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
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md m-2">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Undercover Words!
          </h1>
          <h2 className="pb-2 border-b text-3xl font-semibold tracking-tight first:mt-0 text-center">
            Join us in Undercover Words! Are you excited to explore?
          </h2>
        </div>
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
                          const value = e.target.value;
                          field.onChange(value);
                          debounced(value);
                        }}
                      />
                    </FormControl>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading
                      </>
                    ) : (
                      <TypographyP
                        className={
                          message.type === "success"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {message.message}
                      </TypographyP>
                    )}
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
              <div className="flex justify-center">
                <Button
                  size="sm"
                  variant={"outline"}
                  type="submit"
                  className="bg-gray-800 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <p>
              Already a member ?{" "}
              <Link href="login" className="text-blue-900 hover:text-gray-800">
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
