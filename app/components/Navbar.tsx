"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "../contexts/LanguageContext"
import { Menu, X } from "lucide-react"
import ReportSlider from "./ReportSlider"
import SubmittedReportsModal from "./SubmittedReportsModal"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import type React from "react"
import { useAuth } from "@/app/contexts/AuthContext"

export default function Navbar() {
  const { t } = useLanguage()
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isSubmittedReportsOpen, setIsSubmittedReportsOpen] = useState(false)
  const [hasSubmittedReports, setHasSubmittedReports] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const { user, logout, isAdmin } = useAuth()

  useEffect(() => {
    const hideReports = localStorage.getItem("hideSubmittedReports")
    const storedReports = localStorage.getItem("navbarReports")
    setHasSubmittedReports(!!storedReports && JSON.parse(storedReports).length > 0 && !hideReports)
    setMounted(true)
  }, [])

  const handleReportSubmit = () => {
    setHasSubmittedReports(false)
    localStorage.setItem("hideSubmittedReports", "true")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navigateHome = () => {
    router.push("/dashboard")
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logout Successful",
        description: "You have been logged out successfully.",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-8 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-orange-500/20 shadow-lg shadow-orange-500/5"
      >
        <div className="container mx-auto flex justify-between items-center p-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={navigateHome}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 transition-transform group-hover:scale-110 overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
              <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-orange-500/30 group-hover:border-orange-500/70 transition-colors">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Consent%20isn't%20tricky-mALm1EyLyR0x4DyhcPVIQIW7qDGWrX.jpeg"
                  alt="SafeWalk Logo"
                  fill
                  className="object-contain rounded-full hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                  priority
                />
              </div>
            </div>
            <motion.span
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent hover:from-orange-400 hover:to-red-400 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              SafeWalk
            </motion.span>
          </motion.div>

          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="md:hidden text-white bg-gray-800/50 p-2 rounded-lg hover:bg-orange-500/20 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isMenuOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: isMenuOpen ? -90 : 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: isMenuOpen ? 90 : -90 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-1 items-center">
            <NavLinks
              t={t}
              hasSubmittedReports={hasSubmittedReports}
              setIsSubmittedReportsOpen={setIsSubmittedReportsOpen}
              isAdmin={isAdmin}
              pathname={pathname}
            />
            <ReportButton setIsReportOpen={setIsReportOpen} t={t} />
            {user && (
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-white hover:text-orange-500 hover:bg-orange-500/10 transition-all duration-300"
              >
                {t("logout")}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-gray-900/95 backdrop-blur-md overflow-hidden border-b border-gray-800"
            >
              <div className="p-4 space-y-2">
                <NavLinks
                  t={t}
                  hasSubmittedReports={hasSubmittedReports}
                  setIsSubmittedReportsOpen={setIsSubmittedReportsOpen}
                  isMobile
                  isAdmin={isAdmin}
                  pathname={pathname}
                />
                <div className="flex flex-col mt-4 space-y-2">
                  <ReportButton setIsReportOpen={setIsReportOpen} t={t} />
                  {user && (
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-center bg-gray-800/50 hover:bg-orange-500/20 text-white hover:text-orange-500"
                    >
                      {t("logout")}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      <ReportSlider isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} onSubmit={handleReportSubmit} />
      <SubmittedReportsModal isOpen={isSubmittedReportsOpen} onClose={() => setIsSubmittedReportsOpen(false)} />
    </>
  )
}

const NavLinks = ({
  t,
  hasSubmittedReports,
  setIsSubmittedReportsOpen,
  isMobile = false,
  isAdmin = false,
  pathname = "",
}: {
  t: (key: string) => string
  hasSubmittedReports: boolean
  setIsSubmittedReportsOpen: (isOpen: boolean) => void
  isMobile?: boolean
  isAdmin?: boolean
  pathname?: string
}) => {
  const router = useRouter()
  const linkClass = `relative text-white transition-all duration-300 
    px-3 py-2 rounded-lg 
    hover:text-orange-500 
    ${isMobile ? "block w-full mb-2 bg-gray-800/50 hover:bg-orange-500/20" : ""}
    group overflow-hidden flex items-center gap-2`

  const activeLinkClass = `${linkClass} text-orange-500 bg-orange-500/10`

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={!isMobile ? "relative" : ""}>
        <Link
          href="/dashboard"
          className={pathname === "/dashboard" ? activeLinkClass : linkClass}
          onClick={handleHomeClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="relative z-10">{t("home")}</span>
          <span className="absolute inset-0 bg-orange-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-lg"></span>
        </Link>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={!isMobile ? "relative" : ""}>
        <Link
          href="/dashboard#community"
          className={linkClass}
          onClick={(e) => {
            e.preventDefault()
            document.querySelector("#community")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span className="relative z-10">{t("community")}</span>
          <span className="absolute inset-0 bg-orange-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-lg"></span>
        </Link>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={!isMobile ? "relative" : ""}>
        <Link
          href="/dashboard#safety-zones"
          className={linkClass}
          onClick={(e) => {
            e.preventDefault()
            // Navigate to dashboard if not already there
            if (window.location.pathname !== "/dashboard") {
              router.push("/dashboard").then(() => {
                // After navigation completes, scroll to safety zones
                setTimeout(() => {
                  document.getElementById("safety-zones")?.scrollIntoView({ behavior: "smooth" })
                }, 100)
              })
            } else {
              // If already on dashboard, just scroll
              document.getElementById("safety-zones")?.scrollIntoView({ behavior: "smooth" })
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span className="relative z-10">{t("safetyZones")}</span>
          <span className="absolute inset-0 bg-orange-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-lg"></span>
        </Link>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={!isMobile ? "relative" : ""}>
        <Link
          href="/dashboard#about"
          className={linkClass}
          onClick={(e) => {
            e.preventDefault()
            // Navigate to dashboard if not already there
            if (window.location.pathname !== "/dashboard") {
              router.push("/dashboard").then(() => {
                // After navigation completes, scroll to about section
                setTimeout(() => {
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
                }, 100)
              })
            } else {
              // If already on dashboard, just scroll
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span className="relative z-10">{t("about")}</span>
          <span className="absolute inset-0 bg-orange-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-lg"></span>
        </Link>
      </motion.div>

      {isAdmin && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={!isMobile ? "relative" : ""}>
          <Link
            href="/admin/dashboard"
            className={
              pathname?.startsWith("/admin") ? activeLinkClass : `${linkClass} ${!isMobile ? "bg-orange-500/20" : ""}`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span className="relative z-10 font-medium">Admin Dashboard</span>
            <span className="absolute inset-0 bg-orange-500/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-lg"></span>
          </Link>
        </motion.div>
      )}

      {hasSubmittedReports && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={!isMobile ? "relative" : ""}>
          <Button
            variant="ghost"
            onClick={() => setIsSubmittedReportsOpen(true)}
            className={`text-white hover:text-orange-500 hover:bg-orange-500/10 transition-all duration-300 flex items-center gap-2
              ${isMobile ? "block w-full text-left pl-3 bg-gray-800/50" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span className="relative z-10">{t("submittedReports")}</span>
          </Button>
        </motion.div>
      )}
    </>
  )
}

const ReportButton = ({
  setIsReportOpen,
  t,
}: {
  setIsReportOpen: (isOpen: boolean) => void
  t: (key: string) => string
}) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative overflow-hidden rounded-lg">
    <Button
      variant="outline"
      onClick={() => setIsReportOpen(true)}
      className="border-orange-500/50 text-orange-500 hover:bg-orange-500 hover:text-white
        transition-all duration-300 relative z-10 overflow-hidden group flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      <span className="relative z-10">{t("report")}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
    </Button>
  </motion.div>
)

