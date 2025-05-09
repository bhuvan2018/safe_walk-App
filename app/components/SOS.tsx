"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle } from "lucide-react"
import emailjs from "@emailjs/browser"
import { auth } from "@/lib/firebase" // Updated import path

// Helper function to get user name from email
const getUserNameFromEmail = (email: string | null | undefined): string => {
  if (!email) return "Anonymous"
  // Extract the first 7 characters of the email (or all if shorter than 7)
  const emailPrefix = email.split("@")[0]
  return emailPrefix.substring(0, 7)
}

const saveSOSAlert = (location: { name: string; latitude: number; longitude: number }, user: any) => {
  // Get user name from email if display name is not available
  const userName = user?.displayName || getUserNameFromEmail(user?.email)

  const sosAlert = {
    id: Date.now(),
    type: "SOS Alert",
    content: `SOS Alert triggered at ${location.name} (${location.latitude}, ${location.longitude})`,
    created_at: new Date().toISOString(),
    user: {
      name: userName,
      email: user?.email || "anonymous@example.com",
    },
    location: {
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    },
  }

  const storedAlerts = localStorage.getItem("sosAlerts")
  const alerts = storedAlerts ? JSON.parse(storedAlerts) : []
  alerts.unshift(sosAlert)
  localStorage.setItem("sosAlerts", JSON.stringify(alerts))
}

export default function SOS() {
  const [isActive, setIsActive] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (isActive && countdown === 0) {
      // Navigate to emergency alert page
      router.push("/emergency-alert")

      // Reset the state for next use
      setIsActive(false)
      setCountdown(5)
    }
    return () => clearTimeout(timer)
  }, [isActive, countdown, router])

  const handleSOS = async () => {
    setIsActive(true)

    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200])
    }

    try {
      const location = {
        name: "Mangalore Institure of Technology & Engineering, Moodabidri",
        latitude: 13.0954,
        longitude: 74.9965,
      }

      const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`

      // Get current user from Firebase Auth
      const user = auth.currentUser

      // Get user name from email if display name is not available
      const userName = user?.displayName || getUserNameFromEmail(user?.email)

      // Send email
      const result = await emailjs.send(
        "service_o17yyqp",
        "template_0f6e8pl",
        {
          from_name: userName || "SafeWalk User",
          from_email: user?.email || "sos@safewalk.com",
          subject: "URGENT: SOS Alert from SafeWalk User",
          message: `A SafeWalk user has triggered an SOS alert. Immediate assistance may be required.

User: ${userName}
Email: ${user?.email || "Not provided"}
Location: ${location.name}
Map Link: ${googleMapsUrl}`,
        },
        "x2oCH1LfVilF8i5ij",
      )

      // Save SOS alert with user information
      saveSOSAlert(location, user)

      console.log("Email sent:", result.text)
      toast({
        title: "SOS Alert Activated",
        description: "Emergency alert and location have been sent. Help is on the way.",
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error sending SOS alert:", error)
      toast({
        title: "SOS Alert Failed",
        description: "Failed to send SOS alert. Please try again or contact emergency services directly.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <motion.button
        onClick={handleSOS}
        className="w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AlertTriangle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-600 flex items-center justify-center z-50"
          >
            <div className="text-center text-white p-8">
              <h1 className="text-4xl font-bold mb-6">SOS Alert Activated</h1>
              <p className="text-2xl mb-6">Help is on the way. Stay calm and remain in a safe location if possible.</p>
              <p className="text-xl mb-6">Your location has been sent to emergency services.</p>
              <p className="text-xl">Redirecting to emergency instructions in {countdown} seconds...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
