"use client"

import { getProviders, signIn, getSession } from "next-auth/react"
import type { GetServerSideProps } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Head from "next/head"
import type { ClientSafeProvider } from "next-auth/react"
interface SignInProps {
  providers: Record<string, ClientSafeProvider>
}

export default function SignIn({ providers }: SignInProps) {
  return (
    <>
      <Head>
        <title>InstaSend - Smart Email Tool | Sign In</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4">
        <div className="w-full max-w-lg flex flex-col items-center gap-8">
          <div className="text-center mt-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-black-700 mb-2">InstaSend - Smart Email Tool</h1>
            <p className="text-lg text-gray-700 max-w-xl mx-auto">
              Save and manage templates to send email templates in seconds. InstaSend lets you quickly access your favorite email templates and send them using your Gmail account. Sign in to get started!
            </p>
          </div>
          <Card className="w-full shadow-lg border-0 bg-white/90">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Welcome to InstaSend</CardTitle>
              <CardDescription>Sign in to access your email templates and send personalized emails</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.values(providers).map((provider) => (
                <div key={provider.name} className="my-4">
                  <Button
                    onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                    className="w-full py-3 text-lg font-semibold g-black hover:bg-neutral-900 text-white rounded-lg shadow-md transition-colors duration-150"
                    size="lg"
                  >
                    Sign in with Google
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const providers = await getProviders()

  return {
    props: {
      providers,
    },
  }
}
