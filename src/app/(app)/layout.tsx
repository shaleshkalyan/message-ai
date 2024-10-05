"use client"

import { useAuthContext } from "@/hooks/UseAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { authState } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (authState.userToken == 0 || authState.userName == "") {
      router.push(`/login`);
    }
  }, []);
  return (
    <>
      {children}
    </>
  );
}
