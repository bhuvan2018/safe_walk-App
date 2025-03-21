"use client"

import { motion } from "framer-motion"
import { Shield, Phone, Heart, CheckCircle, Users, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutSection() {
  return (
    <div id="about" className="mt-12 md:mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-purple-500/5 rounded-xl blur-xl"></div>
        <div className="relative bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl border border-orange-500/10 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="relative">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500"></div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent text-center">
                About SafeWalk
              </h2>
              <div className="h-px w-12 bg-gradient-to-r from-orange-500 to-transparent"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="group"
                >
                  <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 hover:bg-gray-800/80">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-500/10 p-3 rounded-lg">
                        <motion.div
                          animate={{ rotate: [0, 10, 0] }}
                          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        >
                          <Shield className="h-6 w-6 text-orange-500" />
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-orange-400 mb-2 group-hover:text-orange-500 transition-colors">
                          Our Mission
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          SafeWalk is dedicated to empowering individuals through technology to navigate their
                          surroundings with confidence and awareness. We believe everyone deserves to feel safe in their
                          community.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="group"
                >
                  <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 hover:bg-gray-800/80">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-500/10 p-3 rounded-lg">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        >
                          <Phone className="h-6 w-6 text-orange-500" />
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-orange-400 mb-2 group-hover:text-orange-500 transition-colors">
                          How It Works
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          Our platform combines real-time data, community reports, and advanced mapping to provide you
                          with the most up-to-date safety information for your area. Report incidents, view safety
                          ratings, and access emergency resources all in one place.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-5 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-500/20 p-3 rounded-lg">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        >
                          <Heart className="h-6 w-6 text-orange-500" />
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-orange-400 mb-2 group-hover:text-orange-500 transition-colors">
                          Our Vision
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          We envision a world where everyone can navigate their surroundings with confidence and peace
                          of mind. Through technology and community engagement, we're working to make this vision a
                          reality.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 p-5 rounded-lg border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
                    <h3 className="text-xl font-semibold text-orange-400 mb-4 group-hover:text-orange-500 transition-colors">
                      Key Features
                    </h3>
                    <ul className="space-y-3 text-gray-300">
                      {[
                        "Real-time safety alerts and notifications",
                        "Community-driven incident reporting",
                        "Interactive safety zone mapping",
                        "Emergency SOS and contact features",
                        "Personalized safety recommendations",
                      ].map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          className="flex items-center gap-3 group"
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-sm group-hover:bg-orange-500/30 transition-colors"></div>
                            <CheckCircle className="h-5 w-5 text-orange-500 relative z-10" />
                          </div>
                          <span className="group-hover:text-white transition-colors">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="group"
                >
                  <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 hover:bg-gray-800/80">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-500/10 p-3 rounded-lg">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Lock className="h-6 w-6 text-orange-500" />
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-orange-400 mb-2 group-hover:text-orange-500 transition-colors">
                          Privacy & Security
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          We prioritize your privacy and data security. All reports are anonymized, and personal
                          information is protected with industry-leading encryption standards.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-5 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-500/20 p-3 rounded-lg">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        >
                          <Users className="h-6 w-6 text-orange-500" />
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-orange-400 mb-2 group-hover:text-orange-500 transition-colors">
                          Our Team
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          SafeWalk was created by a dedicated team of developers and safety advocates who are passionate
                          about using technology to create safer communities for everyone.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Learn More About Our Mission
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

