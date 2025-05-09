"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function EmergencyAlert() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Set up countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Redirect back to main page after 5 seconds
    const redirectTimer = setTimeout(() => {
      router.push("/dashboard")
    }, 5000)

    // Cleanup timers on unmount
    return () => {
      clearInterval(countdownInterval)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-red-600 flex items-center justify-center">
      <div className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">Emergency Alert Activated</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
          <p className="text-2xl text-white">Your live location has been sent to your emergency contacts.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}>
          <p className="text-xl text-white">Please stay calm. Help is on the way.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.5 }}>
          <p className="text-lg text-white">Redirecting to main page in {countdown} seconds...</p>
        </motion.div>
      </div>
    </div>
  )
}

