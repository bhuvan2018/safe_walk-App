"use client"

import { motion } from "framer-motion"
import SafetyZones from "@/app/components/SafetyZones"
import "@/app/safety-zones/safety-zones.css"

export default function SafetyZonesContent() {
  return (
    <div className="min-h-screen bg-gray-950 pt-24">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-4xl font-bold text-orange-500 mb-8 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Safety Zones in Karnataka
        </motion.h1>

        <SafetyZones />
      </div>
    </div>
  )
}

