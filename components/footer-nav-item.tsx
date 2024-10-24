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
        'text-muted-foreground flex flex-col items-center cursor-pointer hover:bg-accent rounded-xl p-2',
        pathname === link && 'text-rose-600',
      )}
    >
      {children}
    </Link>
  )
}
