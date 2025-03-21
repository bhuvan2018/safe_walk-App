"use client"

import { motion } from "framer-motion"
import { Heart, Github, Mail, Twitter, MapPin, Shield, Phone } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* About Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Shield className="mr-2 h-5 w-5 text-orange-500" />
              SafeWalk
            </h3>
            <p className="text-gray-400">
              Empowering women with safety tools, resources, and community support to navigate the world with
              confidence.
            </p>
            <div className="flex space-x-4 pt-2">
              <motion.a
                whileHover={{ y: -3 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Github size={18} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="mailto:contact@safewalk.org"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Mail size={18} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Twitter size={18} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-orange-500 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/emergency-contacts"
                  className="text-gray-400 hover:text-orange-500 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span> Emergency Contacts
                </Link>
              </li>
              <li>
                <Link
                  href="/safety-zones"
                  className="text-gray-400 hover:text-orange-500 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span> Safety Zones
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-orange-500 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Contact Us</h3>
            <div className="space-y-3">
              <p className="text-gray-400 flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <span>Karnataka, India</span>
              </p>
              <p className="text-gray-400 flex items-start">
                <Phone className="mr-2 h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <span>Emergency Helpline: 1800-SAFE-WALK</span>
              </p>
              <p className="text-gray-400 flex items-start">
                <Mail className="mr-2 h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <span>support@safewalk.org</span>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} SafeWalk. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-gray-500">
            <span>Made with</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </motion.div>
            <span>by</span>
            <motion.span whileHover={{ color: "#f97316" }} className="text-orange-500 font-medium">
              Bhuvan, Shivani, Ranjeeth
            </motion.span>
          </div>
        </div>
      </div>
    </footer>
  )
}

