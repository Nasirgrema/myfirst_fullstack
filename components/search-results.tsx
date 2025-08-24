"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Play, 
  Download, 
  Music, 
  Video, 
  Clock, 
  User, 
  Tag,
  Sparkles,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List
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

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  isLoading?: boolean
}

type ViewMode = 'grid' | 'list'
type SortBy = 'relevance' | 'date' | 'title' | 'artist'

export function SearchResults({ results, query, isLoading }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortBy, setSortBy] = useState<SortBy>('relevance')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedType, setSelectedType] = useState<'all' | 'audio' | 'video'>('all')

  // Filter results by type
  const filteredResults = results.filter(result => 
    selectedType === 'all' || result.type === selectedType
  )

  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'relevance':
        comparison = b.relevance - a.relevance
        break
      case 'date':
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        break
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'artist':
        comparison = a.artist.localeCompare(b.artist)
        break
    }
    
    return sortOrder === 'desc' ? comparison : -comparison
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays <= 7) return `${diffDays} days ago`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const handleDownload = async (result: SearchResult) => {
    try {
      const endpoint = result.type === 'video' 
        ? `/api/videos/download/${result.id}`
        : `/api/download/${result.id}`
      
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${result.title}.${result.type === 'video' ? 'mp4' : 'mp3'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 80) return 'text-green-500'
    if (relevance >= 50) return 'text-yellow-500'
    return 'text-gray-400'
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/20 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                <div className="h-3 bg-primary/10 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0 && query) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 text-center"
      >
        <div className="relative inline-block mb-6">
          <Sparkles className="h-16 w-16 text-muted-foreground/30 mx-auto" />
          <div className="absolute inset-0 animate-pulse">
            <Sparkles className="h-16 w-16 text-primary/30 mx-auto" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gradient-primary mb-2">No Results Found</h3>
        <p className="text-muted-foreground text-lg mb-6">
          Try searching for something like "relaxing music" or "workout videos"
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {['relaxing music', 'upbeat videos', 'instrumental', 'this week'].map(suggestion => (
            <Button key={suggestion} variant="outline" size="sm" className="rounded-full">
              {suggestion}
            </Button>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Summary & Controls */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-lg font-semibold">
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} 
                {query && <span className="text-muted-foreground"> for "{query}"</span>}
              </p>
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              {['all', 'audio', 'video'].map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type as any)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Controls */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-1 rounded-lg bg-background border border-border text-sm"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="artist">Artist</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
              {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
            </Button>

            {/* View Mode Toggle */}
            <div className="flex border border-border rounded-lg">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-l-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${sortBy}-${sortOrder}-${selectedType}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }
        >
          {sortedResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card p-6 hover-lift group"
            >
              <div className={viewMode === 'grid' ? "space-y-4" : "flex items-center gap-4"}>
                {/* Media Icon/Thumbnail */}
                <div className={`${viewMode === 'grid' ? 'w-full' : 'w-16'} ${viewMode === 'grid' ? 'h-32' : 'h-16'} gradient-${result.type === 'video' ? 'accent' : 'primary'} rounded-xl flex items-center justify-center text-white relative overflow-hidden`}>
                  {result.type === 'video' ? (
                    <Video className={`${viewMode === 'grid' ? 'h-12 w-12' : 'h-8 w-8'}`} />
                  ) : (
                    <Music className={`${viewMode === 'grid' ? 'h-12 w-12' : 'h-8 w-8'}`} />
                  )}
                  
                  {/* Relevance Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 bg-black/50 rounded-full text-xs font-medium ${getRelevanceColor(result.relevance)}`}>
                    {result.relevance}%
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className={`font-bold text-gradient-primary ${viewMode === 'grid' ? 'text-xl' : 'text-lg'}`}>
                      {result.title}
                    </h3>
                    <p className={`text-muted-foreground flex items-center gap-1 ${viewMode === 'grid' ? 'text-base' : ''}`}>
                      <User className="h-4 w-4" />
                      {result.artist}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {result.tags.slice(0, 4).map(tag => (
                      <span 
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(result.createdAt)}
                    </span>
                    {result.fileSize && (
                      <span>{formatFileSize(result.fileSize)}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {result.type === 'video' ? (
                      <Link href={`/videos/watch/${result.id}`}>
                        <Button className="gradient-accent text-white flex items-center gap-2 rounded-xl">
                          <Play className="h-4 w-4" />
                          Watch
                        </Button>
                      </Link>
                    ) : (
                      <Button className="gradient-primary text-white flex items-center gap-2 rounded-xl">
                        <Play className="h-4 w-4" />
                        Play
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(result)}
                      className="flex items-center gap-2 rounded-xl"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
