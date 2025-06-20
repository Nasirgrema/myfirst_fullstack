import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const tracks = await prisma.track.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(tracks)
}

