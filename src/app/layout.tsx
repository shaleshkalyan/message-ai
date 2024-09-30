import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthContextProvider } from "@/providers/AuthProvider";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mystery Inbox",
  description: "The Realm of Anonymous Messaging",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <AuthContextProvider>
        <body className={inter.className}>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </body>
      </AuthContextProvider>
    </html>
  );
}
