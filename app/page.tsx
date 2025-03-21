"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { loginUser, loginWithGoogle, signUpUser } from "@/lib/auth"
import Image from "next/image"
import { useRouter } from "next/navigation"
import LoadingAnimation from "@/app/components/LoadingAnimation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, ArrowRight, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [formErrors, setFormErrors] = useState<{
    loginEmail?: string
    loginPassword?: string
    signupEmail?: string
    signupPassword?: string
    confirmPassword?: string
  }>({})
  const { toast } = useToast()
  const router = useRouter()

  // Background animation properties
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const validateForm = (type: "login" | "signup") => {
    const errors: any = {}
    let isValid = true

    if (type === "login") {
      if (!loginEmail) {
        errors.loginEmail = "Email is required"
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
        errors.loginEmail = "Email is invalid"
        isValid = false
      }

      if (!loginPassword) {
        errors.loginPassword = "Password is required"
        isValid = false
      }
    } else {
      if (!signupEmail) {
        errors.signupEmail = "Email is required"
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(signupEmail)) {
        errors.signupEmail = "Email is invalid"
        isValid = false
      }

      if (!signupPassword) {
        errors.signupPassword = "Password is required"
        isValid = false
      } else if (signupPassword.length < 6) {
        errors.signupPassword = "Password must be at least 6 characters"
        isValid = false
      }

      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password"
        isValid = false
      } else if (confirmPassword !== signupPassword) {
        errors.confirmPassword = "Passwords do not match"
        isValid = false
      }
    }

    setFormErrors(errors)
    return isValid
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm("login")) return

    setIsLoading(true)

    try {
      const user = await loginUser(loginEmail, loginPassword)
      if (user) {
        toast({
          title: "Login Successful",
          description: "Welcome back to SafeWalk!",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm("signup")) return

    setIsLoading(true)
    try {
      const user = await signUpUser(signupEmail, signupPassword)
      if (user) {
        toast({
          title: "Signup Successful",
          description: "Your account has been created successfully.",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const user = await loginWithGoogle()
      if (user) {
        toast({
          title: "Login Successful",
          description: "Welcome back to SafeWalk!",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Google login error:", error)
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during Google login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminToggle = () => {
    setIsAdminMode(!isAdminMode)
    setLoginEmail("")
    setLoginPassword("")
    setFormErrors({})
  }

  const handleResetPassword = () => {
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would call a password reset function
    toast({
      title: "Password Reset Email Sent",
      description: "Check your inbox for instructions to reset your password.",
    })
    setResetEmail("")
  }

  if (isLoading) {
    return <LoadingAnimation />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-3xl"
          animate={{
            x: mousePosition.x * 0.05,
            y: mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", damping: 50 }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full bg-orange-600/5 blur-3xl right-1/4 top-1/4"
          animate={{
            x: mousePosition.x * -0.03,
            y: mousePosition.y * -0.03,
          }}
          transition={{ type: "spring", damping: 50 }}
        />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative w-24 h-24 mx-auto mb-4 group"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-orange-500/50">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Consent%20isn't%20tricky-mALm1EyLyR0x4DyhcPVIQIW7qDGWrX.jpeg"
                alt="SafeWalk Logo"
                fill
                className="object-contain rounded-full"
                priority
              />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-2 tracking-tight"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">SafeWalk</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400"
          >
            Empowering Women's Safety
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/80 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-gray-800"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              {isAdminMode ? (
                <span className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-orange-500" />
                  Admin Login
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" />
                  User Authentication
                </span>
              )}
            </h2>
            <Button
              variant="ghost"
              onClick={handleAdminToggle}
              className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-300"
            >
              {isAdminMode ? "Switch to User" : "Admin Login"}
            </Button>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800/50 p-1 rounded-lg">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                disabled={isAdminMode}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
              >
                Signup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-medium text-gray-300 mb-1 flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-2 text-orange-500" />
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value)
                        if (formErrors.loginEmail) {
                          setFormErrors({ ...formErrors, loginEmail: undefined })
                        }
                      }}
                      className={`w-full p-2 bg-gray-800/50 border ${formErrors.loginEmail ? "border-red-500" : "border-gray-700"} rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                      required
                    />
                    {formErrors.loginEmail && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-5 w-5" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{formErrors.loginEmail}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                  {formErrors.loginEmail && <p className="text-red-500 text-xs mt-1">{formErrors.loginEmail}</p>}
                </div>
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-gray-300 mb-1 flex items-center"
                  >
                    <Lock className="h-4 w-4 mr-2 text-orange-500" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value)
                        if (formErrors.loginPassword) {
                          setFormErrors({ ...formErrors, loginPassword: undefined })
                        }
                      }}
                      className={`w-full p-2 bg-gray-800/50 border ${formErrors.loginPassword ? "border-red-500" : "border-gray-700"} rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {formErrors.loginPassword && (
                      <div className="absolute right-10 top-1/2 -translate-y-1/2 text-red-500">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-5 w-5" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{formErrors.loginPassword}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                  {formErrors.loginPassword && <p className="text-red-500 text-xs mt-1">{formErrors.loginPassword}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  {isAdminMode ? "Login as Admin" : "Login"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

              {!isAdminMode && (
                <div className="mt-6">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative px-4 text-sm text-gray-400 bg-gray-900/80">Or continue with</div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={handleGoogleLogin}
                      className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center"
                    >
                      <Image src="/google-logo.svg" alt="Google Logo" width={20} height={20} />
                      <span className="ml-2">Continue with Google</span>
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-sm font-medium text-gray-300 mb-1 flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-2 text-orange-500" />
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value)
                        if (formErrors.signupEmail) {
                          setFormErrors({ ...formErrors, signupEmail: undefined })
                        }
                      }}
                      className={`w-full p-2 bg-gray-800/50 border ${formErrors.signupEmail ? "border-red-500" : "border-gray-700"} rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                      required
                    />
                    {formErrors.signupEmail && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-5 w-5" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{formErrors.signupEmail}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                  {formErrors.signupEmail && <p className="text-red-500 text-xs mt-1">{formErrors.signupEmail}</p>}
                </div>
                <div>
                  <label
                    htmlFor="signup-password"
                    className="block text-sm font-medium text-gray-300 mb-1 flex items-center"
                  >
                    <Lock className="h-4 w-4 mr-2 text-orange-500" />
                    Password
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 ml-1 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Password must be at least 6 characters</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value)
                        if (formErrors.signupPassword) {
                          setFormErrors({ ...formErrors, signupPassword: undefined })
                        }
                      }}
                      className={`w-full p-2 bg-gray-800/50 border ${formErrors.signupPassword ? "border-red-500" : "border-gray-700"} rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {formErrors.signupPassword && (
                      <div className="absolute right-10 top-1/2 -translate-y-1/2 text-red-500">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-5 w-5" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{formErrors.signupPassword}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                  {formErrors.signupPassword && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.signupPassword}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-300 mb-1 flex items-center"
                  >
                    <Lock className="h-4 w-4 mr-2 text-orange-500" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (formErrors.confirmPassword) {
                          setFormErrors({ ...formErrors, confirmPassword: undefined })
                        }
                      }}
                      className={`w-full p-2 bg-gray-800/50 border ${formErrors.confirmPassword ? "border-red-500" : "border-gray-700"} rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {formErrors.confirmPassword && (
                      <div className="absolute right-10 top-1/2 -translate-y-1/2 text-red-500">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-5 w-5" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{formErrors.confirmPassword}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  Create Account
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
              <div className="mt-6">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative px-4 text-sm text-gray-400 bg-gray-900/80">Or continue with</div>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center"
                  >
                    <Image src="/google-logo.svg" alt="Google Logo" width={20} height={20} />
                    <span className="ml-2">Continue with Google</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800">
            <Lock className="h-3.5 w-3.5 text-orange-500" />
            <span>Secure Authentication</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

