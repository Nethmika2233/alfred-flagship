"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type FormState = { error?: string };

export async function loginAction(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const callbackUrl = formData.get("callbackUrl");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Please enter your email and password." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: typeof callbackUrl === "string" && callbackUrl ? callbackUrl : "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error; // next-auth's internal redirect signal on success — must not be swallowed
  }

  return {};
}
