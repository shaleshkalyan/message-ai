"use client";

import { userMessageValidation } from "@/app/schema/userMessage";
import { useToast } from "@/hooks/use-toast";
import { MessageType } from "@/models/MessageModel";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
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

  const fetchAllMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`api/get-messages`);
      let userMessages = response.data.userAllMessages ? response.data.userAllMessages : [];
      setMessages(userMessages);
      if(refresh){
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
  }, [setIsLoading, setMessages]);

  
  useEffect(() => {
    fetchAllMessages();
    fetchAcceptMessage();
  }, [setValue, fetchAcceptMessage, fetchAllMessages])
  
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`api/accept-messages`, {
        acceptingmessages : !isAcceptMessages
      });
      setValue('acceptMessages', !isAcceptMessages);
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

  return <div></div>;
};

export default Dashboard;
