"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PWAInstaller() {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Store the event for later use
      setInstallPrompt(e)
      // Show the install banner
      setIsVisible(true)

      console.log("PWA is installable! 🎉")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Check if the app was installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setIsVisible(false)
      console.log("PWA was installed successfully! 🚀")
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return

    // Show the install prompt
    installPrompt.prompt()

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt")
    } else {
      console.log("User dismissed the install prompt")
    }

    // Clear the saved prompt as it can't be used again
    setInstallPrompt(null)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    // Store in localStorage that the user dismissed the banner
    localStorage.setItem("pwa-install-dismissed", "true")
  }

  // Don't show if already installed or user dismissed or no install prompt available
  if (!isVisible || isInstalled || (localStorage.getItem("pwa-install-dismissed") === "true" && !installPrompt)) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="hidden sm:block rounded-full bg-white/20 p-2">
            <Download className="h-5 w-5" />
          </div>
          <p className="text-sm sm:text-base font-medium">
            Install SafeWalk for quicker emergency access and offline safety tools.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleInstall} size="sm" className="bg-white text-purple-700 hover:bg-white/90 font-medium">
            Install
          </Button>
          <Button onClick={handleDismiss} variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Dismiss</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
