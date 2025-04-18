"use client"

import { useState, useEffect } from "react"
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
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
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
  }, [])

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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Manage safety reports, alerts, and user data</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <Activity className="mr-1 h-3 w-3" />
            System Online
          </Badge>
          <Button size="sm" variant="outline" className="gap-1">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
            onClick={() => setIsTeamModalOpen(true)}
          >
            <Users2 className="h-4 w-4" />
            <span className="hidden sm:inline">Project Team</span>
          </Button>
          <Button size="sm" variant="destructive" className="gap-1" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              User Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Active Users</span>
                  <span className="text-white">{userStats.activeUsers}</span>
                </div>
                <Progress value={Math.min(userStats.activeUsers * 5, 100)} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">New Registrations</span>
                  <span className="text-white">{userStats.newRegistrations}</span>
                </div>
                <Progress value={Math.min(userStats.newRegistrations * 10, 100)} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Verified Accounts</span>
                  <span className="text-white">{userStats.verifiedAccounts}</span>
                </div>
                <Progress value={Math.min(userStats.verifiedAccounts * 5, 100)} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Safety Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">SOS Alerts</p>
                  <p className="text-sm text-gray-400">Last 24 hours</p>
                </div>
                <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-none">{alerts.length}</Badge>
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
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Map className="h-5 w-5 text-green-400" />
              Safety Zones
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="reports">Incident Reports</TabsTrigger>
          <TabsTrigger value="alerts">SOS Alerts</TabsTrigger>
          <TabsTrigger value="community">Community Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Incident Reports</CardTitle>
              <CardDescription className="text-gray-400">
                Review and manage user-submitted incident reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <AlertTriangle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No incident reports found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="bg-gray-900 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white">
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Incident
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">{new Date(report.created_at).toLocaleString()}</p>
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
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                          onClick={() => handleStatusChange(report.id, "investigating")}
                        >
                          <Clock className="mr-1 h-4 w-4" />
                          Investigating
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                          onClick={() => handleStatusChange(report.id, "resolved")}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Resolved
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                          onClick={() => handleStatusChange(report.id, "dismissed")}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">SOS Alert History</CardTitle>
              <CardDescription className="text-gray-400">
                View and manage emergency SOS alerts triggered by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Shield className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No SOS alerts found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="bg-gray-900 rounded-lg p-4 border border-red-500/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white flex items-center">
                            <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                            SOS Alert
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">{new Date(alert.created_at).toLocaleString()}</p>
                        </div>
                        <Badge className="bg-red-500/20 text-red-400">Emergency</Badge>
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

                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Mark as Handled
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Map className="mr-1 h-4 w-4" />
                          View on Map
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Community Submissions</CardTitle>
              <CardDescription className="text-gray-400">
                View and manage user stories and incident reports from the community section
              </CardDescription>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant={communityFilter === "all" ? "default" : "outline"}
                  onClick={() => setCommunityFilter("all")}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={communityFilter === "story" ? "default" : "outline"}
                  onClick={() => setCommunityFilter("story")}
                >
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Stories
                </Button>
                <Button
                  size="sm"
                  variant={communityFilter === "incident" ? "default" : "outline"}
                  onClick={() => setCommunityFilter("incident")}
                >
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  Incidents
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredCommunityReports.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No community submissions found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCommunityReports.map((report) => (
                    <div key={report.id} className="bg-gray-900 rounded-lg p-4">
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
                          <p className="text-sm text-gray-400 mt-1">{new Date(report.created_at).toLocaleString()}</p>
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

                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                        >
                          <Shield className="mr-1 h-4 w-4" />
                          Flag for Review
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Project Team Modal */}
      <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-500">SafeWalk Project Team</DialogTitle>
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
                <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                  <div className="relative w-full h-64">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-17%20at%2020.39.33_22ce0d2f.jpg-l4OitFAdXtBZB8ddEABvrLzMLCmNTF.jpeg"
                      alt="SafeWalk team presenting dashboard analytics"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium mb-1">Dashboard Development</h4>
                    <p className="text-sm text-gray-400">
                      Team members presenting the SafeWalk analytics dashboard, showcasing user engagement metrics and
                      safety data visualization.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                  <div className="relative w-full h-64">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-17%20at%2020.39.34_bdd78912.jpg-g5k94Qyu4sPyXsDtJJMOhhLekSa0x6.jpeg"
                      alt="SafeWalk interface demonstration"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium mb-1">Interface Design</h4>
                    <p className="text-sm text-gray-400">
                      Our UX/UI specialists demonstrating the intuitive SafeWalk interface designed to provide quick
                      access to safety features.
                    </p>
                  </div>
                </div>
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
                <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                  <div className="relative w-full h-64">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-17%20at%2020.39.33_a899003f.jpg-fMU0LgJfuOX1qXDu790ZumgDcyRTaT.jpeg"
                      alt="SafeWalk presentation to stakeholders"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium mb-1">Project Presentation</h4>
                    <p className="text-sm text-gray-400">
                      Team members presenting the "You are not alone" campaign, highlighting SafeWalk's commitment to
                      community safety.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                  <div className="relative w-full h-64">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-17%20at%2020.39.34_7140870f.jpg-xWmP80Wu8DSODljxsS7zdHjS6yke52.jpeg"
                      alt="SafeWalk team and stakeholders"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium mb-1">Collaborative Partnership</h4>
                    <p className="text-sm text-gray-400">
                      The extended SafeWalk team including faculty advisors, community representatives, and student
                      developers working together to create a safer environment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mt-6">
              <h3 className="text-lg font-medium text-orange-400 mb-2">SafeWalk Mission</h3>
              <p className="text-orange-300/80">
                SafeWalk is a societal initiative aimed at empowering communities through technology. Our mission is to
                create safer environments by providing accessible tools for personal safety, community awareness, and
                emergency response. Through collaborative efforts with educational institutions and community
                stakeholders, we're building a network of support that ensures no one walks alone.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
