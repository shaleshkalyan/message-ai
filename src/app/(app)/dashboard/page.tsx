"use client";

import { userMessageValidation } from "@/app/schema/userMessage";
import MessageCard from "@/components/custom/messageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/hooks/UseAuth";
import { MessageType } from "@/models/MessageModel";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Bell, Loader2, CopyIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  let { authState } = useAuthContext();
  const [messages, setMessages] = useState<MessageType[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { register, watch, setValue } = useForm({
    resolver: zodResolver(userMessageValidation),
  });

  const isAcceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        `api/protected/accept-messages`,
        {
          headers: {
            Authorization: JSON.stringify(authState),
          },
        }
      );
      setValue("acceptMessages", response.data.isAcceptingMessage);
      toast({
        title: "success",
        description: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const err = axiosError.response?.data.message;
      toast({
        title: "Message Retrieval Failed",
        description: err,
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchAllMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>(
          `api/protected/get-messages`,
          {
            headers: {
              Authorization: JSON.stringify(authState),
            },
          }
        );
        let userMessages = response.data.userAllMessages
          ? response.data.userAllMessages
          : [];
        setMessages(userMessages);
        if (refresh) {
          toast({
            title: "success",
            description: response.data.message,
            variant: "default",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const err = axiosError.response?.data.message;
        toast({
          title: "Message Retrieval Failed",
          description: err,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    fetchAllMessages();
    fetchAcceptMessage();
  }, [setValue, fetchAcceptMessage, fetchAllMessages]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        `api/protected/accept-messages`,
        {
          userName: authState.userName,
          acceptingmessages: !isAcceptMessages,
        },
        {
          headers: {
            Authorization: JSON.stringify(authState),
          },
        }
      );
      setValue("acceptMessages", !isAcceptMessages);
      toast({
        title: "success",
        description: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const err = axiosError.response?.data.message;
      toast({
        title: "Status updation Failed",
        description: err,
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const profileUrl = `${baseUrl}public/${authState.userName}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full max-w-6xl">
      <div className="mb-4 container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">
            Want to get anonymous messages? Just share your link!
          </h2>{" "}
          <div className="flex flex-row items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button
              size="sm"
              variant={"outline"}
              onClick={copyToClipboard}
            >
              <CopyIcon />
            </Button>
          </div>
        </div>
        <div className="mb-4 p-4 flex flex-col justify-center items-center">
          <span className="ml-2">
            Accept Messages: {isAcceptMessages ? "On" : "Off"}
          </span>
          <Switch
            className="space-x-2"
            {...register("acceptMessages")}
            checked={isAcceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
        </div>
      </div>

      <Separator />
      <Button
        size="sm"
        variant={"outline"}
        className="m-4"
        onClick={(e) => {
          e.preventDefault();
          fetchAllMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {messages.length > 0 ? (
          messages.map((messageData, index) => (
            <MessageCard
              key={
                typeof messageData._id === "string"
                  ? messageData._id
                  : undefined
              }
              message={messageData}
              onDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
