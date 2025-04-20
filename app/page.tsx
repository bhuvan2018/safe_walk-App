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
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, ArrowRight, HelpCircle, Shield } from "lucide-react"
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

      // Handle specific Firebase auth unavailable error
      const errorMessage =
        error instanceof Error && error.name === "FirebaseAuthUnavailableError"
          ? "Authentication service is currently unavailable. Please try again later."
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred"

      toast({
        title: "Login Failed",
        description: errorMessage,
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

      // Handle specific Firebase auth unavailable error
      const errorMessage =
        error instanceof Error && error.name === "FirebaseAuthUnavailableError"
          ? "Authentication service is currently unavailable. Please try again later."
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred"

      toast({
        title: "Signup Failed",
        description: errorMessage,
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

      // Handle specific Firebase auth unavailable error
      const errorMessage =
        error instanceof Error && error.name === "FirebaseAuthUnavailableError"
          ? "Authentication service is currently unavailable. Please try again later."
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred during Google login."

      toast({
        title: "Login Failed",
        description: errorMessage,
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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-gray-900 to-pink-950"></div>

        {/* Animated orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl"
          animate={{
            x: [mousePosition.x * 0.02, mousePosition.x * 0.03],
            y: [mousePosition.y * 0.02, mousePosition.y * 0.03],
          }}
          transition={{ type: "spring", damping: 50 }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 blur-3xl right-1/4 top-1/4"
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
          }}
          transition={{ type: "spring", damping: 50 }}
        />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('/subtle-pattern.png')] opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center z-10 max-w-md">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative w-24 h-24 mx-auto mb-4 group"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-pink-500/50">
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
            className="text-4xl font-bold tracking-tight mb-2"
          >
            <span className="bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">Safe</span>
            <span className="bg-gradient-to-r from-purple-500 to-teal-400 text-transparent bg-clip-text">Walk</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 text-lg"
          >
            Your companion for safer journeys
          </motion.p>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                {isAdminMode ? (
                  <span className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-400" />
                    Admin Access
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <User className="h-5 w-5 text-pink-400" />
                    Welcome Back
                  </span>
                )}
              </h2>
              <Button
                variant="ghost"
                onClick={handleAdminToggle}
                className={`text-sm ${isAdminMode ? "text-pink-400 hover:text-pink-300" : "text-purple-400 hover:text-purple-300"} hover:bg-white/10 transition-all duration-300`}
              >
                {isAdminMode ? "Switch to User" : "Admin Login"}
              </Button>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5 p-1 rounded-lg">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  disabled={isAdminMode}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-teal-400 data-[state=active]:text-white"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-sm font-medium text-gray-200 mb-1 flex items-center"
                    >
                      <Mail className="h-4 w-4 mr-2 text-pink-400" />
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
                        className={`w-full p-2 bg-white/5 border ${formErrors.loginEmail ? "border-red-400" : "border-white/20"} rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200`}
                        required
                      />
                      {formErrors.loginEmail && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
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
                  </div>
                  <div>
                    <label
                      htmlFor="login-password"
                      className="block text-sm font-medium text-gray-200 mb-1 flex items-center"
                    >
                      <Lock className="h-4 w-4 mr-2 text-pink-400" />
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
                        className={`w-full p-2 bg-white/5 border ${formErrors.loginPassword ? "border-red-400" : "border-white/20"} rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200`}
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
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-red-400">
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
                    <div className="flex justify-end mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          // Handle forgot password
                          toast({
                            title: "Password Reset",
                            description: "Check your email for password reset instructions.",
                          })
                        }}
                        className="text-xs text-pink-400 hover:text-pink-300"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 group ${
                      isAdminMode
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold"
                        : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold"
                    }`}
                  >
                    {isAdminMode ? "Access Admin Panel" : "Sign In"}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                {!isAdminMode && (
                  <div className="mt-6">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative px-4 text-sm text-gray-300 bg-transparent">Or continue with</div>
                    </div>
                    <div className="mt-4">
                      <Button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center"
                      >
                        <div className="w-5 h-5 mr-2 relative">
                          <Image
                            src="/google-logo.svg"
                            alt="Google Logo"
                            width={20}
                            height={20}
                            className="absolute inset-0"
                          />
                        </div>
                        <span>Continue with Google</span>
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
                      className="block text-sm font-medium text-gray-200 mb-1 flex items-center"
                    >
                      <Mail className="h-4 w-4 mr-2 text-teal-400" />
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
                        className={`w-full p-2 bg-white/5 border ${formErrors.signupEmail ? "border-red-400" : "border-white/20"} rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                        required
                      />
                      {formErrors.signupEmail && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
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
                  </div>
                  <div>
                    <label
                      htmlFor="signup-password"
                      className="block text-sm font-medium text-gray-200 mb-1 flex items-center"
                    >
                      <Lock className="h-4 w-4 mr-2 text-teal-400" />
                      Password
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
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
                        className={`w-full p-2 bg-white/5 border ${formErrors.signupPassword ? "border-red-400" : "border-white/20"} rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
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
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-red-400">
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
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-200 mb-1 flex items-center"
                    >
                      <Lock className="h-4 w-4 mr-2 text-teal-400" />
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
                        className={`w-full p-2 bg-white/5 border ${formErrors.confirmPassword ? "border-red-400" : "border-white/20"} rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
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
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-red-400">
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
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 group"
                  >
                    Create Account
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
                <div className="mt-6">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative px-4 text-sm text-gray-300 bg-transparent">Or continue with</div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={handleGoogleLogin}
                      className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center"
                    >
                      <div className="w-5 h-5 mr-2 relative">
                        <Image
                          src="/google-logo.svg"
                          alt="Google Logo"
                          width={20}
                          height={20}
                          className="absolute inset-0"
                        />
                      </div>
                      <span>Continue with Google</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Security badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 text-gray-300 text-sm bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <Lock className="h-3.5 w-3.5 text-teal-400" />
              <span>Secure Authentication</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
