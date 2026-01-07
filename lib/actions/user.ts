"use server";
import { createSession, deleteSession } from "@/lib/session";
import { UserSession } from "../types/user";


// Server action to create a user session
export async function createClientSession({userId, token}: UserSession) {
  await createSession({ userId, token })
}

// Server action to clear a user session
export async function clearClientSession() {
  // Implement session clearing logic here
  await deleteSession();
  return {success: true, message: "Session cleared"};
}