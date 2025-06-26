"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Track = {
  id: string
  title: string
  artist: string
  filePath: string
}

type AudioContextType = {
  currentTrack: Track | null
  isPlaying: boolean
  playTrack: (track: Track) => void
  togglePlayPause: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const playTrack = (track: Track) => {
    console.log("=== AUDIO CONTEXT playTrack ===")
    console.log("Setting current track:", track)
    setCurrentTrack(track)
    setIsPlaying(true)
    console.log("State updated - isPlaying: true")
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlayPause }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}