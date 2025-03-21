"use client"

import { motion } from "framer-motion"
import { ArrowRight, Shield, MapPin, Bell, Users, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function About() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "25+", label: "Cities Covered" },
    { value: "15K+", label: "Safety Reports" },
    { value: "98%", label: "User Satisfaction" },
  ]

  const features = [
    {
      icon: <Bell className="h-6 w-6 text-orange-500" />,
      title: "SOS Alerts",
      description: "Instant emergency assistance at your fingertips with one-tap activation and location sharing.",
    },
    {
      icon: <MapPin className="h-6 w-6 text-orange-500" />,
      title: "Safety Zones",
      description: "Identify and navigate through areas marked as safe by community members and official sources.",
    },
    {
      icon: <Users className="h-6 w-6 text-orange-500" />,
      title: "Community Reports",
      description: "Contribute to and benefit from real-time safety information shared by the SafeWalk community.",
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-500" />,
      title: "24/7 Monitoring",
      description: "Our systems continuously monitor reports and alerts to provide timely assistance when needed.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-200 pt-28 pb-16">
      {/* Hero Section */}
      <motion.div
        className="container mx-auto px-4 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="md:w-1/2">
            <motion.h1
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Empowering Safer Communities Together
            </motion.h1>

            <motion.p
              className="text-lg text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              SafeWalk is a community-driven platform designed to enhance public safety through real-time data sharing,
              emergency assistance, and collaborative safety mapping.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                asChild
              >
                <Link href="/dashboard">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="outline" className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10" asChild>
                <Link href="#mission">Learn More</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden shadow-2xl shadow-orange-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 z-10 mix-blend-overlay"></div>
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="SafeWalk in action"
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -right-6 bg-gray-900 p-4 rounded-lg shadow-xl border border-orange-500/20">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-400">Trusted by</p>
                  <p className="font-bold text-white">10,000+ Users</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="bg-gray-900/50 py-12 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-lg bg-gray-800/50 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 mb-16" id="mission">
        <motion.div className="text-center mb-12" {...fadeIn}>
          <h2 className="text-3xl font-bold text-orange-500 mb-4">Our Mission</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            "Empowering communities through technology to create safer, more connected neighborhoods."
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-4">How SafeWalk Works</h3>
            <p className="text-gray-300 mb-6">
              SafeWalk combines real-time user reports, official safety data, and advanced algorithms to create a
              dynamic safety network that benefits from the collective input of the community.
            </p>

            <ul className="space-y-3">
              {[
                "Report incidents and hazards in your area",
                "Receive real-time safety alerts based on your location",
                "Access safety ratings for different neighborhoods",
                "Connect with emergency services with one tap",
                "Share your location with trusted contacts",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="order-1 md:order-2 bg-gray-800/30 p-6 rounded-xl border border-gray-700"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-4">Our Values</h3>

            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-medium text-orange-400">Community First</h4>
                <p className="text-sm text-gray-300">
                  We believe in the power of community collaboration to create safer environments for everyone.
                </p>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-medium text-orange-400">Privacy & Security</h4>
                <p className="text-sm text-gray-300">
                  Your data is protected with industry-leading security measures and privacy controls.
                </p>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-medium text-orange-400">Inclusivity</h4>
                <p className="text-sm text-gray-300">
                  SafeWalk is designed to be accessible and beneficial for people of all backgrounds and abilities.
                </p>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-medium text-orange-400">Continuous Improvement</h4>
                <p className="text-sm text-gray-300">
                  We're constantly evolving our platform based on user feedback and emerging safety needs.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 mb-16">
        <motion.div className="text-center mb-12" {...fadeIn}>
          <h2 className="text-3xl font-bold text-orange-500 mb-4">Key Features</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            SafeWalk provides a comprehensive set of tools designed to enhance your safety and peace of mind.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/30 border border-gray-700 p-6 rounded-xl hover:border-orange-500/30 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <div className="bg-gray-700/30 p-3 rounded-full w-fit mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-orange-500/20 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join the SafeWalk Community Today</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Be part of a growing movement to make our communities safer. Your participation makes a difference.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            asChild
          >
            <Link href="/dashboard">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

