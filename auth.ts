import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" }, // JWT strategies keep micro-interactions running fast
})