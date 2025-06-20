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

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (file && title && artist) {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      formData.append("artist", artist)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const data = await response.json()
        if (data.success) {
          toast({
            title: "Upload Successful",
            description: "Your track has been uploaded.",
          })
          router.push("/")
        } else {
          throw new Error("Upload failed")
        }
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "There was an error uploading your track.",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container py-8"
      >
        <h1 className="mb-8 text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Upload a Track
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg">
              Title:
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-card border-secondary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="artist" className="text-lg">
              Artist:
            </Label>
            <Input
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
              className="bg-card border-secondary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file" className="text-lg">
              Select an audio file:
            </Label>
            <Input
              id="file"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              required
              className="bg-card border-secondary/20"
            />
          </div>
          <Button
            type="submit"
            disabled={isUploading || !file || !title || !artist}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </motion.div>
    </main>
  )
}

