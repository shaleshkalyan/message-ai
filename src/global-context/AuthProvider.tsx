'use client';

import { createContext } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const authContext = createContext<boolean>(false);
  return (
    <>
      {children}
    </>
  );
}