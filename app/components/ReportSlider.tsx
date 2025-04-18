"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, MapPin, Camera, Send, CheckCircle, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "../contexts/LanguageContext"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"

interface ReportSliderProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

type ReportType = "harassment" | "theft" | "assault" | "suspicious" | "other"

interface ReportData {
  type: ReportType
  description: string
  location: string
  urgency: number
  image?: File | null
  imagePreview?: string
}

const reportTypeInfo = {
  harassment: {
    title: "Harassment",
    description: "Report verbal or physical harassment incidents",
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
  },
  theft: {
    title: "Theft",
    description: "Report stolen items or theft attempts",
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    color: "bg-red-500/10 border-red-500/30 text-red-500",
  },
  assault: {
    title: "Assault",
    description: "Report physical assault or violence",
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    color: "bg-red-600/10 border-red-600/30 text-red-600",
  },
  suspicious: {
    title: "Suspicious Activity",
    description: "Report suspicious behavior or situations",
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    color: "bg-amber-500/10 border-amber-500/30 text-amber-500",
  },
  other: {
    title: "Other",
    description: "Report other safety concerns",
    icon: <AlertTriangle className="h-5 w-5 text-blue-500" />,
    color: "bg-blue-500/10 border-blue-500/30 text-blue-500",
  },
}

