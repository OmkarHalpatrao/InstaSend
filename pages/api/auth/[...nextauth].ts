import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { connectDB } from "@/utils/db"
import User from "@/models/User"
import type { JWT } from "next-auth/jwt"
import type { Session, User as NextAuthUser, Account, Profile } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.send",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: NextAuthUser
      account: Account | null
      profile?: Profile
    }) {
      if (account?.provider === "google") {
        try {
          await connectDB()

          const existingUser = await User.findOne({ email: user.email })

          if (!existingUser) {
            await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: account.providerAccountId,
            })
          }

          return true
        } catch (error) {
          console.error("Error saving user:", error)
          return false
        }
      }
      return true
    },

    async jwt({
      token,
      account,
    }: {
      token: JWT
      account?: Account | null
    }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },

    async session({
      session,
      token,
    }: {
      session: Session
      token: JWT
    }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}

export default NextAuth(authOptions)
