"use client";

import { userMessageValidation } from "@/app/schema/userMessage";
import MessageCard from "@/components/custom/messageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { MessageType } from "@/models/MessageModel";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Bell } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
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
      const response = await axios.get<ApiResponse>(`api/accept-messages`);
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
        const response = await axios.get<ApiResponse>(`api/get-messages`);
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
      const response = await axios.post<ApiResponse>(`api/accept-messages`, {
        acceptingmessages: !isAcceptMessages,
      });
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
  };
  const userMessages = [
    {
      content: "first message",
      createdAt: '2024-09-23',
    },
    {
      content: "second message",
      createdAt: '2024-09-24',
    },
    {
      content: "third message",
      createdAt: '2024-09-25',
    },
  ];
  return (
    <main className="my-8 flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:gap-8 lg:grid-rows-2 xl:grid-rows-3">
        <div className="mb-4">
          <Switch
            {...register("acceptMessages")}
            checked={isAcceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accepting Messages : {isAcceptMessages ? "On" : "Off"}
          </span>
        </div>
        <Separator />
        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => fetchAllMessages(true)}>
          <Bell className="h-4 w-4" />
        </Button>
        <div className="grid w-full flex-4 gap-6 lg:max-w-[20rem]">
          {userMessages.map((messageData, index) => (
            <MessageCard
              key={index}
              message={messageData}
              onDelete={handleDeleteMessage}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
