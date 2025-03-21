"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, CheckCircle, AlertTriangle, ArrowRight, Shield, BookOpen, Star } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Challenge {
  id: number
  title: string
  description: string
  completed: boolean
  icon: React.ElementType
  color: string
  points: number
  difficulty: "easy" | "medium" | "hard"
}

interface SafetyChallengesProps {
  onIncidentReportClick: () => void
  hasSubmittedIncident: boolean
}

export default function SafetyChallenges({ onIncidentReportClick, hasSubmittedIncident }: SafetyChallengesProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [showAlert, setShowAlert] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)
  const [completionPercentage, setCompletionPercentage] = useState(0)

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: "Incident Reporting",
      description: "Submit an incident report or share your story in the Community section.",
      completed: hasSubmittedIncident, // Initialize based on prop
      icon: AlertTriangle,
      color: "from-yellow-500 to-amber-500",
      points: 50,
      difficulty: "easy",
    },
    {
      id: 2,
      title: "Safety Awareness",
      description: "Review and acknowledge key safety tips and precautions.",
      completed: false,
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      points: 30,
      difficulty: "easy",
    },
    {
      id: 4,
      title: "Safety Education",
      description: "Complete the safety education module and pass the quiz.",
      completed: false,
      icon: BookOpen,
      color: "from-purple-500 to-violet-500",
      points: 60,
      difficulty: "medium",
    },
  ])

  // Update challenge completion status when hasSubmittedIncident changes
  useEffect(() => {
    if (hasSubmittedIncident) {
      setChallenges((prevChallenges) =>
        prevChallenges.map((challenge) => (challenge.id === 1 ? { ...challenge, completed: true } : challenge)),
      )
    }
  }, [hasSubmittedIncident])

  // Calculate total points and completion percentage
  useEffect(() => {
    const completed = challenges.filter((c) => c.completed)
    const earned = completed.reduce((sum, challenge) => sum + challenge.points, 0)
    const total = challenges.reduce((sum, challenge) => sum + challenge.points, 0)

    setTotalPoints(earned)
    setCompletionPercentage(Math.round((completed.length / challenges.length) * 100))
  }, [challenges])

  const completeChallenge = (id: number) => {
    setChallenges(challenges.map((challenge) => (challenge.id === id ? { ...challenge, completed: true } : challenge)))

    const challenge = challenges.find((c) => c.id === id)
    if (challenge) {
      toast({
        title: "Challenge Completed!",
        description: `Congratulations! You've earned ${challenge.points} points for completing "${challenge.title}".`,
      })
    }
  }

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    if (challenge.id === 1) {
      // If it's the incident reporting challenge
      onIncidentReportClick()
      // The completion will be handled by the parent component via hasSubmittedIncident
    } else {
      setShowAlert(true)
    }
  }

  const handleAlertConfirm = () => {
    if (selectedChallenge) {
      completeChallenge(selectedChallenge.id)
    }
    setShowAlert(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "hard":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const renderChallengeContent = () => {
    if (!selectedChallenge) return null

    switch (selectedChallenge.id) {
      case 2:
        return (
          <>
            <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
              <h4 className="font-semibold mb-2 text-orange-500">Key Safety Tips:</h4>
              <ul className="space-y-2">
                {[
                  "Always be aware of your surroundings",
                  "Trust your instincts",
                  "Keep your phone charged and easily accessible",
                  "Share your location with trusted contacts",
                  "Learn basic self-defense techniques",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-gray-400">
              By confirming, you acknowledge that you've read and understood these safety tips.
            </p>
          </>
        )
      case 4:
        return (
          <>
            <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
              <h4 className="font-semibold mb-2 text-orange-500">Safety Education Module:</h4>
              <p className="text-gray-300 mb-3">This module covers essential safety knowledge including:</p>
              <ul className="space-y-2">
                {[
                  "Recognizing potential threats",
                  "De-escalation techniques",
                  "Emergency response procedures",
                  "Digital safety and privacy",
                  "Mental health and well-being",
                ].map((topic, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-gray-400">By confirming, you'll complete the safety education module.</p>
          </>
        )
      default:
        return "Are you sure you want to complete this challenge?"
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-purple-500/5 opacity-50"></div>

      <CardHeader className="relative border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/10 p-2 rounded-full">
              <Award className="h-5 w-5 text-orange-500" />
            </div>
            <CardTitle className="text-white">{t("safetyChallenges")}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-800 px-3 py-1 rounded-full flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-white font-medium">{totalPoints} pts</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative pt-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-400 text-sm">Challenge Progress</p>
            <p className="text-white font-medium text-sm">{completionPercentage}% Complete</p>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              initial={{ width: "0%" }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <p className="text-gray-400 mb-6">
          Complete these challenges to enhance your safety skills and contribute to our community's well-being.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: challenge.id * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div
                className={`relative p-5 rounded-lg border ${
                  challenge.completed
                    ? "bg-green-900/20 border-green-500/30"
                    : "bg-gray-800/80 border-gray-700/50 hover:border-orange-500/30"
                } transition-all duration-300 h-full`}
              >
                {challenge.completed && (
                  <div className="absolute top-3 right-3 bg-green-500/20 p-1 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className={`bg-gradient-to-r ${challenge.color} p-2.5 rounded-lg`}>
                    <challenge.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className={`font-semibold ${challenge.completed ? "text-green-500" : "text-white"}`}>
                    {challenge.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-400 mb-4 min-h-[40px]">{challenge.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="text-sm text-white">{challenge.points} points</span>
                  </div>
                  <span className={`text-xs font-medium ${getDifficultyColor(challenge.difficulty)} capitalize`}>
                    {challenge.difficulty}
                  </span>
                </div>

                <Button
                  variant={challenge.completed ? "outline" : "default"}
                  size="sm"
                  className={`w-full ${
                    challenge.completed
                      ? "border-green-500 text-green-500 hover:bg-green-500/20"
                      : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                  } transition-all duration-300`}
                  onClick={() => handleChallengeClick(challenge)}
                  disabled={challenge.completed}
                >
                  {challenge.completed ? (
                    <>
                      <CheckCircle className="mr-1.5 h-4 w-4" /> Completed
                    </>
                  ) : (
                    <>
                      Start Challenge <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4 rounded-lg border border-orange-500/20"
        >
          <div className="flex items-start gap-3">
            <div className="bg-orange-500/20 p-2 rounded-full mt-0.5">
              <Award className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Complete All Challenges</h4>
              <p className="text-sm text-gray-300">
                Finish all safety challenges to earn the "Safety Champion" badge and unlock exclusive features.
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className="bg-gray-900 border border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">{selectedChallenge?.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">{renderChallengeContent()}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAlertConfirm}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

