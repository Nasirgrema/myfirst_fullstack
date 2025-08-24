"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Home, Upload, User, Video, Search } from "lucide-react"
import { motion } from "framer-motion"

export function Navigation() {
  const pathname = usePathname()

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 glass-card border-b border-white/20 dark:border-white/10"
    >
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center space-x-4">
          <div className="relative">
            <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg group-hover:shadow-xl transition-all duration-300 hover-lift animate-glow">
              <span className="text-xl font-bold">🎬</span>
            </div>
            <div className="absolute -inset-1 gradient-primary rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gradient-primary">
              MediaVault
            </span>
            <span className="text-sm text-muted-foreground font-medium">Audio & Video Library</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-3">
          <Link href="/" passHref>
            <Button 
              variant={pathname === "/" ? "default" : "ghost"}
              className={`group relative overflow-hidden transition-all duration-300 rounded-xl hover-lift ${
                pathname === "/" 
                  ? "gradient-primary text-white shadow-lg" 
                  : "hover:bg-primary/10 dark:hover:bg-primary/20"
              }`}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>

          <Link href="/upload" passHref>
            <Button 
              variant={pathname === "/upload" ? "default" : "ghost"}
              className={`group relative overflow-hidden transition-all duration-300 rounded-xl hover-lift ${
                pathname === "/upload" 
                  ? "gradient-warm text-white shadow-lg" 
                  : "hover:bg-amber-500/10 dark:hover:bg-amber-500/20"
              }`}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Audio
            </Button>
          </Link>

          <Link href="/search" passHref>
            <Button 
              variant={pathname === "/search" ? "default" : "ghost"}
              className={`group relative overflow-hidden transition-all duration-300 rounded-xl hover-lift ${
                pathname === "/search" 
                  ? "gradient-secondary text-white shadow-lg" 
                  : "hover:bg-cyan-500/10 dark:hover:bg-cyan-500/20"
              }`}
            >
              <Search className="mr-2 h-4 w-4" />
              Smart Search
            </Button>
          </Link>

          <Link href="/videos" passHref>
            <Button 
              variant={pathname === "/videos" || pathname.startsWith("/videos") ? "default" : "ghost"}
              className={`group relative overflow-hidden transition-all duration-300 rounded-xl hover-lift ${
                pathname === "/videos" || pathname.startsWith("/videos")
                  ? "gradient-accent text-white shadow-lg" 
                  : "hover:bg-purple-500/10 dark:hover:bg-purple-500/20"
              }`}
            >
              <Video className="mr-2 h-4 w-4" />
              Videos
            </Button>
          </Link>

          <Link href="/profile" passHref>
            <Button 
              variant={pathname === "/profile" ? "default" : "ghost"}
              className={`group relative overflow-hidden transition-all duration-300 rounded-xl hover-lift ${
                pathname === "/profile" 
                  ? "gradient-secondary text-white shadow-lg" 
                  : "hover:bg-cyan-500/10 dark:hover:bg-cyan-500/20"
              }`}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>

          <div className="ml-6 pl-6 border-l border-white/20 dark:border-white/10">
            <ModeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
