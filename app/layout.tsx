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

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SafeWalk",
  description: "Empowering women's safety through technology",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
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



import './globals.css'