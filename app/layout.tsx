import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/app/contexts/LanguageContext"
import ClientWrapper from "@/app/components/ClientWrapper"
import Navbar from "@/app/components/Navbar"
import TopBar from "@/components/TopBar"
import Footer from "@/components/Footer"
import { AuthProvider } from "@/app/contexts/AuthContext"
import { AuthGuard } from "@/app/components/AuthGuard"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SafeWalk",
  description: "Empowering women's safety through technology",
  themeColor: "#7e22ce",
  generator: "v0.dev",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SafeWalk",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#7e22ce" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SafeWalk" />
        <link rel="apple-touch-startup-image" href="/icons/splash.png" />
        <script src="/register-sw.js" defer></script>
        <script src="/pwa-installer.js" defer></script>
      </head>
      <body className={inter.className}>
        {/* Inline script for immediate execution */}
        <Script id="pwa-install-script" strategy="beforeInteractive">
          {`
            // Backup inline script for PWA installation
            document.addEventListener('DOMContentLoaded', function() {
              // Check if running as standalone
              if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
                console.log('Already installed as PWA');
                return;
              }
              
              // For iOS devices - show custom banner
              const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
              if (isIOS) {
                const iosBanner = document.createElement('div');
                iosBanner.style.position = 'fixed';
                iosBanner.style.bottom = '0';
                iosBanner.style.left = '0';
                iosBanner.style.right = '0';
                iosBanner.style.backgroundColor = '#7e22ce';
                iosBanner.style.color = 'white';
                iosBanner.style.padding = '10px';
                iosBanner.style.textAlign = 'center';
                iosBanner.style.zIndex = '9999';
                iosBanner.innerHTML = 'Install SafeWalk: Tap <b>Share</b> then <b>Add to Home Screen</b>';
                document.body.appendChild(iosBanner);
              }
            });
          `}
        </Script>
        <AuthProvider>
          <LanguageProvider>
            <ClientWrapper>
              <AuthGuard>
                {(isAuthenticated, isAdmin) => (
                  <>
                    {/* Only show TopBar and Navbar for authenticated non-admin users */}
                    {isAuthenticated && !isAdmin && <TopBar />}
                    {isAuthenticated && !isAdmin && <Navbar />}
                    {children}
                    {/* Only show Footer for authenticated non-admin users */}
                    {isAuthenticated && !isAdmin && <Footer />}
                  </>
                )}
              </AuthGuard>
            </ClientWrapper>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
