import { cookies } from "next/headers";

export interface sessionType {
  userName : string,
  email : string,
  userToken : number
}

export function getSession(): sessionType {
  const session = cookies().get("userSession")?.value;
  if (!session) {
    return {userName : '', email : '', userToken : 0};
  }
  return JSON.parse(session);
}
export function setSession(userData: sessionType): void {
  // Create the session
  const session = JSON.stringify(userData)
  // Save the session in a cookie
  cookies().set("userSession", session, { httpOnly: true });
}
export function unSetSession(): void {
  // Save the session in a cookie
  cookies().set("userSession", '', { httpOnly: true });
}
