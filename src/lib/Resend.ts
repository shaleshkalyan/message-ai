import { Resend } from "resend";

export const resend = new Resend(process.env.NEXT_PUBLIC_EMAIL_API_KEY);