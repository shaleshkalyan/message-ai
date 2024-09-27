"use client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { MouseEventHandler, useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Verify = (): React.ReactNode => {
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const submitOtp: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-user`, {
        otpValue: otp,
      });
      toast({
        title: "success",
        description: response.data.message,
      });
      if (response.data.type === "success") {
        router.replace(`/dashboard`);
      } else {
        router.replace(`/login`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const err = axiosError.response?.data.message;
      toast({
        title: "Verification Failed",
        description: err,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="wfull max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div>
          <div className="text-center text-sm">
            Please enter your one-time password.
          </div>
          <div className="space-y-2">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup className="rounded-lg bg-gray-600 text-white">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <div className="flex justify-center text-center text-sm">
              <Button
                type="button"
                onClick={submitOtp}
                className="bg-gray-800 hover:bg-blue-900"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Submit OTP"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Verify;
