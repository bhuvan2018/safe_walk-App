"use client"

import { useEffect, useRef, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()
  const [isPlaying, setIsPlaying] = useState(false)

  const audioUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/intro_audio-GNyD2UR0hswS61fDIEom53Z3GlPVtW.mp3"

  useEffect(() => {
    const audio = new Audio(audioUrl)
    audioRef.current = audio

    const playAudio = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
        console.log("Audio started playing")
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Audio playback failed:", error.message)
          if (error.name !== "NotAllowedError") {
            toast({
              title: "Audio Playback Error",
              description: "Unable to play the audio. Please ensure your device supports audio playback.",
              variant: "destructive",
            })
          }
        }
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        playAudio()
      } else {
        audio.pause()
        setIsPlaying(false)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      audio.pause()
      audio.src = ""
    }
  }, [audioUrl, toast])

  return null // We don't need to render anything for this component
}

