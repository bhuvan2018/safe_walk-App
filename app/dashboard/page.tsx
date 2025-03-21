"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import EmergencyHelplines from "@/app/components/EmergencyHelplines"
import SafetyZones from "@/app/components/SafetyZones"
import SafetyChallenges from "@/app/components/SafetyChallenges"
import Community from "@/app/components/Community"
import { useLanguage } from "@/app/contexts/LanguageContext"
import AudioPlayer from "@/app/components/AudioPlayer"
import { useAuth } from "@/app/contexts/AuthContext"
import { CheckCircle } from "lucide-react"

const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.02 } },
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={{
            hidden: { opacity: 0, x: 20 },
            visible: { opacity: 1, x: 0 },
          }}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentDescription, setCurrentDescription] = useState("safeWalkDescription")
  const { t } = useLanguage()
  const [hasSubmittedIncident, setHasSubmittedIncident] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDescription((prev) => (prev === "safeWalkDescription" ? "missionDescription" : "safeWalkDescription"))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleIncidentSubmit = () => {
    setHasSubmittedIncident(true)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-24 h-24 relative"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-12%20004017-RkIOHdHXtOGWKNWBceyWinrWdi1OHu.png"
            alt="SafeWalk Logo"
            fill
            className="object-contain"
          />
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <AudioPlayer />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-950 text-foreground pt-16 md:pt-24"
      >
        <section className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="relative w-full mb-8">
            <div className="absolute inset-0 h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Download%20premium%20image%20of%20Female%20boxer%20putting%20a%20strap%20on%20her%20hand%20by%20Teddy%20about%20hand,%20person,%20sports,%20adult,%20and%20woman%201222505-ZSZooVCKWphGJPH6Xj5PGo7EcdhAgM.jpeg"
                alt="Strength and Preparation"
                fill
                className="object-cover opacity-30"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 pb-8">
              <div className="flex flex-col items-center mb-8 md:mb-16">
                {/* Top centered text */}
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-8 md:mb-16"
                >
                  <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-transparent bg-clip-text">
                    {t("youAreNotAlone")}
                  </h1>
                  <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground">{t("itIsNotYourFault")}</p>
                </motion.div>

                {/* Content container */}
                <div className="w-full max-w-4xl px-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentDescription}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      {/* Centered title */}
                      <motion.h2
                        className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500 text-center mb-4 md:mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        {currentDescription === "safeWalkDescription" ? "SafeWalk" : t("ourMission")}
                      </motion.h2>

                      {/* Right-aligned description */}
                      <div className="text-right">
                        <AnimatedText
                          text={t(currentDescription)}
                          className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl ml-auto"
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <div id="emergency-contacts">
            <EmergencyHelplines />
          </div>

          {/* Safety Zones Section - Now full width */}
          <div id="safety-zones" className="mt-8 md:mt-12">
            <motion.h2
              className="text-3xl font-bold text-orange-500 mb-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Safety Zones Map
            </motion.h2>
            <SafetyZones />
          </div>

          {/* Community Section - Now below Safety Zones */}
          <div id="community" className="mt-8 md:mt-12">
            <motion.h2
              className="text-3xl font-bold text-orange-500 mb-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Community
            </motion.h2>
            <Community onIncidentSubmit={handleIncidentSubmit} />
          </div>

          {/* About Section */}
          <div id="about" className="mt-12 md:mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-orange-500/10"
            >
              <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">About SafeWalk</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-orange-400 mb-2">Our Mission</h3>
                    <p className="text-gray-300">
                      SafeWalk is dedicated to empowering individuals through technology to navigate their surroundings
                      with confidence and awareness. We believe everyone deserves to feel safe in their community.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-orange-400 mb-2">How It Works</h3>
                    <p className="text-gray-300">
                      Our platform combines real-time data, community reports, and advanced mapping to provide you with
                      the most up-to-date safety information for your area. Report incidents, view safety ratings, and
                      access emergency resources all in one place.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-orange-500/10">
                    <h3 className="text-xl font-semibold text-orange-400 mb-2">Our Vision</h3>
                    <p className="text-gray-300">
                      We envision a world where everyone can navigate their surroundings with confidence and peace of
                      mind. Through technology and community engagement, we're working to make this vision a reality.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-orange-500/10">
                    <h3 className="text-xl font-semibold text-orange-400 mb-2">Key Features</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-500" />
                        Real-time safety alerts and notifications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-500" />
                        Community-driven incident reporting
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-500" />
                        Interactive safety zone mapping
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-500" />
                        Emergency SOS and contact features
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-500" />
                        Personalized safety recommendations
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-orange-400 mb-2">Privacy & Security</h3>
                    <p className="text-gray-300">
                      We prioritize your privacy and data security. All reports are anonymized, and personal information
                      is protected with industry-leading encryption standards.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-orange-500/10">
                    <h3 className="text-xl font-semibold text-orange-400 mb-2">Our Team</h3>
                    <p className="text-gray-300">
                      SafeWalk was created by a dedicated team of developers and safety advocates who are passionate
                      about using technology to create safer communities for everyone.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div id="safety-challenges" className="mt-8 md:mt-12">
            <SafetyChallenges onIncidentReportClick={() => {}} hasSubmittedIncident={hasSubmittedIncident} />
          </div>
        </section>
      </motion.main>
    </>
  )
}

