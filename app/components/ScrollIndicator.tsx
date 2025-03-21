"use client"

import { useState, useEffect } from "react"

export default function ScrollIndicator() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const sections = ["hero", "emergency-contacts", "community", "safety-zones", "about", "contact"]

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // When 50% of the section is visible
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)

          // Update URL hash without scrolling
          const url = new URL(window.location.href)
          url.hash = entry.target.id
          window.history.replaceState({}, "", url.toString())

          // Add active class to navbar link
          const navLinks = document.querySelectorAll(`[data-section="${entry.target.id}"]`)
          navLinks.forEach((link) => {
            link.classList.add("text-orange-500")
            link.classList.add("bg-orange-500/10")
          })
        } else {
          // Remove active class from navbar link
          const navLinks = document.querySelectorAll(`[data-section="${entry.target.id}"]`)
          navLinks.forEach((link) => {
            link.classList.remove("text-orange-500")
            link.classList.remove("bg-orange-500/10")
          })
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [])

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900/80 backdrop-blur-md rounded-full px-4 py-2 border border-gray-800 hidden md:block">
      <div className="flex space-x-2">
        {["hero", "emergency-contacts", "community", "safety-zones", "about", "contact"].map((section) => (
          <div
            key={section}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === section ? "bg-orange-500 scale-125" : "bg-gray-600 hover:bg-gray-500"
            }`}
            onClick={() => {
              const element = document.getElementById(section)
              if (element) {
                element.scrollIntoView({ behavior: "smooth" })
              }
            }}
            title={section.replace("-", " ")}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>
    </div>
  )
}

