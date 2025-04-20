"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  AlertTriangle,
  Shield,
  Map,
  Activity,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  FileText,
  LogOut,
  Users2,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Settings,
  Search,
  Calendar,
  RefreshCw,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { logoutUser } from "@/lib/auth"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Report {
  id: number
  type: string
  content: string
  created_at: string
  status?: string
  user?: {
    name: string
    email: string
  }
}

interface Alert {
  id: number
  type: string
  content: string
  created_at: string
  user?: {
    name: string
    email: string
  }
  location?: {
    name: string
    latitude: number
    longitude: number
  }
}

interface UserStats {
  activeUsers: number
  newRegistrations: number
  verifiedAccounts: number
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [communityReports, setCommunityReports] = useState<Report[]>([])
  const [communityFilter, setCommunityFilter] = useState<string>("all")
  const [userStats, setUserStats] = useState<UserStats>({
    activeUsers: 0,
    newRegistrations: 0,
    verifiedAccounts: 0,
  })
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      // Load reports from localStorage
      const storedReports = localStorage.getItem("navbarReports")
      if (storedReports) {
        setReports(JSON.parse(storedReports))
      }

      // Load SOS alerts from localStorage
      const storedAlerts = localStorage.getItem("sosAlerts")
      if (storedAlerts) {
        setAlerts(JSON.parse(storedAlerts))
      }

      // Load community reports from localStorage
      const storedCommunityReports = localStorage.getItem("adminReports")
      if (storedCommunityReports) {
        setCommunityReports(JSON.parse(storedCommunityReports))
      }

      // Load user statistics from localStorage or initialize
      const storedUserStats = localStorage.getItem("userStats")
      if (storedUserStats) {
        setUserStats(JSON.parse(storedUserStats))
      } else {
        // Initialize with default values
        const initialStats = {
          activeUsers: 1, // Start with 1 for the current admin
          newRegistrations: 0,
          verifiedAccounts: 1, // Admin account is verified
        }
        setUserStats(initialStats)
        localStorage.setItem("userStats", JSON.stringify(initialStats))
      }

      // Track login for statistics
      trackUserLogin()

