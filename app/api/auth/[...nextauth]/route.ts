import NextAuth, { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import clientPromise from "@/lib/mongodb"

import { DefaultUser,DefaultSession  } from "next-auth"

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string
  }
  interface Session {
    user: {
      role?: string
    } & DefaultSession["user"]
  }
  interface JWT {
    role?: string
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const client = await clientPromise
        const db = client.db()
        const user = await db.collection("users").findOne({ email: credentials.email })
       
        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)
      
        if (!isPasswordValid) {
          return null
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as User).role; // Explicitly cast `user` to `User`
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string; // Explicitly cast `role` as string
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }

