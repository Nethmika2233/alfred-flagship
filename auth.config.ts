import type { NextAuthConfig } from "next-auth"
import type { Role } from "@prisma/client"

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/signup"
  },
  callbacks: {
    // 1. Persist user roles inside the JWT payload token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role
      }
      return token
    },
    // 2. Forward the role from the JWT token into the client session context
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
  },
  providers: [], // We will supply our custom Credential Forms handling here in later steps
} satisfies NextAuthConfig