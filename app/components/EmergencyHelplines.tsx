"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Shield, ExternalLink, Heart, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function EmergencyHelplines() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedHelpline, setSelectedHelpline] = useState("")

  const helplines = [
    {
      name: "SHAKTI SHALINI",
      number: "+10920 or (011) 24373736",
      description:
        "Driven by the vision of a world where all women enjoy full citizenship, earn a livelihood with dignity and generate wealth and value for all.",
      color: "from-purple-500/20 to-pink-500/20",
      buttonColor: "border-purple-500 text-purple-500 hover:bg-purple-500",
    },
    {
      name: "WOMEN POLICE STATION",
      number: "+918251233500",
      description:
        "Aims to reduce domestic violence through thousands of PeaceMakers who are trained in family and marriage counseling and all aspects of the Domestic Violence Act.",
      color: "from-blue-500/20 to-cyan-500/20",
      buttonColor: "border-blue-500 text-blue-500 hover:bg-blue-500",
    },
    {
      name: "CHILD WELFARE COMMITTEE",
      number: "08251230388",
      description:
        "Provides support to victims, from all over the country and abroad, of abuse and violence in order to empower them to become survivors.",
      color: "from-green-500/20 to-emerald-500/20",
      buttonColor: "border-green-500 text-green-500 hover:bg-green-500",
    },
  ]

  const handleCallClick = (helplineName: string) => {
    setSelectedHelpline(helplineName)
    setIsDialogOpen(true)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg blur-xl opacity-50"></div>
        <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-lg border border-orange-500/20 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              DOMESTIC VIOLENCE | HELPLINES
            </h2>
            <Shield className="h-6 w-6 text-orange-500" />
          </div>
          <p className="text-gray-300 mb-6 max-w-3xl">
            If you or someone you know is experiencing domestic violence, please reach out to these helplines for
            immediate assistance. Help is available 24/7, and your call could save a life.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {helplines.map((helpline, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group"
          >
            <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-500/30">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${helpline.color} opacity-30 group-hover:opacity-40 transition-opacity duration-300`}
              ></div>
              <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-orange-500/10 rounded-full blur-2xl"></div>

              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-orange-500" />
                    </div>
                    <CardTitle className="text-lg md:text-xl text-white group-hover:text-orange-500 transition-colors">
                      {helpline.name}
                    </CardTitle>
                  </div>
                  <div className="bg-gray-800/50 p-1.5 rounded-full">
                    <Phone className="h-4 w-4 text-orange-500" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-4">
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">{helpline.description}</p>

                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 group-hover:border-orange-500/20 transition-colors">
                  <p className="text-sm text-gray-400 mb-1">Emergency Contact:</p>
                  <p className="text-lg font-semibold text-white">{helpline.number}</p>
                </div>

                <Button
                  variant="outline"
                  className={`w-full ${helpline.buttonColor} hover:text-white group-hover:border-orange-500 group-hover:text-orange-500 group-hover:hover:bg-orange-500 group-hover:hover:text-white transition-all duration-300`}
                  onClick={() => handleCallClick(helpline.name)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  <span>Call Now</span>
                  <ExternalLink className="ml-auto h-3 w-3 opacity-70" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 bg-gray-900/60 border border-orange-500/10 rounded-lg p-4 text-center"
      >
        <p className="text-gray-300 text-sm">
          <span className="text-orange-500 font-semibold">Remember:</span> Your safety is paramount. These helplines are
          confidential and provide support without judgment.
        </p>
      </motion.div>

      {/* Thank You Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border border-orange-500/20 max-w-md">
          <DialogHeader>
            <div className="mx-auto bg-green-500/20 p-3 rounded-full mb-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <DialogTitle className="text-center text-xl text-white">Thank You for Reaching Out</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20 mb-4">
              <DialogDescription className="text-center text-gray-300">
                Your request to connect with {selectedHelpline} has been received. A support representative will contact
                you shortly. Your safety and well-being are our top priority.
              </DialogDescription>
            </div>
            <div className="flex flex-col gap-3 items-center mt-4">
              <p className="text-sm text-gray-400">Support is available 24/7</p>
              <Button
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

