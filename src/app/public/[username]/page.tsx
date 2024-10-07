"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, CopyIcon, MailPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageValidation } from "@/app/schema/message";
export interface aiResponseType {
  type: "success" | "error" | "warning";
  message: string;
}

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const initialMessageResponse: aiResponseType = {
    type: "success",
    message:
      "What's your favorite movie?||Do you have any pets?||What's your dream job?",
  };
  const form = useForm<z.infer<typeof messageValidation>>({
    resolver: zodResolver(messageValidation),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
    toast({
      title: "success",
      description: "Message added to text area !",
    });
  };

  const getAllMessages = (messageString: string): string[] => {
    return messageString.split("||");
  };

  const [completion, setCompletion] = useState<aiResponseType>(
    initialMessageResponse
  );
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageValidation>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });
      if (response.data.type === "success") {
        toast({
          title: response.data.type,
          description: response.data.message,
        });
        form.reset({ ...form.getValues(), content: "" });
      } else {
        toast({
          title: response.data.type,
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/suggest-messages",
        {}
      );
      setCompletion({
        type: response.data.type,
        message: response.data.message,
      });
      if (response.data.type === "success") {
        toast({
          title: response.data.type,
          description: "Messges generated from AI.",
        });
      } else {
        toast({
          title: response.data.type,
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to get messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const copyToClipboard = (data: string) => {
    navigator.clipboard.writeText(data);
    toast({
      title: "Message Copied!",
      description: "Data has been copied to clipboard.",
    });
  };
  return (
    <div className="container mx-auto my-8 p-6 rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Slide into the {username}'s DM
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none text-accent-foreground bg-accent"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-accent text-accent-foreground"
                disabled={isLoading || !messageContent}
              >
                Send
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button
              size="sm"
              variant={"outline"}
              onClick={fetchSuggestedMessages}
              className="my-4 bg-accent text-accent-foreground"
              disabled={isLoading}
            >
              Get messages from AI
            </Button>
          )}
          <p>Click on icon below to select message.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {completion.type === "error" ? (
              <div className="flex flex-row justify-between">
                <Textarea
                  disabled
                  className="text-red-800"
                  value={completion.message}
                />
                <Button
                  className="m-2"
                  variant="destructive"
                  size="sm"
                  onClick={() => copyToClipboard(completion.message)}
                >
                  Copy
                </Button>
              </div>
            ) : (
              getAllMessages(completion.message).map((message, index) => (
                <div className="flex flex-col justify-center items-center md:flex-row">
                  <input
                    type="text"
                    value={message}
                    disabled
                    className="input input-bordered w-full p-2 mr-2"
                  />
                  <div className="flex flex-row">
                    <Button
                      variant={"outline"}
                      className="m-2"
                      size="sm"
                      onClick={() => handleMessageClick(message)}
                    >
                      <MailPlus />
                    </Button>
                    <Button
                      className="m-2"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(message)}
                    >
                      <CopyIcon />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <Link href={"/sign-up"}>
          <Button
            className="m-2 bg-accent text-accent-foreground"
            size="sm"
            variant={"outline"}
          >
            Sign up for anonymous messages
          </Button>
        </Link>
      </div>
    </div>
  );
}
