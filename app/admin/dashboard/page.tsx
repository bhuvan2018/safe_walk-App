"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "@/app/components/AdminDashboard"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/contexts/AuthContext"
import LoadingAnimation from "@/app/components/LoadingAnimation"

export default function AdminDashboardPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin dashboard.",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [user, loading, isAdmin, router, toast])

  if (loading) {
    return <LoadingAnimation />
  }

  if (!user || !isAdmin) {
    return null
  }

  // Render the admin dashboard as a full-page experience
  return (
    <div className="min-h-screen bg-gray-950">
      <AdminDashboard />
    </div>
  )
}

