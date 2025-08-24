"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Mic, 
  MicOff, 
  Sparkles, 
  Filter, 
  X, 
  Clock, 
  TrendingUp,
  Zap,
  Brain,
  Volume2,
  Video,
  Music,
  Tag,
  Calendar,
  User
} from "lucide-react"

interface SearchSuggestion {
  id: string
  text: string
  type: 'recent' | 'trending' | 'smart' | 'filter'
  icon: React.ReactNode
  count?: number
}

interface SearchResult {
  id: string
  title: string
  artist: string
  type: 'audio' | 'video'
  relevance: number
  tags: string[]
  createdAt: string
  filePath: string
}

interface SmartSearchProps {
  onResultsChange: (results: SearchResult[]) => void
  placeholder?: string
  className?: string
}

export function SmartSearch({ onResultsChange, placeholder, className }: SmartSearchProps) {
  const [query, setQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  
  const recognitionRef = useRef<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        handleSearch(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Generate smart suggestions
  useEffect(() => {
    const generateSuggestions = () => {
      const smartSuggestions: SearchSuggestion[] = [
        // Recent searches
        ...recentSearches.slice(0, 3).map(search => ({
          id: `recent-${search}`,
          text: search,
          type: 'recent' as const,
          icon: <Clock className="h-4 w-4" />
        })),
        
        // Smart suggestions
        {
          id: 'relaxing-music',
          text: 'relaxing music for studying',
          type: 'smart',
          icon: <Brain className="h-4 w-4" />,
          count: 24
        },
        {
          id: 'upbeat-videos',
          text: 'upbeat workout videos',
          type: 'smart',
          icon: <Zap className="h-4 w-4" />,
          count: 18
        },
        {
          id: 'instrumental',
          text: 'instrumental background music',
          type: 'smart',
          icon: <Music className="h-4 w-4" />,
          count: 31
        },
        
        // Filter suggestions
        {
          id: 'this-week',
          text: 'uploaded this week',
          type: 'filter',
          icon: <Calendar className="h-4 w-4" />
        },
        {
          id: 'high-quality',
          text: 'high quality videos',
          type: 'filter',
          icon: <Video className="h-4 w-4" />
        }
      ]

      setSuggestions(smartSuggestions)
    }

    generateSuggestions()
  }, [recentSearches])

  const toggleVoiceSearch = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      if (recognitionRef.current) {
        setIsListening(true)
        recognitionRef.current.start()
      }
    }
  }

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      onResultsChange([])
      return
    }

    setIsLoading(true)
    setShowSuggestions(false)

    try {
      // Save to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))

      // Call our smart search API
      const response = await fetch('/api/search/smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: searchQuery,
          type: 'semantic' // or 'keyword', 'hybrid'
        })
      })

      if (response.ok) {
        const results = await response.json()
        setSearchResults(results)
        onResultsChange(results)
      }
    } catch (error) {
      console.error('Search failed:', error)
      // Fallback to simple search
      await fallbackSearch(searchQuery)
    } finally {
      setIsLoading(false)
    }
  }

  const fallbackSearch = async (searchQuery: string) => {
    try {
      // Fetch both tracks and videos
      const [tracksRes, videosRes] = await Promise.all([
        fetch('/api/tracks'),
        fetch('/api/videos')
      ])

      const tracks = await tracksRes.json()
      const videos = await videosRes.json()

      // Simple text-based filtering
      const query = searchQuery.toLowerCase()
      const filteredResults: SearchResult[] = [
        ...(Array.isArray(tracks) ? tracks : []).filter((track: any) =>
          track.title.toLowerCase().includes(query) ||
          track.artist.toLowerCase().includes(query)
        ).map((track: any) => ({
          ...track,
          type: 'audio' as const,
          relevance: calculateRelevance(track, query),
          tags: generateTags(track)
        })),
        
        ...(Array.isArray(videos) ? videos : []).filter((video: any) =>
          video.title.toLowerCase().includes(query) ||
          video.artist.toLowerCase().includes(query)
        ).map((video: any) => ({
          ...video,
          type: 'video' as const,
          relevance: calculateRelevance(video, query),
          tags: generateTags(video)
        }))
      ]

      // Sort by relevance
      filteredResults.sort((a, b) => b.relevance - a.relevance)
      
      setSearchResults(filteredResults)
      onResultsChange(filteredResults)
    } catch (error) {
      console.error('Fallback search failed:', error)
    }
  }

  const calculateRelevance = (item: any, query: string): number => {
    const title = item.title.toLowerCase()
    const artist = item.artist.toLowerCase()
    const q = query.toLowerCase()

    let score = 0
    if (title.includes(q)) score += 10
    if (artist.includes(q)) score += 8
    if (title.startsWith(q)) score += 5
    if (artist.startsWith(q)) score += 4

    return score
  }

  const generateTags = (item: any): string[] => {
    const tags: string[] = []
    
    // Generate tags based on title and artist
    const words = (item.title + ' ' + item.artist).toLowerCase().split(/\s+/)
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
    
    words.forEach(word => {
      if (word.length > 3 && !commonWords.includes(word)) {
        if (!tags.includes(word)) {
          tags.push(word)
        }
      }
    })

    return tags.slice(0, 5) // Limit to 5 tags
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    handleSearch(suggestion.text)
  }

  const clearSearch = () => {
    setQuery("")
    setSearchResults([])
    onResultsChange([])
    setShowSuggestions(false)
    searchInputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative glass-card p-1 hover-lift">
        <div className="flex items-center gap-3 px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          
          <Input
            ref={searchInputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSearch()
              }
              if (e.key === 'Escape') {
                setShowSuggestions(false)
              }
            }}
            placeholder={placeholder || "Ask anything... 'Find relaxing music' or 'Show me workout videos'"}
            className="flex-1 border-0 bg-transparent text-lg focus:ring-0 focus-visible:ring-0"
          />

          <div className="flex items-center gap-2">
            {isLoading && (
              <div className="animate-spin">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            )}

            {query && !isLoading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-8 w-8 p-0 hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoiceSearch}
              className={`h-8 w-8 p-0 transition-colors ${
                isListening ? 'text-red-500 bg-red-500/10' : 'hover:bg-primary/10'
              }`}
              title={isListening ? 'Stop listening' : 'Voice search'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            {query.trim() && (
              <Button
                onClick={() => handleSearch()}
                className="gradient-primary text-white px-4 py-2 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? <Sparkles className="h-4 w-4 animate-pulse" /> : 'Search'}
              </Button>
            )}
          </div>
        </div>

        {/* Voice Recognition Indicator */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-12 left-4 right-4 glass-card p-3 border border-red-500/20"
          >
            <div className="flex items-center gap-2 text-red-500">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-red-500 rounded-full"
                    animate={{
                      height: [4, 12, 4],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <span className="text-sm">Listening...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 glass-card p-4 z-50 max-h-80 overflow-y-auto"
          >
            <div className="space-y-1">
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`p-2 rounded-lg ${
                    suggestion.type === 'recent' ? 'bg-primary/10 text-primary' :
                    suggestion.type === 'smart' ? 'bg-accent/10 text-accent-foreground' :
                    suggestion.type === 'trending' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-secondary/10 text-secondary-foreground'
                  }`}>
                    {suggestion.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{suggestion.text}</p>
                    {suggestion.count && (
                      <p className="text-xs text-muted-foreground">{suggestion.count} results</p>
                    )}
                  </div>
                  {suggestion.type === 'recent' && (
                    <span className="text-xs text-muted-foreground">Recent</span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  )
}
