
import { Inter } from "next/font/google";
import Navbar from "@/components/custom/navbar";
import AuthContextProvider from "@/global-context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthContextProvider>
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
      </AuthContextProvider>
    </html>
  );
}