"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Send, MapPin, AlertTriangle, MessageSquare, ArrowLeft, Shield, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import type React from "react"

interface Message {
  type: "user" | "bot"
  content: string
  timestamp: string
}

interface Feature {
  icon: React.ElementType
  text: string
  color: string
  response: string
  keywords: string[]
  followUpQuestions?: string[]
}

const features: Feature[] = [
  {
    icon: AlertTriangle,
    text: "Emergency Assistance",
    color: "bg-red-500",
    response:
      "For immediate emergency assistance, use the SOS button. It will alert your emergency contacts and local authorities. Would you like to know more about our emergency features?",
    keywords: ["emergency", "help", "sos", "danger", "urgent", "assistance"],
    followUpQuestions: [
      "How does the SOS feature work?",
      "Who gets notified in an emergency?",
      "How can I add emergency contacts?",
    ],
  },
  {
    icon: MessageSquare,
    text: "Incident Reporting",
    color: "bg-blue-500",
    response:
      "You can report incidents through our Community section. Your reports help keep others informed and safe. Would you like to know how to submit a report?",
    keywords: ["report", "incident", "submit", "inform", "community"],
    followUpQuestions: [
      "What types of incidents should I report?",
      "How detailed should my report be?",
      "Can I report anonymously?",
    ],
  },
  {
    icon: MapPin,
    text: "Safety Zones",
    color: "bg-green-500",
    response:
      "Our Safety Zones feature shows safe areas near you and provides safety ratings for different locations. Would you like to learn how to find safe zones in your area?",
    keywords: ["safe", "zone", "area", "location", "map", "route"],
    followUpQuestions: [
      "How are safety zones determined?",
      "Can I contribute to safety ratings?",
      "How often is the safety data updated?",
    ],
  },
  {
    icon: Shield,
    text: "Personal Safety Tips",
    color: "bg-purple-500",
    response:
      "Here are some essential safety tips: Stay aware of your surroundings, trust your instincts, keep your phone charged, and share your location with trusted contacts. Would you like more specific safety advice?",
    keywords: ["tips", "advice", "safety", "precautions", "protect"],
    followUpQuestions: [
      "What should I do if I feel unsafe?",
      "How can I stay safe while traveling?",
      "What are some basic self-defense tips?",
    ],
  },
  {
    icon: Phone,
    text: "Emergency Contacts",
    color: "bg-yellow-500",
    response:
      "You can manage your emergency contacts in the Emergency Contacts section. These contacts will be notified immediately when you trigger an SOS alert. Would you like to know how to add emergency contacts?",
    keywords: ["contact", "number", "phone", "emergency contact", "helpline"],
    followUpQuestions: [
      "How many emergency contacts can I add?",
      "How do I update my emergency contacts?",
      "What information do my contacts receive?",
    ],
  },
]

const findRelevantFeature = (input: string): Feature | undefined => {
  const lowercaseInput = input.toLowerCase()
  return features.find((feature) => feature.keywords.some((keyword) => lowercaseInput.includes(keyword.toLowerCase())))
}

const generateResponse = (input: string): string => {
  const feature = findRelevantFeature(input)
  if (feature) {
    return feature.response
  }

  // Generic responses for common queries
  if (input.toLowerCase().includes("hello") || input.toLowerCase().includes("hi")) {
    return "Hello! How can I help you today? You can ask me about emergency assistance, incident reporting, safety zones, or personal safety tips."
  }

  if (input.toLowerCase().includes("thank")) {
    return "You're welcome! Your safety is our priority. Is there anything else you'd like to know?"
  }

  return "I'm not sure I understand. Could you try rephrasing your question? You can ask me about emergency assistance, incident reporting, safety zones, or personal safety tips."
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [showFeatures, setShowFeatures] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          type: "bot",
          content: "Hello! I'm the SafeWalk Assistant. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ])
      setShowFeatures(true)
      toast({
        title: "SafeWalk Assistant",
        description: "Your helper is ready to assist you.",
        duration: 3000,
      })
    }
  }, [isOpen, toast])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [])

  const simulateTyping = async (response: string) => {
    setIsTyping(true)
    // Simulate typing delay based on message length
    await new Promise((resolve) => setTimeout(resolve, Math.min(response.length * 20, 2000)))
    setIsTyping(false)
    return response
  }

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = {
        type: "user" as const,
        content: input,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setShowFeatures(false)

      const response = generateResponse(input)
      await simulateTyping(response)

      const botMessage = {
        type: "bot" as const,
        content: response,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, botMessage])

      // Show follow-up questions if available
      const relevantFeature = findRelevantFeature(input)
      if (relevantFeature?.followUpQuestions) {
        await simulateTyping("Here are some related questions you might be interested in:")
        const followUpMessage = {
          type: "bot" as const,
          content: relevantFeature.followUpQuestions.join("\n"),
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, followUpMessage])
      }
    }
  }

  const handleFeatureClick = async (feature: Feature) => {
    setShowFeatures(false)
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: `Tell me about ${feature.text}`,
        timestamp: new Date().toISOString(),
      },
    ])

    await simulateTyping(feature.response)

    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        content: feature.response,
        timestamp: new Date().toISOString(),
      },
    ])

    if (feature.followUpQuestions) {
      await simulateTyping("Here are some common questions about this topic:")
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: feature.followUpQuestions!.join("\n"),
          timestamp: new Date().toISOString(),
        },
      ])
    }
  }

  const handleBack = () => {
    setShowFeatures(true)
    setMessages([
      {
        type: "bot",
        content: "Hello! I'm the SafeWalk Assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ])
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <motion.button
        className="w-12 h-12 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <Bot className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed bottom-4 right-4 z-50 ${
              isOpen ? "w-80 h-[500px]" : "w-auto h-auto"
            } bg-gray-900 rounded-lg shadow-lg transition-all duration-300 ease-in-out overflow-hidden border border-gray-800`}
          >
            <div className="sticky top-0 z-50 bg-orange-500 text-white p-4 flex justify-between items-center border-b border-orange-600 shadow-md">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6" />
                <h3 className="font-bold text-lg">SafeWalk Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                {!showFeatures && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="text-white hover:bg-orange-600 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-orange-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 h-[calc(500px-8rem)] overflow-y-auto" ref={scrollAreaRef}>
              <div className="p-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`mb-4 ${message.type === "user" ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`inline-block max-w-[80%] ${
                        message.type === "user" ? "bg-orange-500" : "bg-gray-700"
                      } text-white p-3 rounded-lg`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                      <p className="text-xs text-gray-300 mt-1">{formatTimestamp(message.timestamp)}</p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-gray-400"
                  >
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </motion.div>
                )}
                {showFeatures && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {features.map((feature, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`h-auto py-4 px-2 flex flex-col items-center text-center rounded-lg ${feature.color} text-white`}
                        onClick={() => handleFeatureClick(feature)}
                      >
                        <feature.icon className="mb-2" />
                        <span className="text-sm">{feature.text}</span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-grow bg-gray-800 text-white border-gray-700"
                />
                <Button onClick={handleSend} className="bg-orange-500 hover:bg-orange-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: #666;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  )
}

