"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "../contexts/LanguageContext"
import { useTheme } from "next-themes"
import { Sun, Moon, Menu, X } from "lucide-react"
import ReportSlider from "./ReportSlider"
import SubmittedReportsModal from "./SubmittedReportsModal"

export default function Navbar() {
  const { t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isSubmittedReportsOpen, setIsSubmittedReportsOpen] = useState(false)
  const [hasSubmittedReports, setHasSubmittedReports] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const storedReports = localStorage.getItem("navbarReports")
    setHasSubmittedReports(!!storedReports && JSON.parse(storedReports).length > 0)
    setMounted(true)
  }, [])

  const handleReportSubmit = () => {
    setHasSubmittedReports(true)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <nav className="fixed top-8 left-0 right-0 z-50 bg-gray-950 border-b border-border">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* SVG content */}
            </svg>
            <span className="text-xl md:text-2xl font-bold text-orange-500">SafeWalk</span>
          </Link>

          {/* Mobile menu button */}
          <button onClick={toggleMenu} className="md:hidden text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4 items-center">
            <NavLinks
              t={t}
              hasSubmittedReports={hasSubmittedReports}
              setIsSubmittedReportsOpen={setIsSubmittedReportsOpen}
            />
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <ReportButton setIsReportOpen={setIsReportOpen} t={t} />
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 p-4">
            <NavLinks
              t={t}
              hasSubmittedReports={hasSubmittedReports}
              setIsSubmittedReportsOpen={setIsSubmittedReportsOpen}
              isMobile
            />
            <div className="flex justify-between mt-4">
              <ThemeToggle theme={theme} setTheme={setTheme} />
              <ReportButton setIsReportOpen={setIsReportOpen} t={t} />
            </div>
          </div>
        )}
      </nav>
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
}: {
  t: (key: string) => string
  hasSubmittedReports: boolean
  setIsSubmittedReportsOpen: (isOpen: boolean) => void
  isMobile?: boolean
}) => {
  const linkClass = `text-white hover:text-orange-500 transition-colors ${isMobile ? "block py-2" : ""}`

  return (
    <>
      <Link href="/" className={linkClass}>
        {t("home")}
      </Link>
      <Link
        href="/#community"
        className={linkClass}
        onClick={(e) => {
          e.preventDefault()
          document.querySelector("#community")?.scrollIntoView({ behavior: "smooth" })
        }}
      >
        {t("community")}
      </Link>
      <Link href="/emergency-contacts" className={linkClass}>
        {t("emergencyContacts")}
      </Link>
      <Link href="/safety-zones" className={linkClass}>
        {t("safetyZones")}
      </Link>
      <Link href="/about" className={linkClass}>
        {t("about")}
      </Link>
      <Link href="/contact" className={linkClass}>
        {t("contact")}
      </Link>
      {hasSubmittedReports && (
        <Button
          variant="ghost"
          onClick={() => setIsSubmittedReportsOpen(true)}
          className={`text-white hover:text-orange-500 transition-colors ${isMobile ? "block w-full text-left pl-0" : ""}`}
        >
          {t("submittedReports")}
        </Button>
      )}
    </>
  )
}

const ThemeToggle = ({ theme, setTheme }: { theme: string | undefined; setTheme: (theme: string) => void }) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    className="text-white"
  >
    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
  </Button>
)

const ReportButton = ({
  setIsReportOpen,
  t,
}: { setIsReportOpen: (isOpen: boolean) => void; t: (key: string) => string }) => (
  <Button
    variant="outline"
    onClick={() => setIsReportOpen(true)}
    className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
  >
    {t("report")}
  </Button>
)

