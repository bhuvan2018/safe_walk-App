"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { loginUser, loginWithGoogle, loginAdmin } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      let user
      if (isAdminLogin) {
        if (email === "officialpolice@gmail.com" && password === "officialpolice123@") {
          user = await loginAdmin(email, password)
        } else {
          throw new Error("Invalid admin credentials")
        }
      } else {
        user = await loginUser(email, password)
      }
      if (user) {
        toast({
          title: "Login Successful",
          description: `You have been logged in successfully as ${isAdminLogin ? "an admin" : "a user"}.`,
        })
        onClose()
        if (isAdminLogin) {
          router.push("/admin/dashboard")
        } else {
          router.push("/")
        }
      } else {
        throw new Error("Login failed")
      }
    } catch (error) {
      console.error("Error logging in:", error)
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during login.",
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
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully with Google.",
      })
      onClose()
      router.push("/")
    } catch (error) {
      console.error("Error logging in with Google:", error)
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during Google login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLoginType = () => {
    setIsAdminLogin(!isAdminLogin)
    setEmail("")
    setPassword("")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
              {isAdminLogin ? "Admin Login" : "User Login"}
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
              >
                {isLoading ? "Logging in..." : `Login as ${isAdminLogin ? "Admin" : "User"}`}
              </Button>
            </form>
            {!isAdminLogin && (
              <div className="mt-4">
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                >
                  <Image src="/google-logo.svg" alt="Google Logo" width={24} height={24} />
                  <span className="ml-2">Login with Google</span>
                </Button>
              </div>
            )}
            <div className="mt-6 text-center">
              <Button
                onClick={toggleLoginType}
                variant="link"
                className="text-orange-500 hover:text-orange-600 transition duration-300 ease-in-out"
              >
                {isAdminLogin ? "Switch to User Login" : "Switch to Admin Login"}
              </Button>
            </div>
            <button onClick={onClose} className="mt-4 text-gray-400 hover:text-white absolute top-2 right-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

