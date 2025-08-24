import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id }
    })

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Remove the leading slash and construct the full path
    const filePath = join("public", video.filePath.substring(1))
    
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "Video file not found" }, { status: 404 })
    }

    const fileBuffer = await readFile(filePath)
    
    const headers = new Headers()
    headers.set('Content-Type', video.mimeType || 'video/mp4')
    headers.set('Content-Length', fileBuffer.length.toString())
    headers.set('Content-Disposition', `attachment; filename="${video.title}.${getFileExtension(video.mimeType)}"`)
    headers.set('Cache-Control', 'public, max-age=31536000')

    return new NextResponse(fileBuffer, { headers })
  } catch (error) {
    console.error("Video download error:", error)
    return NextResponse.json({ error: "Failed to download video" }, { status: 500 })
  }
}

function getFileExtension(mimeType?: string): string {
  switch (mimeType) {
    case 'video/mp4':
      return 'mp4'
    case 'video/mpeg':
      return 'mpeg'
    case 'video/quicktime':
      return 'mov'
    case 'video/webm':
      return 'webm'
    case 'video/ogg':
      return 'ogv'
    default:
      return 'mp4'
  }
}
