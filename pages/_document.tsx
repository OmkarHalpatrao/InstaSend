// pages/_document.tsx

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Basic SEO */}
        <meta name="description" content="InstaSend - Your Smart Email Assistant" />
        <meta name="keywords" content="InstaSend, email, productivity, AI email assistant, PWA" />
        <meta name="author" content="Omkar Halpatrao" />

        {/* PWA Manifest & Meta */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00ff00" />
        <meta name="application-name" content="InstaSend" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* Viewport config */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=cover"
        />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/Instasend-192.png" />
        <link rel="apple-touch-icon" sizes="256x256" href="/icons/Instasend-256.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/Instasend-512.png" />
        <link rel="shortcut icon" href="/icons/Instasend-192.png" />

        {/* Optional: Social Sharing (Open Graph) */}
        <meta property="og:title" content="InstaSend" />
        <meta property="og:description" content="Your  Email Assistant" />
        <meta property="og:image" content="/icons/Instasend-512.png" />
        <meta property="og:type" content="website" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
