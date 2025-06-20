import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-slate-900 text-slate-100 min-h-screen">
        <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-emerald-400">Your App</h1>
            <div className="space-x-4">
              <button className="text-slate-300 hover:text-emerald-400 transition-colors">
                Home
              </button>
              <button className="text-slate-300 hover:text-emerald-400 transition-colors">
                Tracks
              </button>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}