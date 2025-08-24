"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { VideoPlayer } from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft } from "lucide-react"
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

export default function WatchVideoPage() {
  const params = useParams()

  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchVideo(params.id as string)
    }
  }, [params.id])

  const fetchVideo = async (id: string) => {
    try {
      const response = await fetch("/api/videos")
      const videos = await response.json()
      const foundVideo = videos.find((v: Video) => v.id === id)
      
      if (foundVideo) {
        setVideo(foundVideo)
      } else {
        setError("Video not found")
      }
    } catch (error) {
      console.error("Failed to fetch video:", error)
      setError("Failed to load video")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!video) return

    try {
      const response = await fetch(`/api/videos/download/${video.id}`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${video.title}.mp4`
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !video) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">{error || "Video not found"}</h1>
            <Link href="/videos">
              <Button>Back to Videos</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="container py-12"
      >
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/videos">
            <Button variant="ghost" className="flex items-center gap-2 hover-lift rounded-xl">
              <ArrowLeft className="h-4 w-4" />
              Back to Library
            </Button>
          </Link>
        </div>

        {/* Video Player Container */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <VideoPlayer
              src={video.filePath}
              title={video.title}
              artist={video.artist}
            />
          </motion.div>

          {/* Video Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-8 hover-lift"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-gradient-primary mb-2">{video.title}</h1>
                  <p className="text-2xl text-muted-foreground font-medium">{video.artist}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-primary/5 rounded-xl border">
                    <span className="text-sm font-medium text-primary block mb-1">File Size</span>
                    <p className="text-lg font-semibold">{formatFileSize(video.fileSize)}</p>
                  </div>
                  <div className="p-4 bg-secondary/5 rounded-xl border">
                    <span className="text-sm font-medium text-secondary block mb-1">Format</span>
                    <p className="text-lg font-semibold">{video.mimeType?.split('/')[1]?.toUpperCase() || 'Unknown'}</p>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-xl border">
                    <span className="text-sm font-medium text-accent-foreground block mb-1">Uploaded</span>
                    <p className="text-lg font-semibold">{formatDate(video.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleDownload}
                  className="gradient-secondary text-white px-6 py-3 rounded-xl hover-lift shadow-lg flex items-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Video
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}
