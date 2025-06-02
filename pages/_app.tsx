import type { AppProps } from "next/app"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import "@/styles/globals.css"


const inter = Inter({ subsets: ["latin"] })

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <div className={`${inter.className} min-h-screen bg-white`}>
          <Component {...pageProps} />
          <Toaster richColors position="top-right" />
        </div>
      </ThemeProvider>
    </SessionProvider>
  )
}
