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
    <title>Verification Email</title>
    <Heading>Welcome, {userName}!</Heading>
    <Preview> To verify yourself, Your 4 digit OTP is :</Preview>
    <Text>{otp}</Text>
    <Text>If request is not raised by you, Please ignore.</Text>
  </div>
);
