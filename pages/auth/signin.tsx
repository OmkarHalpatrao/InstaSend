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
        <title>Sign In - Email Referral Tool</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your email templates and send personalized emails</CardDescription>
          </CardHeader>
          <CardContent>
           {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <Button onClick={() => signIn(provider.id, { callbackUrl: "/" })} className="w-full" size="lg">
                  Sign in with {provider.name}
                </Button>
              </div>
            ))}

          </CardContent>
        </Card>
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
