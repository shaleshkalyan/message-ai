import { authStateType } from "@/types/AuthContext";
import { cookies } from "next/headers";

export function getSession(): authStateType {
  const session = cookies().get("userSession")?.value;
  if (!session) {
    return {userName : '', email : '', userToken : 0, tokenExpiry : null};
  }
  return JSON.parse(session);
}
export function setSession(userData: authStateType): void {
  // Create the session
  const session = JSON.stringify(userData)
  // Save the session in a cookie
  cookies().set("userSession", session, { httpOnly: true });
}
export function unSetSession(): void {
  // Save the session in a cookie
  cookies().set("userSession", '', { httpOnly: true });
}
