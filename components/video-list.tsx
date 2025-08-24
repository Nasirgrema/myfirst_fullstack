"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, Play, Clock, FileVideo } from "lucide-react"
import Link from "next/link"

interface Video {
  id: string
  title: string
  artist: string
  filePath: string
  duration?: number
  fileSize?: number
  mimeType?: string
  createdAt: string
}

export function VideoList() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos")
      const data = await response.json()
      setVideos(data)
    } catch (error) {
      console.error("Failed to fetch videos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (videoId: string, title: string) => {
    try {
      const response = await fetch(`/api/videos/download/${videoId}`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${title}.mp4`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown duration"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {videos.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="relative inline-block">
            <FileVideo className="mx-auto h-20 w-20 mb-6 text-muted-foreground/30" />
            <div className="absolute inset-0 animate-pulse">
              <FileVideo className="mx-auto h-20 w-20 mb-6 text-primary/20" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gradient-accent mb-2">No Videos Yet</h3>
          <p className="text-muted-foreground text-lg">Upload your first video to get started</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="glass-card p-6 hover-lift group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gradient-primary mb-1">{video.title}</h3>
                    <p className="text-lg text-muted-foreground font-medium">{video.artist}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                      <FileVideo className="h-4 w-4 text-primary" />
                      <span className="font-medium">{formatFileSize(video.fileSize)}</span>
                    </span>
                    {video.duration && (
                      <span className="flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full">
                        <Clock className="h-4 w-4 text-secondary" />
                        <span className="font-medium">{formatDuration(video.duration)}</span>
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="relative group/thumb">
                    <video
                      src={video.filePath}
                      className="w-32 h-20 object-cover rounded-xl border-2 border-white/20 group-hover:border-primary/50 transition-all duration-300 shadow-lg"
                      controls={false}
                      muted
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="h-8 w-8 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <Link href={`/videos/watch/${video.id}`}>
                      <Button
                        className="gradient-accent text-white rounded-xl hover-lift shadow-lg w-full flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Watch Now
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(video.id, video.title)}
                      className="rounded-xl border-2 hover-lift w-full flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