export default function ReportSlider({ isOpen, onClose, onSubmit }: ReportSliderProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [reportData, setReportData] = useState<ReportData>({
    type: "suspicious",
    description: "",
    location: "",
    urgency: 3,
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
      // Reset form when closed
      setTimeout(() => {
        setStep(1)
        setIsSuccess(false)
        setReportData({
          type: "suspicious",
          description: "",
          location: "",
          urgency: 3,
        })
      }, 300)
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Store report in localStorage for demo purposes
      const existingReports = localStorage.getItem("navbarReports")
      const reports = existingReports ? JSON.parse(existingReports) : []
      reports.push({
        ...reportData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: "pending",
      })
      localStorage.setItem("navbarReports", JSON.stringify(reports))
      localStorage.removeItem("hideSubmittedReports")

      toast({
        title: "Report Submitted",
        description: "Thank you for your report. It has been submitted successfully.",
      })

      // Reset form after 2 seconds
      setTimeout(() => {
        onSubmit()
        onClose()
      }, 2000)
    }, 1500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setReportData({
          ...reportData,
          image: file,
          imagePreview: reader.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNextStep = () => {
    if (step === 1 && !reportData.type) {
      toast({
        title: "Please select a report type",
        variant: "destructive",
      })
      return
    }

    if (step === 2 && !reportData.description) {
      toast({
        title: "Please provide a description",
        variant: "destructive",
      })
      return
    }

    if (step === 3 && !reportData.location) {
      toast({
        title: "Please provide a location",
        variant: "destructive",
      })
      return
    }

    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const getUrgencyLabel = (value: number) => {
    switch (value) {
      case 1:
        return "Low"
      case 2:
        return "Medium-Low"
      case 3:
        return "Medium"
      case 4:
        return "Medium-High"
      case 5:
        return "High"
      default:
        return "Medium"
    }
  }

  const getUrgencyColor = (value: number) => {
    switch (value) {
      case 1:
        return "text-green-500"
      case 2:
        return "text-blue-500"
      case 3:
        return "text-yellow-500"
      case 4:
        return "text-orange-500"
      case 5:
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-gray-950 border-l border-orange-500/20 shadow-xl z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/20 p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-semibold text-white">{t("reportIncident")}</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-800">
                <X className="h-5 w-5 text-gray-400" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Progress indicator */}
            <div className="px-4 pt-4">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 
                        ${
                          i < step
                            ? "bg-orange-500 text-white"
                            : i === step
                              ? "bg-orange-500/20 text-orange-500 border border-orange-500"
                              : "bg-gray-800 text-gray-500"
                        }`}
                    >
                      {i < step ? <CheckCircle className="h-4 w-4" /> : i}
                    </div>
                    <span className={`text-xs ${i <= step ? "text-orange-500" : "text-gray-500"}`}>
                      {i === 1 ? "Type" : i === 2 ? "Details" : i === 3 ? "Location" : "Review"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-4 h-[calc(100%-180px)] overflow-y-auto">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Report Submitted</h3>
                  <p className="text-gray-400 mb-6 max-w-xs">
                    Thank you for your report. Your contribution helps keep our community safe.
                  </p>
                  <div className="flex items-center gap-2 text-orange-500">
                    <Clock className="h-4 w-4" />
                    <span>You'll be notified of any updates</span>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Step 1: Report Type */}
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <h3 className="text-lg font-medium text-white mb-4">What type of incident are you reporting?</h3>

                      <RadioGroup
                        value={reportData.type}
                        onValueChange={(value) => setReportData({ ...reportData, type: value as ReportType })}
                        className="space-y-3"
                      >
                        {Object.entries(reportTypeInfo).map(([key, info]) => (
                          <Label
                            key={key}
                            htmlFor={`report-type-${key}`}
                            className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors
                              ${reportData.type === key ? info.color : "bg-gray-800/50 border-gray-700 hover:border-gray-600"}`}
                          >
                            <RadioGroupItem value={key} id={`report-type-${key}`} className="sr-only" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {info.icon}
                                <span className="font-medium">{info.title}</span>
                              </div>
                              <p className="text-sm text-gray-400 mt-1">{info.description}</p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                              ${reportData.type === key ? "border-current" : "border-gray-600"}`}
                            >
                              {reportData.type === key && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                            </div>
                          </Label>
                        ))}
                      </RadioGroup>
                    </motion.div>
                  )}

                  {/* Step 2: Description */}
                  {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <h3 className="text-lg font-medium text-white mb-4">Describe the incident</h3>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="description" className="text-sm text-gray-400 mb-1 block">
                            What happened? Please provide as much detail as possible.
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="I witnessed..."
                            value={reportData.description}
                            onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                            className="min-h-[120px] bg-gray-800/50 border-gray-700 focus:border-orange-500 text-white"
                          />
                        </div>

                        <div>
                          <Label className="text-sm text-gray-400 mb-1 block">How urgent is this report?</Label>
                          <div className="mt-6 mb-2">
                            <Slider
                              value={[reportData.urgency]}
                              min={1}
                              max={5}
                              step={1}
                              onValueChange={(value) => setReportData({ ...reportData, urgency: value[0] })}
                              className="py-1"
                            />
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-green-500">Low</span>
                            <span className={getUrgencyColor(reportData.urgency)}>
                              {getUrgencyLabel(reportData.urgency)}
                            </span>
                            <span className="text-red-500">High</span>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="image-upload" className="text-sm text-gray-400 mb-1 block">
                            Add a photo (optional)
                          </Label>
                          <div className="mt-2">
                            {reportData.imagePreview ? (
                              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                <Image
                                  src={reportData.imagePreview || "/placeholder.svg"}
                                  alt="Report image"
                                  fill
                                  className="object-cover"
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => setReportData({ ...reportData, image: null, imagePreview: undefined })}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <Label
                                htmlFor="image-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Camera className="w-8 h-8 text-gray-500 mb-2" />
                                  <p className="text-sm text-gray-400">
                                    <span className="font-medium text-orange-500">Click to upload</span> or drag and
                                    drop
                                  </p>
                                  <p className="text-xs text-gray-500">PNG, JPG, WEBP (max 5MB)</p>
                                </div>
                                <input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleFileChange}
                                />
                              </Label>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Location */}
                  {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <h3 className="text-lg font-medium text-white mb-4">Where did this happen?</h3>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="location" className="text-sm text-gray-400 mb-1 block">
                            Enter the location or address
                          </Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                              id="location"
                              type="text"
                              placeholder="123 Main St, City, State"
                              value={reportData.location}
                              onChange={(e) => setReportData({ ...reportData, location: e.target.value })}
                              className="w-full pl-10 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:border-orange-500 focus:ring-orange-500/20 text-white"
                            />
                          </div>
                        </div>

                        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-500/20 p-1.5 rounded-full">
                              <MapPin className="h-4 w-4 text-blue-500" />
                            </div>
                            <span className="text-sm font-medium text-white">Use current location</span>
                          </div>
                          <p className="text-xs text-gray-400">
                            Allow SafeWalk to access your location to automatically fill in your current position.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                            onClick={() =>
                              setReportData({ ...reportData, location: "Current Location (Mangalore Institute of Engineering and Technology, Moodabidri)" })
                            }
                          >
                            Use My Location
                          </Button>
                        </div>

                        <div className="bg-gray-800/30 border border-gray-700 rounded-lg h-40 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">Map preview will appear here</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Review */}
                  {step === 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <h3 className="text-lg font-medium text-white mb-4">Review your report</h3>

                      <div className="space-y-4">
                        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {reportTypeInfo[reportData.type].icon}
                            <h4 className="font-medium text-white">{reportTypeInfo[reportData.type].title}</h4>
                          </div>
                          <p className="text-sm text-gray-300 mb-3">{reportData.description}</p>

                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>{reportData.location}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <AlertTriangle className="h-4 w-4" />
                            <span>
                              Urgency:{" "}
                              <span className={getUrgencyColor(reportData.urgency)}>
                                {getUrgencyLabel(reportData.urgency)}
                              </span>
                            </span>
                          </div>

                          {reportData.imagePreview && (
                            <div className="mt-3 relative w-full h-32 rounded-lg overflow-hidden">
                              <Image
                                src={reportData.imagePreview || "/placeholder.svg"}
                                alt="Report image"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>

                        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                          <p className="text-sm text-orange-400">
                            By submitting this report, you confirm that the information provided is accurate to the best
                            of your knowledge.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {!isSuccess && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-950">
                <div className="flex justify-between">
                  {step > 1 ? (
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Back
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Cancel
                    </Button>
                  )}

                  {step < 4 ? (
                    <Button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    >
                      Continue <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">Submitting</span>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </>
                      ) : (
                        <>
                          Submit Report <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
