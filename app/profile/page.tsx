"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Video, 
  Music, 
  HardDrive, 
  Calendar, 
  Settings,
  Download,
  Upload,
  Play,
  Activity,
  BarChart3,
  Palette,
  Bell,
  Shield,
  Edit3,
  Save
} from "lucide-react"

interface Track {
  id: string
  title: string
  artist: string
  createdAt: string
}

interface VideoItem {
  id: string
  title: string
  artist: string
  fileSize?: number
  createdAt: string
}

interface ProfileStats {
  totalTracks: number
  totalVideos: number
  totalStorage: number
  recentUploads: number
}

export default function ProfilePage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [stats, setStats] = useState<ProfileStats>({
    totalTracks: 0,
    totalVideos: 0,
    totalStorage: 0,
    recentUploads: 0
  })
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Media Vault User",
    email: "user@mediavault.com",
    bio: "Music and video enthusiast"
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Fetch tracks
      const tracksResponse = await fetch("/api/tracks")
      const tracksData = await tracksResponse.json()
      setTracks(Array.isArray(tracksData) ? tracksData : [])

      // Fetch videos
      const videosResponse = await fetch("/api/videos")
      const videosData = await videosResponse.json()
      setVideos(Array.isArray(videosData) ? videosData : [])

      // Calculate stats
      const totalStorage = videosData.reduce((sum: number, video: VideoItem) => 
        sum + (video.fileSize || 0), 0
      )
      
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      const recentTracks = tracksData.filter((track: Track) => 
        new Date(track.createdAt) > oneWeekAgo
      ).length
      
      const recentVideos = videosData.filter((video: VideoItem) => 
        new Date(video.createdAt) > oneWeekAgo
      ).length

      setStats({
        totalTracks: tracksData.length || 0,
        totalVideos: videosData.length || 0,
        totalStorage,
        recentUploads: recentTracks + recentVideos
      })
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 MB'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const saveProfile = () => {
    // Here you would typically save to backend
    setIsEditing(false)
    // toast success message
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
        {/* Profile Header */}
        <div className="glass-card p-8 mb-8 hover-lift">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-32 h-32 gradient-primary rounded-full flex items-center justify-center text-white shadow-2xl">
                  <User className="h-16 w-16" />
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border">
                  <Edit3 className="h-4 w-4" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Member since</p>
                <p className="font-semibold">January 2024</p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Bio</Label>
                    <Input
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-4xl font-bold text-gradient-secondary mb-2">
                    {profileData.name}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-2">{profileData.email}</p>
                  <p className="text-lg">{profileData.bio}</p>
                </div>
              )}

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button onClick={saveProfile} className="gradient-primary text-white flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card p-6 text-center hover-lift"
              >
                <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl font-bold">{stats.totalTracks}</p>
                <p className="text-sm text-muted-foreground">Audio Files</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card p-6 text-center hover-lift"
              >
                <div className="gradient-accent w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl font-bold">{stats.totalVideos}</p>
                <p className="text-sm text-muted-foreground">Video Files</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card p-6 text-center hover-lift"
              >
                <div className="gradient-secondary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <HardDrive className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl font-bold">{formatFileSize(stats.totalStorage)}</p>
                <p className="text-sm text-muted-foreground">Storage Used</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-card p-6 text-center hover-lift"
              >
                <div className="gradient-warm w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl font-bold">{stats.recentUploads}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </motion.div>
            </div>

            {/* Storage Usage */}
            <div className="glass-card p-6 hover-lift">
              <h3 className="text-xl font-bold text-gradient-primary mb-4 flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Used Storage</span>
                  <span className="font-semibold">{formatFileSize(stats.totalStorage)} / 5 GB</span>
                </div>
                <Progress value={(stats.totalStorage / (5 * 1024 * 1024 * 1024)) * 100} className="h-3" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 gradient-accent rounded-full"></div>
                    <span>Videos ({stats.totalVideos})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 gradient-primary rounded-full"></div>
                    <span>Audio ({stats.totalTracks})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6 hover-lift">
              <h3 className="text-xl font-bold text-gradient-accent mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[...tracks.slice(0, 3), ...videos.slice(0, 3)]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                      <div className="p-2 gradient-primary rounded-lg">
                        {tracks.find(t => t.id === item.id) ? 
                          <Music className="h-4 w-4 text-white" /> : 
                          <Video className="h-4 w-4 text-white" />
                        }
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">by {item.artist}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Quick Settings */}
            <div className="glass-card p-6 hover-lift">
              <h3 className="text-xl font-bold text-gradient-secondary mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </div>
                  <Button variant="outline" size="sm">On</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span>Theme</span>
                  </div>
                  <Button variant="outline" size="sm">Auto</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Privacy</span>
                  </div>
                  <Button variant="outline" size="sm">Private</Button>
                </div>
              </div>
            </div>

            {/* Usage Analytics */}
            <div className="glass-card p-6 hover-lift">
              <h3 className="text-xl font-bold text-gradient-warm mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                This Month
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Videos Watched</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Audio Played</span>
                  <span className="font-bold">45</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloads</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Uploads</span>
                  <span className="font-bold">{stats.recentUploads}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

