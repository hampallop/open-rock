'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function FooterNavItem({
  link,
  children,
}: {
  link: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <Link
      href={link}
      className={cn(
        'flex cursor-pointer flex-col items-center rounded-xl p-2 text-center text-muted-foreground hover:bg-accent',
        pathname === link && 'text-rose-600',
      )}
    >
      {children}
    </Link>
  )
}
