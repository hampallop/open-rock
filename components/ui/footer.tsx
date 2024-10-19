'use client'
import { cn } from '@/lib/utils'
import { GlobeIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  console.log(pathname)
  return (
    <footer className="h-20 w-full border-t flex items-center bg-card px-5 justify-between">
      <section className="flex max-w-screen-md mx-auto w-full bg-background">
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
      </section>
    </footer>
  )
}
