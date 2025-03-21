"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "hi" | "kn"

type Translations = {
  [key in Language]: {
    [key: string]: string
  }
}

const translations: Translations = {
  en: {
    home: "Home",
    about: "About",
    emergencyContacts: "Emergency Contacts",
    community: "Community",
    safetyZones: "Safety Zones",
    contact: "Contact",
    report: "Report",
    login: "Login",
    logout: "Logout",
    signup: "Sign Up",
    youAreNotAlone: "You are not alone",
    itIsNotYourFault: "It is NOT your fault",
    ourMission: "Our Mission",
    missionDescription:
      "To empower women with technology-driven solutions that enhance their safety, provide immediate assistance in times of need, and foster a supportive community. We strive to create a world where every woman can walk freely without fear.",
    safeWalkDescription:
      "SafeWalk is an innovative platform that combines AI-powered threat detection, community support, and emergency response systems. Our application provides real-time safety monitoring, instant access to emergency services, and a network of support that ensures no woman has to face danger alone.",
    viewAllSafetyZones: "View All Safety Zones",
    stories: "Stories",
    incidents: "Incidents",
    shareYourStory: "Share your story...",
    reportIncident: "Report an incident...",
    submitStory: "Submit Story",
    submitReport: "Submit Report",
    recentReports: "Recent Reports",
    storySubmitted: "Story Submitted",
    incidentReported: "Incident Reported",
    thankYouForSharing: "Thank you for sharing.",
    safetyChallenges: "Safety Challenges",
    crowdsourcedData: "Crowdsourced Safety Data",
    language: "Language",
  },
  hi: {
    // Hindi translations (add more as needed)
    home: "होम",
    about: "हमारे बारे में",
    login: "लॉग इन करें",
    logout: "लॉग आउट",
    signup: "साइन अप करें",
  },
  kn: {
    // Kannada translations (add more as needed)
    home: "ಮುಖಪುಟ",
    about: "ನಮ್ಮ ಬಗ್ಗೆ",
    login: "ಲಾಗಿನ್",
    logout: "ಲಾಗ್ ಔಟ್",
    signup: "ಸೈನ್ ಅಪ್",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string) => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

