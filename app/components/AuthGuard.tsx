"use client"

import type React from "react"

import { useAuth } from "@/app/contexts/AuthContext"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function AuthGuard({
  children,
}: {
  children: (isAuthenticated: boolean, isAdmin: boolean) => React.ReactNode
}) {
  const { user, loading, isAdmin } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const isAuthPage = pathname === "/"
  const isAdminPage = pathname.startsWith("/admin")
  const isAuthenticated = !!user

  useEffect(() => {
    if (!loading) {
      // If user is not authenticated and trying to access any protected route
      if (!isAuthenticated && !isAuthPage) {
        router.push("/")
      }

      // If user is authenticated but not admin and trying to access admin pages
      if (isAuthenticated && !isAdmin && isAdminPage) {
        router.push("/dashboard")
      }

      // If user is authenticated and is admin, redirect to admin dashboard
      if (isAuthenticated && isAdmin && !isAdminPage) {
        router.push("/admin/dashboard")
      }

      // If user is authenticated but not admin and trying to access the auth page
      if (isAuthenticated && !isAdmin && isAuthPage) {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isAdmin, isAuthPage, isAdminPage, loading, router])

  return <>{children(isAuthenticated, isAdmin)}</>
}

