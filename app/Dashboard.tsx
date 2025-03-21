"\"use client"

import EmergencyHelplines from "@/app/components/EmergencyHelplines"
import AIStats from "@/app/components/AIStats"
import SafetyZones from "@/app/components/SafetyZones"
import SafetyChallenges from "@/app/components/SafetyChallenges"
import CrowdsourcedData from "@/app/components/CrowdsourcedData"
import Community from "@/app/components/Community"
import { useLanguage } from "@/app/contexts/LanguageContext"
import { useState } from "react"
import AudioPlayer from "@/app/components/AudioPlayer"
import SafetyRating from "@/app/components/SafetyRating"
import CrowdsourcedSafetyData from "@/app/components/CrowdsourcedSafetyData"
import StorySubmission from "@/app/components/StorySubmission"

export default function Dashboard() {
  const { t } = useLanguage()
  const [hasSubmittedIncident, setHasSubmittedIncident] = useState(false)

  const handleIncidentReportClick = () => {
    setHasSubmittedIncident(true)
  }

  return (
    <main className="flex flex-col md:flex-row gap-8 p-4 md:p-8">
      <AudioPlayer />
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <EmergencyHelplines />
        <AIStats />
        <SafetyZones />
        <SafetyChallenges
          onIncidentReportClick={handleIncidentReportClick}
          hasSubmittedIncident={hasSubmittedIncident}
        />
        <CrowdsourcedData />
        <Community onIncidentSubmit={handleIncidentReportClick} />
        <SafetyRating />
        <CrowdsourcedSafetyData />
        <StorySubmission />
      </div>
    </main>
  )
}

