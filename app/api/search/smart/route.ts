import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Simple semantic search implementation
// In production, you'd use embeddings from OpenAI, Cohere, or similar services
const semanticKeywords = {
  // Mood-based search
  relaxing: ['calm', 'peaceful', 'ambient', 'chill', 'meditation', 'zen', 'soothing'],
  energetic: ['upbeat', 'energetic', 'pump', 'workout', 'dance', 'high energy', 'motivational'],
  sad: ['melancholy', 'emotional', 'heartbreak', 'somber', 'dramatic'],
  happy: ['joyful', 'cheerful', 'uplifting', 'positive', 'celebration', 'party'],
  
  // Genre-based search
  electronic: ['edm', 'techno', 'house', 'dubstep', 'trance', 'synth'],
  rock: ['guitar', 'drums', 'metal', 'alternative', 'indie'],
  classical: ['orchestra', 'piano', 'violin', 'symphony', 'chamber'],
  jazz: ['saxophone', 'blues', 'improvisation', 'swing'],
  
  // Activity-based search
  study: ['focus', 'concentration', 'background', 'instrumental', 'ambient'],
  workout: ['fitness', 'gym', 'training', 'cardio', 'high energy', 'motivational'],
  sleep: ['lullaby', 'nature sounds', 'white noise', 'peaceful'],
  party: ['dance', 'celebration', 'upbeat', 'crowd pleaser'],
  
  // Time-based search
  morning: ['wake up', 'energizing', 'sunrise', 'fresh start'],
  evening: ['sunset', 'relaxing', 'wind down', 'peaceful'],
  night: ['nighttime', 'late night', 'chill', 'ambient'],
  
  // Content type
  instrumental: ['no vocals', 'background music', 'karaoke', 'soundtrack'],
  vocal: ['singing', 'lyrics', 'voice', 'chorus'],
  
  // Quality/Duration
  short: ['brief', 'quick', 'intro', 'snippet'],
  long: ['extended', 'full length', 'complete', 'marathon'],
  'high quality': ['hd', '4k', 'premium', 'studio', 'professional'],
}

interface SearchQuery {
  query: string
  type?: 'semantic' | 'keyword' | 'hybrid'
  filters?: {
    mediaType?: 'audio' | 'video' | 'all'
    dateRange?: string
    duration?: string
  }
}

export async function POST(request: Request) {
  try {
    const { query, type = 'hybrid', filters }: SearchQuery = await request.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json([])
    }

    // Fetch all tracks and videos
    const [tracks, videos] = await Promise.all([
      prisma.track.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.video.findMany({
        orderBy: { createdAt: 'desc' }
      })
    ])

    // Combine and process results
    const allMedia = [
      ...tracks.map(track => ({ ...track, type: 'audio' as const })),
      ...videos.map(video => ({ ...video, type: 'video' as const }))
    ]

    let filteredResults = allMedia

    // Apply media type filter
    if (filters?.mediaType && filters.mediaType !== 'all') {
      filteredResults = filteredResults.filter(item => item.type === filters.mediaType)
    }

    // Apply date range filter
    if (filters?.dateRange) {
      const now = new Date()
      let cutoffDate = new Date()

      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setDate(now.getDate() - 1)
          break
        case 'week':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
      }

      filteredResults = filteredResults.filter(item => 
        new Date(item.createdAt) >= cutoffDate
      )
    }

    // Perform search based on type
    let searchResults = []

    if (type === 'semantic' || type === 'hybrid') {
      searchResults = performSemanticSearch(filteredResults, query)
    } else {
      searchResults = performKeywordSearch(filteredResults, query)
    }

    // Enhance results with tags and relevance scores
    const enhancedResults = searchResults.map(result => ({
      ...result,
      tags: generateSmartTags(result, query),
      relevance: calculateAdvancedRelevance(result, query)
    }))

    // Sort by relevance and limit results
    enhancedResults.sort((a, b) => b.relevance - a.relevance)
    
    return NextResponse.json(enhancedResults.slice(0, 50))

  } catch (error) {
    console.error('Smart search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

function performSemanticSearch(items: any[], query: string) {
  const queryLower = query.toLowerCase()
  const searchTerms = queryLower.split(/\s+/)

  return items.filter(item => {
    const itemText = `${item.title} ${item.artist}`.toLowerCase()
    
    // Direct keyword matching
    const directMatch = searchTerms.some(term => itemText.includes(term))
    if (directMatch) return true

    // Semantic matching using keyword expansion
    const semanticMatch = searchTerms.some(term => {
      for (const [category, keywords] of Object.entries(semanticKeywords)) {
        if (keywords.includes(term) || term.includes(category)) {
          // Check if any related keywords appear in the item
          return keywords.some(keyword => itemText.includes(keyword))
        }
      }
      return false
    })

    return semanticMatch
  })
}

function performKeywordSearch(items: any[], query: string) {
  const queryLower = query.toLowerCase()
  const searchTerms = queryLower.split(/\s+/)

  return items.filter(item => {
    const itemText = `${item.title} ${item.artist}`.toLowerCase()
    return searchTerms.some(term => itemText.includes(term))
  })
}

function generateSmartTags(item: any, query: string): string[] {
  const tags: string[] = []
  const queryLower = query.toLowerCase()
  const itemText = `${item.title} ${item.artist}`.toLowerCase()

  // Add basic content tags
  const words = itemText.split(/\s+/)
  const significantWords = words.filter(word => 
    word.length > 3 && 
    !['the', 'and', 'for', 'with', 'from'].includes(word)
  )
  
  tags.push(...significantWords.slice(0, 3))

  // Add semantic category tags
  for (const [category, keywords] of Object.entries(semanticKeywords)) {
    if (keywords.some(keyword => itemText.includes(keyword) || queryLower.includes(keyword))) {
      tags.push(category)
    }
  }

  // Add media type tag
  tags.push(item.type)

  // Add recency tags
  const createdDate = new Date(item.createdAt)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff <= 1) tags.push('new')
  else if (daysDiff <= 7) tags.push('recent')
  else if (daysDiff <= 30) tags.push('this month')

  // Remove duplicates and limit
  return [...new Set(tags)].slice(0, 6)
}

function calculateAdvancedRelevance(item: any, query: string): number {
  const queryLower = query.toLowerCase()
  const title = item.title.toLowerCase()
  const artist = item.artist.toLowerCase()
  const searchTerms = queryLower.split(/\s+/)

  let score = 0

  // Exact title match (highest priority)
  if (title === queryLower) score += 100
  
  // Title contains full query
  if (title.includes(queryLower)) score += 50
  
  // Artist contains full query
  if (artist.includes(queryLower)) score += 40

  // Individual term matching
  searchTerms.forEach(term => {
    if (title.includes(term)) score += 20
    if (artist.includes(term)) score += 15
    if (title.startsWith(term)) score += 10
    if (artist.startsWith(term)) score += 8
  })

  // Semantic relevance bonus
  for (const [category, keywords] of Object.entries(semanticKeywords)) {
    if (queryLower.includes(category) || keywords.some(k => queryLower.includes(k))) {
      if (keywords.some(keyword => title.includes(keyword) || artist.includes(keyword))) {
        score += 25
      }
    }
  }

  // Recency bonus
  const createdDate = new Date(item.createdAt)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysDiff <= 7) score += 5
  else if (daysDiff <= 30) score += 3

  return score
}
