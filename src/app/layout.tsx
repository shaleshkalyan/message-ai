import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthContextProvider } from "@/providers/AuthProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Undercover Words',
  description: 'The Realm of Anonymous Messaging',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <AuthContextProvider>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </AuthContextProvider>
    </html>
  );
}