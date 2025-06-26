"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Clock,
  BookOpen,
  Shuffle,
  Repeat
} from "lucide-react"
import { useAudio } from "@/lib/audio-context"

type Track = {
  id: string
  title: string
  artist: string
  filePath: string
}

export function TafseerPlayer() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  
  // Use context for current track and playing state
  const { currentTrack, isPlaying, togglePlayPause } = useAudio()
  
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    fetch("/api/tracks")
      .then((res) => res.json())
      .then((data) => setTracks(data))
  }, [])

  // Load new track when currentTrack changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      console.log("Loading new track:", currentTrack.filePath)
      setIsLoaded(false)
      audioRef.current.src = currentTrack.filePath
      audioRef.current.load()
    }
  }, [currentTrack])

  // Play/pause when isPlaying changes - but only after track is loaded
  useEffect(() => {
    console.log("=== PLAYER useEffect ===")
    console.log("isPlaying:", isPlaying)
    console.log("currentTrack:", currentTrack)
    console.log("isLoaded:", isLoaded)
    console.log("audioRef.current:", audioRef.current)
    
    if (audioRef.current && currentTrack && isLoaded) {
      if (isPlaying) {
        console.log("Attempting to play:", currentTrack.filePath)
        audioRef.current.play()
          .then(() => {
            console.log("✅ Audio play successful")
          })
          .catch(error => {
            console.error("❌ Audio play failed:", error)
          })
      } else {
        audioRef.current.pause()
        console.log("Audio paused")
      }
    } else {
      console.log("Not ready to play - missing audioRef, currentTrack, or not loaded")
    }
  }, [isPlaying, currentTrack, isLoaded])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  const handleSkipBack = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length)
      setCurrentTrackIndex(randomIndex)
    } else {
      setCurrentTrackIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : tracks.length - 1))
    }
  }

  const handleSkipForward = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length)
      setCurrentTrackIndex(randomIndex)
    } else {
      setCurrentTrackIndex((prevIndex) => (prevIndex < tracks.length - 1 ? prevIndex + 1 : 0))
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(progress)
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
      console.log("Audio loaded, duration:", audioRef.current.duration)
    }
  }

  const handleCanPlay = () => {
    console.log("Audio can play - setting isLoaded to true")
    setIsLoaded(true)
  }

  const handleLoadStart = () => {
    console.log("Audio load started")
    setIsLoaded(false)
  }

  const handleError = (e: any) => {
    console.error("Audio error:", e)
    console.error("Audio error details:", e.target?.error)
    setIsLoaded(false)
  }

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      const time = (value[0] / 100) * audioRef.current.duration
      audioRef.current.currentTime = time
      setProgress(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleTrackEnd = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      handleSkipForward()
    }
  }

  // Don't render if no current track
  if (!currentTrack) {
    return null
  }

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnd}
        onCanPlay={handleCanPlay}
        onLoadStart={handleLoadStart}
        onError={handleError}
        preload="metadata"
      />

      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
          className="fixed bottom-0 left-0 right-0 z-40"
        >
          {/* Main Player */}
          <div className="border-t border-emerald-200/20 bg-gradient-to-r from-emerald-50/95 via-white/95 to-amber-50/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-emerald-900/95">
            <div className="container">
              {/* Progress Bar */}
              <div className="py-2">
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  onValueChange={handleSliderChange}
                  className="w-full"
                />
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between py-3">
                {/* Left: Track Info */}
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-md">
                    <span className="text-white text-xl">📖</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                      {currentTrack.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentTrack.artist}
                    </p>
                    {!isLoaded && (
                      <p className="text-xs text-amber-500">Loading...</p>
                    )}
                  </div>
                </div>
                
                {/* Center: Play Controls */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSkipBack}
                    className="text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={togglePlayPause}
                    disabled={!isLoaded}
                    className="text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSkipForward}
                    className="text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Right: Volume Controls */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMute}
                    className="text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="w-24">
                    <Slider
                      value={[volume]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
