"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { FileVideo, Upload } from "lucide-react"

export default function VideoUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      
      // Auto-fill title from filename
      if (!title && selectedFile.name) {
        const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, "")
        setTitle(nameWithoutExtension)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (file && title && artist) {
      setIsUploading(true)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      formData.append("artist", artist)

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90))
        }, 200)

        const response = await fetch("/api/videos/upload", {
          method: "POST",
          body: formData,
        })
        
        clearInterval(progressInterval)
        setUploadProgress(100)
        
        const data = await response.json()
        
        if (data.success) {
          toast({
            title: "Upload Successful",
            description: "Your video has been uploaded successfully.",
          })
          router.push("/videos")
        } else {
          throw new Error(data.error || "Upload failed")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        toast({
          title: "Upload Failed",
          description: errorMessage,
          variant: "destructive",
        })
        setUploadProgress(0)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gradient-accent mb-4">
            Upload Video
          </h1>
          <p className="text-xl text-muted-foreground">
            Share your video content with the world
          </p>
        </div>
        {/* Upload Form */}
        <div className="glass-card p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-lg font-semibold">
                  Video Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-12 rounded-xl border-2 focus:border-primary/50 transition-all"
                  placeholder="Enter video title"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="artist" className="text-lg font-semibold">
                  Creator/Artist
                </Label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  required
                  className="h-12 rounded-xl border-2 focus:border-primary/50 transition-all"
                  placeholder="Enter creator name"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="file" className="text-lg font-semibold">
                Video File
              </Label>
              <div className="relative">
                <Input
                  id="file"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  required
                  className="h-16 rounded-xl border-2 border-dashed hover:border-primary/50 focus:border-primary/50 transition-all file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-medium"
                />
              </div>
              
              {file && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileVideo className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {isUploading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 p-6 bg-primary/5 rounded-xl border"
              >
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Upload Progress</Label>
                  <span className="text-sm font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-3" />
                <p className="text-sm text-muted-foreground text-center">Uploading your video...</p>
              </motion.div>
            )}
            
            <Button
              type="submit"
              disabled={isUploading || !file || !title || !artist}
              className="w-full h-14 gradient-accent text-white rounded-xl hover-lift shadow-lg text-lg font-semibold"
            >
              {isUploading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5" />
                  Upload Video
                </div>
              )}
            </Button>
          </form>
        </div>
        
        {/* Info Card */}
        <div className="glass-card p-6 max-w-2xl mx-auto mt-8">
          <h3 className="text-xl font-bold text-gradient-primary mb-3">Supported Formats</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            {['MP4', 'MPEG', 'MOV', 'WebM', 'OGG'].map((format) => (
              <div key={format} className="p-3 bg-primary/10 rounded-lg">
                <span className="font-semibold text-primary">{format}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Maximum file size: <span className="font-semibold">100MB</span>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
