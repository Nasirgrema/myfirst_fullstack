"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Home, Upload, User } from "lucide-react"
import { motion } from "framer-motion"

export function Navigation() {
  const pathname = usePathname()

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-emerald-200/20 bg-gradient-to-r from-emerald-50/95 via-white/95 to-amber-50/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-emerald-900/95"
    >
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
            <span className="text-lg font-bold">📖</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
              Tafseer Store
            </span>
            <span className="text-xs text-muted-foreground">Islamic Audio Library</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2">
          <Link href="/" passHref>
            <Button 
              variant={pathname === "/" ? "default" : "ghost"}
              className={`group relative overflow-hidden ${
                pathname === "/" 
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-emerald-500/25" 
                  : "hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              }`}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>

          <Link href="/upload" passHref>
            <Button 
              variant={pathname === "/upload" ? "default" : "ghost"}
              className={`group relative overflow-hidden ${
                pathname === "/upload" 
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-amber-500/25" 
                  : "hover:bg-amber-50 dark:hover:bg-amber-900/20"
              }`}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </Link>

          <Link href="/profile" passHref>
            <Button 
              variant={pathname === "/profile" ? "default" : "ghost"}
              className={`group relative overflow-hidden ${
                pathname === "/profile" 
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-blue-500/25" 
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
              }`}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>

          <div className="ml-4 pl-4 border-l border-emerald-200/30">
            <ModeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
