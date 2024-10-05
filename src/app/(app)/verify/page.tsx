"use client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { MouseEventHandler, useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/hooks/UseAuth";

const Verify = (): React.ReactNode => {
  const { authState } = useAuthContext();
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const submitOtp: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        `api/protected/verify-user`,
        {
          otpValue: otp,
        },
        {
          headers: {
            Authorization: JSON.stringify(authState),
          },
        }
      );
      if (response.data.type === "success") {
        toast({
          title: response.data.type,
          description: response.data.message,
        });
        router.push(`/dashboard`);
      } else {
        toast({
          title: response.data.type,
          description: response.data.message,
          variant: "destructive",
        });
        router.push(`/login`);
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="wfull max-w-md p-8 space-y-8 rounded-lg shadow-md">
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
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSeparator />
                <InputOTPSlot index={1} />
                <InputOTPSeparator />
                <InputOTPSlot index={2} />
                <InputOTPSeparator />
                <InputOTPSlot index={3} />
                <InputOTPSeparator />
                <InputOTPSlot index={4} />
                <InputOTPSeparator />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <div className="flex justify-center text-center text-sm">
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </Button>
              ) : (
                <Button
                  size={"sm"}
                  variant={"outline"}
                  type="button"
                  onClick={submitOtp}
                >
                  Submit OTP
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Verify;
