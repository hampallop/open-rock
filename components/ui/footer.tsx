'use client'
import { cn } from '@/lib/utils'
import { GlobeIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  return (
    <footer className="h-20 w-full border-t flex items-center bg-card px-5 py-2 justify-between">
      <section className="flex max-w-screen-md mx-auto w-full bg-background space-x-2">
        <Link
          href="/cms/events"
          className={cn(
            'text-muted-foreground flex flex-col items-center cursor-pointer hover:bg-accent rounded-xl p-2',
            pathname === '/cms/events' && 'text-rose-600',
          )}
        >
          <GlobeIcon className="mb-1" />
          <span className="text-xs">Manage events</span>
        </Link>
        <Link
          href="/"
          className={cn(
            'text-muted-foreground flex flex-col items-center cursor-pointer hover:bg-accent rounded-xl p-2',
            pathname === '/' && 'text-rose-600',
          )}
        >
          <GlobeIcon className="mb-1" />
          <span className="text-xs">Home</span>
        </Link>
      </section>
    </footer>
  )
}
