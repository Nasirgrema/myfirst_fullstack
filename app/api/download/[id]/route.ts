import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { createReadStream } from "fs"
import { join } from "path"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const track = await prisma.track.findUnique({
    where: { id: params.id },
  })

  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 })
  }

  const filePath = join(process.cwd(), "public", track.filePath)
  const fileStream = createReadStream(filePath)

  return new NextResponse(fileStream, {
    headers: {
      "Content-Disposition": `attachment; filename="${track.title}.mp3"`,
      "Content-Type": "audio/mpeg",
    },
  })
}

