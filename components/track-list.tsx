"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PlayCircle, DownloadCloud } from "lucide-react"
import { useToast } from "./ui/use-toast"
import { useAudio } from "@/lib/audio-context"

type Track = {
  id: string
  title: string
  artist: string
  filePath: string
}

export function TrackList() {
  const [tracks, setTracks] = useState<Track[]>([])
  const { toast } = useToast()
  const { playTrack } = useAudio()

  useEffect(() => {
    fetch("/api/tracks")
      .then((res) => res.json())
      .then((data) => setTracks(data))
  }, [])

  const handlePlay = (track: Track) => {
    console.log("=== PLAY BUTTON CLICKED ===")
    console.log("Track:", track)
    console.log("File path:", track.filePath)
    console.log("Full URL:", window.location.origin + track.filePath)
    
    // Test if file is accessible
    fetch(track.filePath)
      .then(response => {
        console.log("File fetch response:", response.status, response.statusText)
        if (!response.ok) {
          console.error("File not accessible:", response.status)
        }
      })
      .catch(error => {
        console.error("File fetch error:", error)
      })
    
    playTrack(track)
    console.log("playTrack called")
  }

  const handleDownload = async (track: Track) => {
    try {
      const response = await fetch(`/api/download/${track.id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `${track.title}.mp3`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast({
          title: "Download Successful",
          description: `${track.title} has been downloaded.`,
        })
      } else {
        throw new Error("Download failed")
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the track.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {tracks.map((track, index) => (
        <motion.div
          key={track.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex items-center justify-between rounded-lg border border-secondary/20 bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <div>
            <h3 className="text-lg font-semibold">{track.title}</h3>
            <p className="text-sm text-muted-foreground">{track.artist}</p>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePlay(track)}
              className="text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <PlayCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDownload(track)}
              className="text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              <DownloadCloud className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
