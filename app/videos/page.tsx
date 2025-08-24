"use client"

import { Navigation } from "@/components/navigation"
import { VideoList } from "@/components/video-list"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function VideosPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="container py-12"
      >
        {/* Header Section */}
        <div className="glass-card p-8 mb-8 hover-lift">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-gradient-accent">
                Video Library
              </h1>
              <p className="text-xl text-muted-foreground">
                Stream and manage your video collection
              </p>
            </div>
            <Link href="/videos/upload">
              <Button className="gradient-accent text-white px-6 py-3 rounded-xl hover-lift shadow-lg flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5" />
                Upload Video
              </Button>
            </Link>
          </div>
        </div>

        {/* Video Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <VideoList />
        </motion.div>
      </motion.div>
    </main>
  )
}
