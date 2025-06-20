import { Navigation } from "@/components/navigation"

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-8">
        <h1 className="mb-8 text-4xl font-bold">User Profile</h1>
        <p>
          This is a placeholder for the user profile page. Implement user authentication and profile management here.
        </p>
      </div>
    </main>
  )
}

