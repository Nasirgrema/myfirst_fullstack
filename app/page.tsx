"use client"

import { Navigation } from "@/components/navigation"
import { TrackList } from "@/components/track-list"
import { TafseerPlayer } from "@/components/tafseer-player"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Upload, Video, Headphones } from "lucide-react"
import { AudioProvider } from "@/lib/audio-context"

export default function Home() {
  return (
    <AudioProvider>
      <main className="min-h-screen">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="container text-center"
          >
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-bold">
                  <span className="text-gradient-primary block">Da'awa</span>
                  <span className="text-gradient-accent block">Platform</span>
                </h1>
                <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Your personal library for audio and video content. Stream, manage, and enjoy your media collection.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/videos">
                  <Button className="gradient-accent text-white px-8 py-4 rounded-2xl hover-lift shadow-lg flex items-center gap-3 text-lg font-semibold">
                    <Video className="h-6 w-6" />
                    Explore Videos
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button variant="outline" className="px-8 py-4 rounded-2xl hover-lift border-2 flex items-center gap-3 text-lg font-semibold">
                    <Upload className="h-6 w-6" />
                    Upload Content
                  </Button>
                </Link>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="glass-card p-6 hover-lift"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 gradient-primary rounded-2xl">
                      <Headphones className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gradient-primary">Audio</h3>
                      <p className="text-muted-foreground">High-quality streaming</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="glass-card p-6 hover-lift"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 gradient-accent rounded-2xl">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gradient-accent">Video</h3>
                      <p className="text-muted-foreground">Professional player</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="glass-card p-6 hover-lift"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 gradient-secondary rounded-2xl">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gradient-secondary">Stream</h3>
                      <p className="text-muted-foreground">Instant playback</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <div className="glass-card p-8 mb-8">
                <h2 className="text-4xl font-bold text-gradient-primary mb-4 text-center">
                  Audio Library
                </h2>
                <p className="text-xl text-muted-foreground text-center mb-8">
                  Browse and play your audio collection
                </p>
                <TrackList />
              </div>
            </motion.div>
          </div>
        </section>
        
        <TafseerPlayer />
      </main>
    </AudioProvider>
  )
}
