'use client'

import Link from 'next/link'
import { Home, Users, Calendar } from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <nav className="w-64 bg-muted p-4 hidden md:block">
        <h1 className="text-2xl font-bold mb-6">Climbing CMS</h1>
        <ul className="space-y-2">
          <li>
            <Link
              href="/cms"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/cms/athletes"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <Users size={20} />
              <span>Athletes</span>
            </Link>
          </li>
          <li>
            <Link
              href="/cms/events"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <Calendar size={20} />
              <span>Events</span>
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
