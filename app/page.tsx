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
        
        {/* Sheikh Profile Section */}
        <section className="relative overflow-hidden py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="container"
          >
            <div className="glass-card p-8 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Sheikh Photo */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative order-2 lg:order-1"
                >
                  <div className="relative">
                    {/* Image Container with Gradient Border */}
                    <div className="relative p-1 gradient-primary rounded-3xl shadow-2xl mx-auto" style={{ maxWidth: '350px' }}>
                      <div className="bg-white rounded-[calc(1.5rem-4px)] p-2">
                        <div className="relative w-full rounded-[calc(1.5rem-8px)] shadow-xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
                          <img
                            src="/images/sheikh-nasir.jpg"
                            alt="Sheikh Dr. Buna Nasir"
                            className="w-full h-full object-cover transition-opacity duration-500"
                            onError={(e) => {
                              // Fallback if image doesn't load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.querySelector('.fallback-placeholder') as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          {/* Fallback placeholder */}
                          <div className="fallback-placeholder absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center" style={{ display: 'none' }}>
                            <div className="text-center">
                              <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl text-white">🕌</span>
                              </div>
                              <p className="text-muted-foreground text-sm">Sheikh Dr. Buna Nasir</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Decorative Elements - Removed animate-pulse */}
                    <div className="absolute -inset-4 gradient-primary rounded-3xl blur opacity-15"></div>
                    <div className="absolute -top-2 -right-2 p-3 gradient-warm rounded-full shadow-lg">
                      <span className="text-white text-2xl">🕌</span>
                    </div>
                  </div>
                </motion.div>

                {/* Sheikh Information */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-y-6 order-1 lg:order-2 text-center lg:text-left"
                >
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                      <span className="text-gradient-primary block">Sheikh Dr.</span>
                      <span className="text-gradient-accent block">Buna Nasir</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      Islamic Scholar & Spiritual Guide
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Welcome to the digital library of Sheikh Dr. Buna Nasir, featuring authentic Islamic teachings, 
                      Tafseer (Quranic commentary), and spiritual guidance.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                      <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm">
                        📖 Quranic Tafseer
                      </span>
                      <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full font-medium text-sm">
                        🎓 Islamic Education
                      </span>
                      <span className="px-4 py-2 bg-accent/10 text-accent-foreground rounded-full font-medium text-sm">
                        🕌 Spiritual Guidance
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="container text-center"
          >
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-bold">
                  <span className="text-gradient-primary block">Da'awa</span>
                  <span className="text-gradient-accent block">Platform</span>
                </h1>
                <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Your personal library for islamic  audio and video content. Stream, manage, and enjoy your media collection.
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
