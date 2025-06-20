import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const data = await request.formData()
  const file: File | null = data.get("file") as unknown as File
  const title: string | null = data.get("title") as string
  const artist: string | null = data.get("artist") as string

  if (!file || !title || !artist) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const path = join("public", "uploads", file.name)
  await writeFile(path, buffer)

  const track = await prisma.track.create({
    data: {
      title,
      artist,
      filePath: `/uploads/${file.name}`,
    },
  })

  return NextResponse.json({ success: true, track })
}

