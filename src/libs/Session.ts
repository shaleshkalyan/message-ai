import { UserType } from "@/models/UserModel";
import { cookies } from "next/headers";


export function getSession(){
    const session = cookies().get("userSession")?.value;
    if (!session){
        return null;
    }
    return JSON.parse(session);
}
export function setSession(userData : object): void {
  // Create the session
  const session = JSON.stringify(userData)
  // Save the session in a cookie
  cookies().set("userSession", session, { httpOnly: true });
}
export function unSetSession(): void {
  // Save the session in a cookie
  cookies().set("userSession", '', { httpOnly: true });
}
