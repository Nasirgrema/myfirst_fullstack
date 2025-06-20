import { Navigation } from "@/components/navigation"
import { TrackList } from "@/components/track-list"
import { TafseerPlayer } from "@/components/tafseer-player"
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-8">
        <h1 className="mb-8 text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to the Web Tafseer Store App
        </h1>
        <TrackList />
      </div>
      <TafseerPlayer />
    </main>
  )
}
