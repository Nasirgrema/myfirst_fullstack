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
  BookOpen  // Add this line
} from "lucide-react"

type Track = {
  id: string
  title: string
  artist: string
  filePath: string
}

export function TafseerPlayer() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    fetch("/api/tracks")
      .then((res) => res.json())
      .then((data) => setTracks(data))
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

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
    }
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

  const currentTrack = tracks[currentTrackIndex]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
        className="fixed bottom-0 left-0 right-0 z-40"
      >
        {/* Expanded Player */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-emerald-900/95 via-slate-900/95 to-amber-900/95 backdrop-blur-xl border-t border-emerald-200/20"
            >
              <div className="container py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {/* Album Art Placeholder */}
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl"></span>
                    </div>
                    
                    {/* Track Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{currentTrack?.title}</h3>
                      <p className="text-emerald-200">{currentTrack?.artist}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-3 w-3 text-amber-300" />
                        <span className="text-xs text-amber-200">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsShuffle(!isShuffle)}
                      className={`text-white hover:bg-white/10 ${isShuffle ? 'text-amber-300' : ''}`}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsRepeat(!isRepeat)}
                      className={`text-white hover:bg-white/10 ${isRepeat ? 'text-emerald-300' : ''}`}
                    >
                      <Repeat className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`text-white hover:bg-white/10 ${isFavorite ? 'text-red-400' : ''}`}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-emerald-500 [&_[role=slider]]:to-amber-500 [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-lg"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between py-3">
              {/* Left: Track Info */}
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-md">
                  <span className="text-white text-xl"></span>
                </div>
                <div className="min-w-0 flex-1">
                  {currentTrack && (
                    <>
                      <p className="font-medium text-sm truncate bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                        {currentTrack.title}
                      </p>
                      <p className="text-sm text-emerald-200">
                        {currentTrack.artist}
                      </p>
                    </>
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
                  className="text-primary hover:bg-primary hover:text-primary-foreground"
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
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="[&_[role=slider]]:bg-secondary [&_[role=slider]]:w-24 [&_[role=slider]]:h-1 [&_[role=slider]]:rounded-full [&_[role=slider]]:shadow-lg [&_[role=slider]]:border-0 [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-emerald-500 [&_[role=slider]]:to-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
