import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// We decouple Prisma entirely from this specific wrapper file 
// to keep Next.js Edge Middleware completely lightweight.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
})