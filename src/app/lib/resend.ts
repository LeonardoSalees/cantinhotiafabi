import { ReactNode } from 'react';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type DataEmailResendProps = {
    to: string, 
    subject: string, 
    react: ReactNode
}

export const sendEmail = ({to, subject, react}: DataEmailResendProps) =>{
    const email = resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject,
        react
      });
    return email
}
