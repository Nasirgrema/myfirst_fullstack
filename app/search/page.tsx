"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { SmartSearch } from "@/components/smart-search"
import { SearchResults } from "@/components/search-results"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Brain, 
  Zap, 
  Sparkles, 
  Search,
  TrendingUp,
  Clock,
  Music,
  Video,
  Mic
} from "lucide-react"

interface SearchResult {
  id: string
  title: string
  artist: string
  type: 'audio' | 'video'
  relevance: number
  tags: string[]
  createdAt: string
  filePath: string
  fileSize?: number
  duration?: number
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [currentQuery, setCurrentQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleResultsChange = (results: SearchResult[]) => {
    setSearchResults(results)
  }

  const sampleQueries = [
    {
      text: "relaxing music for studying",
      icon: <Brain className="h-5 w-5" />,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    {
      text: "upbeat workout videos",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    },
    {
      text: "instrumental background music",
      icon: <Music className="h-5 w-5" />,
      color: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    {
      text: "videos uploaded this week",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    {
      text: "high energy dance music",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-pink-500/10 text-pink-500 border-pink-500/20"
    },
    {
      text: "peaceful nature sounds",
      icon: <Sparkles className="h-5 w-5" />,
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    }
  ]

  const searchFeatures = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Semantic Search",
      description: "Understanding context and meaning, not just keywords",
      gradient: "gradient-primary"
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Voice Search",
      description: "Speak naturally to find what you're looking for",
      gradient: "gradient-accent"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Smart Suggestions",
      description: "AI-powered recommendations based on your library",
      gradient: "gradient-secondary"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Results",
      description: "Lightning-fast search across your entire collection",
      gradient: "gradient-warm"
    }
  ]

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div className="container py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <Search className="h-20 w-20 text-muted-foreground/20 mx-auto" />
            <div className="absolute inset-0 animate-pulse">
              <Search className="h-20 w-20 text-primary/40 mx-auto" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-gradient-primary">Smart</span>
            <span className="text-gradient-accent"> Search</span>
          </h1>
          
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Find your perfect audio and video content using natural language. 
            Ask for "relaxing music" or "energetic workout videos" - our AI understands what you mean.
          </p>
        </motion.div>

        {/* Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <SmartSearch 
            onResultsChange={handleResultsChange}
            placeholder="Try 'upbeat music for running' or 'calm videos for meditation'"
            className="mb-8"
          />
        </motion.div>

        {/* Search Features - Show when no results */}
        {searchResults.length === 0 && !currentQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-12"
          >
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="glass-card p-6 text-center hover-lift"
                >
                  <div className={`${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gradient-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Sample Queries */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gradient-secondary mb-8">
                Try These Searches
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {sampleQueries.map((query, index) => (
                  <motion.button
                    key={query.text}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Trigger search with this query
                      const searchInput = document.querySelector('input[placeholder*="Try"]') as HTMLInputElement
                      if (searchInput) {
                        searchInput.value = query.text
                        searchInput.focus()
                        // Trigger search
                        const event = new KeyboardEvent('keydown', { key: 'Enter' })
                        searchInput.dispatchEvent(event)
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left hover-lift ${query.color}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {query.icon}
                      </div>
                      <span className="font-medium text-sm">
                        "{query.text}"
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 p-6 glass-card max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-gradient-warm mb-4">
                  🎯 Search Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="font-medium text-green-600 mb-1">✓ Natural language</p>
                    <p className="text-sm text-muted-foreground">"music for studying"</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-600 mb-1">✓ Mood-based</p>
                    <p className="text-sm text-muted-foreground">"sad emotional songs"</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-600 mb-1">✓ Activity-based</p>
                    <p className="text-sm text-muted-foreground">"workout pump music"</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-600 mb-1">✓ Time-based</p>
                    <p className="text-sm text-muted-foreground">"uploaded this week"</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <SearchResults 
              results={searchResults} 
              query={currentQuery}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </div>
    </main>
  )
}