      // Simulate loading delay for better UX
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }

    loadData()
  }, [])

  const refreshData = () => {
    setRefreshing(true)

    // Simulate refresh
    setTimeout(() => {
      // Re-fetch data from localStorage
      const storedReports = localStorage.getItem("navbarReports")
      if (storedReports) {
        setReports(JSON.parse(storedReports))
      }

      const storedAlerts = localStorage.getItem("sosAlerts")
      if (storedAlerts) {
        setAlerts(JSON.parse(storedAlerts))
      }

      const storedCommunityReports = localStorage.getItem("adminReports")
      if (storedCommunityReports) {
        setCommunityReports(JSON.parse(storedCommunityReports))
      }

      toast({
        title: "Dashboard Refreshed",
        description: "All data has been updated to the latest version.",
      })

      setRefreshing(false)
    }, 1000)
  }

  const trackUserLogin = () => {
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

    // Check if this is a new login today
    const lastLoginDate = localStorage.getItem("lastLoginDate")
    const today = new Date().toDateString()

    if (lastLoginDate !== today) {
      // This is a new login for today
      stats.newRegistrations += 1
      localStorage.setItem("lastLoginDate", today)
    }

    // Update stats
    setUserStats(stats)
    localStorage.setItem("userStats", JSON.stringify(stats))
  }

  const handleStatusChange = (reportId: number, newStatus: string) => {
    const updatedReports = reports.map((report) => (report.id === reportId ? { ...report, status: newStatus } : report))
    setReports(updatedReports)
    localStorage.setItem("navbarReports", JSON.stringify(updatedReports))

    toast({
      title: "Status Updated",
      description: `Report status changed to ${newStatus}.`,
    })
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast({
        title: "Logout Successful",
        description: "You have been logged out successfully.",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      })
    }
  }

  const filteredCommunityReports =
    communityFilter === "all" ? communityReports : communityReports.filter((report) => report.type === communityFilter)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <Shield className="h-16 w-16 text-orange-500 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">SafeWalk Admin</h1>
            <p className="text-gray-400 mb-6">Loading dashboard...</p>
            <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              />
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg border border-gray-700">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              SafeWalk Admin Dashboard
            </h1>
            <p className="text-gray-400">Manage safety reports, alerts, and user data</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 animate-pulse">
              <Activity className="mr-1 h-3 w-3" />
              System Online
            </Badge>
            <Button size="sm" variant="outline" className="gap-1 hover:bg-gray-800 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-colors"
              onClick={() => setIsTeamModalOpen(true)}
            >
              <Users2 className="h-4 w-4" />
              <span className="hidden sm:inline">Project Team</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors"
              onClick={refreshData}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="gap-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Date and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="h-5 w-5" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-300"
            />
          </div>
        </div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* User Stats Card */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-[-5px]">
            <CardHeader className="pb-2 border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                User Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Active Users</span>
                    <span className="text-white font-bold">{userStats.activeUsers}</span>
                  </div>
                  <div className="relative">
                    <Progress value={Math.min(userStats.activeUsers * 5, 100)} className="h-2" />
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -right-1 -top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">New Registrations</span>
                    <span className="text-white font-bold">{userStats.newRegistrations}</span>
                  </div>
                  <div className="relative">
                    <Progress value={Math.min(userStats.newRegistrations * 10, 100)} className="h-2" />
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                      className="absolute -right-1 -top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Verified Accounts</span>
                    <span className="text-white font-bold">{userStats.verifiedAccounts}</span>
                  </div>
                  <div className="relative">
                    <Progress value={Math.min(userStats.verifiedAccounts * 5, 100)} className="h-2" />
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 }}
                      className="absolute -right-1 -top-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-gray-800"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-1 text-blue-400 text-sm">
                  <BarChart3 className="h-4 w-4" />
                  <span>User Analytics</span>
                </div>
                <Button size="sm" variant="ghost" className="h-8 text-xs text-gray-400 hover:text-white">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Safety Alerts Card */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-[-5px]">
            <CardHeader className="pb-2 border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                Safety Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">SOS Alerts</p>
                    <p className="text-sm text-gray-400">Last 24 hours</p>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-none">
                    <motion.span
                      initial={{ scale: 1 }}
                      animate={{ scale: alerts.length > 0 ? [1, 1.2, 1] : 1 }}
                      transition={{ repeat: alerts.length > 0 ? Number.POSITIVE_INFINITY : 0, repeatDelay: 2 }}
                    >
                      {alerts.length}
                    </motion.span>
                  </Badge>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">Incident Reports</p>
                    <p className="text-sm text-gray-400">Last 24 hours</p>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-none">
                    {reports.filter((r) => r.type === "suspicious" || r.type === "harassment").length}
                  </Badge>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">Resolved Cases</p>
                    <p className="text-sm text-gray-400">Last 24 hours</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-none">
                    {reports.filter((r) => r.status === "resolved").length}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <LineChart className="h-4 w-4" />
                  <span>Alert Trends</span>
                </div>
                <Button size="sm" variant="ghost" className="h-8 text-xs text-gray-400 hover:text-white">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Safety Zones Card */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-[-5px]">
            <CardHeader className="pb-2 border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Map className="h-5 w-5 text-green-400" />
                </div>
                Safety Zones
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">Verified Safe Zones</p>
                    <p className="text-sm text-gray-400">Total</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-none">24</Badge>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">Caution Areas</p>
                    <p className="text-sm text-gray-400">Total</p>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-none">12</Badge>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">Danger Zones</p>
                    <p className="text-sm text-gray-400">Total</p>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-none">8</Badge>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <PieChart className="h-4 w-4" />
                  <span>Zone Distribution</span>
                </div>
                <Button size="sm" variant="ghost" className="h-8 text-xs text-gray-400 hover:text-white">
                  View Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6"
        >
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-auto py-3 flex flex-col items-center">
            <Shield className="h-6 w-6 mb-1" />
            <span>Safety Report</span>
          </Button>
          <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 h-auto py-3 flex flex-col items-center">
            <Zap className="h-6 w-6 mb-1" />
            <span>Emergency Alert</span>
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-auto py-3 flex flex-col items-center">
            <Users className="h-6 w-6 mb-1" />
            <span>User Management</span>
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 h-auto py-3 flex flex-col items-center">
            <Settings className="h-6 w-6 mb-1" />
            <span>System Settings</span>
          </Button>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 bg-gray-800 p-1">
              <TabsTrigger value="reports" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Incident Reports
              </TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <Bell className="mr-2 h-4 w-4" />
                SOS Alerts
              </TabsTrigger>
              <TabsTrigger
                value="community"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Community Submissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reports">
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Recent Incident Reports
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Review and manage user-submitted incident reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {reports.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-10 text-gray-500"
                    >
                      <AlertTriangle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg">No incident reports found</p>
                      <p className="text-sm mt-2 max-w-md mx-auto">
                        When users submit incident reports, they will appear here for review and action.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {reports.map((report, index) => (
                        <motion.div
                          key={report.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-gray-900 rounded-lg p-4 border-l-4 border-yellow-500 hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-white flex items-center">
                                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                                {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Incident
                              </h3>
                              <p className="text-sm text-gray-400 mt-1">
                                {new Date(report.created_at).toLocaleString()}
                              </p>
                            </div>
                            <Badge
                              className={
                                report.status === "resolved"
                                  ? "bg-green-500/20 text-green-400"
                                  : report.status === "investigating"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                              }
                            >
                              {report.status || "pending"}
                            </Badge>
                          </div>
                          <p className="mt-2 text-gray-300">{report.content}</p>

                          {report.user && (
                            <div className="mt-3 bg-gray-800 p-2 rounded-md">
                              <p className="text-sm text-gray-300">
                                <span className="text-gray-500">Reported by: </span>
                                {report.user.name} ({report.user.email})
                              </p>
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors"
                              onClick={() => handleStatusChange(report.id, "investigating")}
                            >
                              <Clock className="mr-1 h-4 w-4" />
                              Investigating
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"
                              onClick={() => handleStatusChange(report.id, "resolved")}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Resolved
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                              onClick={() => handleStatusChange(report.id, "dismissed")}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Dismiss
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts">
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="h-5 w-5 text-red-500" />
                    SOS Alert History
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    View and manage emergency SOS alerts triggered by users
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {alerts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-10 text-gray-500"
                    >
                      <Shield className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg">No SOS alerts found</p>
                      <p className="text-sm mt-2 max-w-md mx-auto">
                        When users trigger SOS alerts, they will appear here for immediate attention.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {alerts.map((alert, index) => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-gray-900 rounded-lg p-4 border border-red-500/30 shadow-lg hover:shadow-red-900/10 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-white flex items-center">
                                <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                                SOS Alert
                              </h3>
                              <p className="text-sm text-gray-400 mt-1">
                                {new Date(alert.created_at).toLocaleString()}
                              </p>
                            </div>
                            <Badge className="bg-red-500/20 text-red-400 animate-pulse">Emergency</Badge>
                          </div>
                          <p className="mt-2 text-gray-300">{alert.content}</p>

                          {alert.user && (
                            <div className="mt-3 bg-gray-800 p-2 rounded-md">
                              <p className="text-sm text-gray-300">
                                <span className="text-gray-500">User: </span>
                                {alert.user.name} ({alert.user.email})
                              </p>
                            </div>
                          )}

                          {alert.location && (
                            <div className="mt-2 bg-gray-800 p-2 rounded-md">
                              <p className="text-sm text-gray-300">
                                <span className="text-gray-500">Location: </span>
                                {alert.location.name} ({alert.location.latitude}, {alert.location.longitude})
                              </p>
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Mark as Handled
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            >
                              <Map className="mr-1 h-4 w-4" />
                              View on Map
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community">
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    Community Submissions
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    View and manage user stories and incident reports from the community section
                  </CardDescription>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <Button
                      size="sm"
                      variant={communityFilter === "all" ? "default" : "outline"}
                      onClick={() => setCommunityFilter("all")}
                      className={communityFilter === "all" ? "bg-orange-500 hover:bg-orange-600" : ""}
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      variant={communityFilter === "story" ? "default" : "outline"}
                      onClick={() => setCommunityFilter("story")}
                      className={communityFilter === "story" ? "bg-orange-500 hover:bg-orange-600" : ""}
                    >
                      <MessageCircle className="mr-1 h-4 w-4" />
                      Stories
                    </Button>
                    <Button
                      size="sm"
                      variant={communityFilter === "incident" ? "default" : "outline"}
                      onClick={() => setCommunityFilter("incident")}
                      className={communityFilter === "incident" ? "bg-orange-500 hover:bg-orange-600" : ""}
                    >
                      <AlertTriangle className="mr-1 h-4 w-4" />
                      Incidents
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {filteredCommunityReports.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-10 text-gray-500"
                    >
                      <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg">No community submissions found</p>
                      <p className="text-sm mt-2 max-w-md mx-auto">
                        When users submit stories or incidents in the community section, they will appear here.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {filteredCommunityReports.map((report, index) => (
                        <motion.div
                          key={report.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`bg-gray-900 rounded-lg p-4 border-l-4 ${
                            report.type === "incident" ? "border-yellow-500" : "border-blue-500"
                          } hover:bg-gray-800 transition-colors`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-white flex items-center">
                                {report.type === "incident" ? (
                                  <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                                ) : (
                                  <MessageCircle className="mr-2 h-4 w-4 text-blue-500" />
                                )}
                                {report.type === "incident" ? "Incident Report" : "User Story"}
                              </h3>
                              <p className="text-sm text-gray-400 mt-1">
                                {new Date(report.created_at).toLocaleString()}
                              </p>
                            </div>
                            <Badge
                              className={
                                report.type === "incident"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }
                            >
                              {report.type}
                            </Badge>
                          </div>
                          <p className="mt-2 text-gray-300">{report.content}</p>

                          {report.user && (
                            <div className="mt-3 bg-gray-800 p-2 rounded-md">
                              <p className="text-sm text-gray-300">
                                <span className="text-gray-500">Submitted by: </span>
                                {report.user.name} ({report.user.email})
                              </p>
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                            >
                              <Shield className="mr-1 h-4 w-4" />
                              Flag for Review
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Project Team Modal */}
        <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
          <DialogContent className="bg-gradient-to-b from-gray-900 to-gray-950 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                SafeWalk Project Team
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Meet the dedicated team behind the SafeWalk initiative working to create safer communities through
                technology.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              <div>
                <h3 className="text-lg font-medium text-orange-400 mb-2 flex items-center">
                  <Users2 className="h-5 w-5 mr-2" /> Project Development Team
                </h3>
                <p className="text-gray-300 mb-4">
                  Our talented team of developers and designers working together to create a safer community through
                  technology and innovation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-orange-900/10 transition-all"
                  >
                    <div className="relative w-full h-64">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-17%20at%2020.39.33_22ce0d2f.jpg-l4OitFAdXtBZB8ddEABvrLzMLCmNTF.jpeg"
                        alt="SafeWalk team presenting dashboard analytics"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-1 text-orange-400">Dashboard Development</h4>
                      <p className="text-sm text-gray-400">
                        Team members presenting the SafeWalk analytics dashboard, showcasing user engagement metrics and
                        safety data visualization.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-orange-900/10 transition-all"
                  >
                    <div className="relative w-full h-64">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-17%20at%2020.39.34_bdd78912.jpg-g5k94Qyu4sPyXsDtJJMOhhLekSa0x6.jpeg"
                        alt="SafeWalk interface demonstration"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-1 text-orange-400">Interface Design</h4>
                      <p className="text-sm text-gray-400">
                        Our UX/UI specialists demonstrating the intuitive SafeWalk interface designed to provide quick
                        access to safety features.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-medium text-orange-400 mb-2 flex items-center">
                  <Shield className="h-5 w-5 mr-2" /> Community Stakeholders
                </h3>
                <p className="text-gray-300 mb-4">
                  SafeWalk is a collaborative initiative supported by community leaders, educational institutions, and
                  safety advocates.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-orange-900/10 transition-all"
                  >
                    <div className="relative w-full h-64">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-17%20at%2020.39.33_a899003f.jpg-fMU0LgJfuOX1qXDu790ZumgDcyRTaT.jpeg"
                        alt="SafeWalk presentation to stakeholders"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-1 text-orange-400">Project Presentation</h4>
                      <p className="text-sm text-gray-400">
                        Team members presenting the "You are not alone" campaign, highlighting SafeWalk's commitment to
                        community safety.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-orange-900/10 transition-all"
                  >
                    <div className="relative w-full h-64">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-17%20at%2020.39.34_7140870f.jpg-xWmP80Wu8DSODljxsS7zdHjS6yke52.jpeg"
                        alt="SafeWalk team and stakeholders"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-1 text-orange-400">Collaborative Partnership</h4>
                      <p className="text-sm text-gray-400">
                        The extended SafeWalk team including faculty advisors, community representatives, and student
                        developers working together to create a safer environment.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-6 mt-6"
              >
                <h3 className="text-lg font-medium text-orange-400 mb-2">SafeWalk Mission</h3>
                <p className="text-orange-300/80">
                  SafeWalk is a societal initiative aimed at empowering communities through technology. Our mission is
                  to create safer environments by providing accessible tools for personal safety, community awareness,
                  and emergency response. Through collaborative efforts with educational institutions and community
                  stakeholders, we're building a network of support that ensures no one walks alone.
                </p>
              </motion.div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
