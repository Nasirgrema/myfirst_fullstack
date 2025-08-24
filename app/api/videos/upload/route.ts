import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { PrismaClient } from "@prisma/client"
import { existsSync } from "fs"

const prisma = new PrismaClient()

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/webm',
  'video/ogg'
]

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File
    const title: string | null = data.get("title") as string
    const artist: string | null = data.get("artist") as string

    if (!file || !title || !artist) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields" 
      })
    }

    // Validate file type
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid file type. Only MP4, MPEG, MOV, WebM, and OGG videos are allowed." 
      })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        success: false, 
        error: "File too large. Maximum size is 100MB." 
      })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create videos directory if it doesn't exist
    const uploadsDir = join("public", "uploads", "videos")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}_${file.name}`
    const path = join(uploadsDir, filename)
    
    await writeFile(path, buffer)

    const video = await prisma.video.create({
      data: {
        title,
        artist,
        filePath: `/uploads/videos/${filename}`,
        fileSize: file.size,
        mimeType: file.type,
      },
    })

    return NextResponse.json({ success: true, video })
  } catch (error) {
    console.error("Video upload error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to upload video" 
    })
  }
}
