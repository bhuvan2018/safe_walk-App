"use client"

import type { ReactNode } from "react"
import dynamic from "next/dynamic"
import { ThemeProvider } from "next-themes"
import { useLanguage } from "@/app/contexts/LanguageContext"
import { useAuth } from "@/app/contexts/AuthContext"

const SOS = dynamic(() => import("./SOS"), { ssr: false })
const Chatbot = dynamic(() => import("./Chatbot"), { ssr: false })

interface ClientWrapperProps {
  children: ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const { t } = useLanguage()
  const { user, isAdmin } = useAuth()

  // Only show SOS and Chatbot for authenticated non-admin users
  const showHelpers = user && !isAdmin

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
      {showHelpers && (
        <div className="fixed bottom-6 left-6 right-6 flex justify-between z-50">
          <Chatbot />
          <SOS />
        </div>
      )}
    </ThemeProvider>
  )
}

