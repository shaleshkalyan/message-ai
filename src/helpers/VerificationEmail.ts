import { VerificationEmail } from './../../emails/VerificationEmail';
import { resend } from '../lib/Resend'
import { ApiResponse } from '@/types/ApiResponse';

export type emailVerification = {
    userName: string,
    email: string,
    otp: number
}
export async function verificationEmail({ userName, email, otp }: emailVerification): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Mystery Inbox <onboarding@resend.dev>',
            to: [email],
            subject: 'Verification Email',
            react: VerificationEmail({ userName, otp }),
        });
        return { type: 'success', message: 'Email sent successfully!!', data: [] };
    } catch (error) {
        console.log('Error sending email : ' + error);
        return { type: 'error', message: 'Email not sent', data: [] };
    }
}