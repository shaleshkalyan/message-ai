import * as React from "react";
import { Heading, Preview, Text } from "@react-email/components";

interface EmailTemplateProps {
  userName: string;
  otp: number;
}

export const VerificationEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  userName,
  otp,
}) => (
  <div>
    <title>Two step authentication required</title>
    <Heading>Welcome, {userName}!</Heading>
    <Preview> Your 6 digit login OTP is :</Preview>
    <Text>{otp}</Text>
    <Text>If request is not raised by you, Please ignore.</Text>
    <Text>Thanks,</Text>
    <Text>Mystery Inbox</Text>
  </div>
);
