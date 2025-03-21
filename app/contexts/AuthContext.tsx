"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import type { User } from "firebase/auth"
import { useRouter } from "next/navigation"
import LoadingAnimation from "@/app/components/LoadingAnimation"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      const userIsAdmin = user?.email === "officialpolice@gmail.com" || false
      setIsAdmin(userIsAdmin)
      setLoading(false)

      // Track user login for statistics
      if (user) {
        // Get current stats
        const storedUserStats = localStorage.getItem("userStats")
        const stats = storedUserStats
          ? JSON.parse(storedUserStats)
          : {
              activeUsers: 0,
              newRegistrations: 0,
              verifiedAccounts: 0,
            }

        // Increment active users
        stats.activeUsers += 1

        // Check if this is a new registration
        const userRegistrations = localStorage.getItem("userRegistrations") || "[]"
        const registrations = JSON.parse(userRegistrations)

        if (!registrations.includes(user.uid)) {
          // This is a new registration
          stats.newRegistrations += 1
          registrations.push(user.uid)
          localStorage.setItem("userRegistrations", JSON.stringify(registrations))

          // Also count as verified
          stats.verifiedAccounts += 1
        }

        // Update stats
        localStorage.setItem("userStats", JSON.stringify(stats))
      }

      // Initial loading animation
      setTimeout(() => {
        setInitialLoading(false)
      }, 2000)

      // Redirect based on user type
      if (user) {
        if (userIsAdmin) {
          router.push("/admin/dashboard")
        } else {
          router.push("/dashboard")
        }
      }
    })

    return () => unsubscribe()
  }, [router])

  const logout = async () => {
    try {
      await auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (initialLoading) {
    return <LoadingAnimation />
  }

  return <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

