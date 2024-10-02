'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
  backLink?: string
  title: string
}

export function Layout({ children, backLink, title }: LayoutProps) {
  return (
    <section className="min-h-screen max-w-screen-md mx-auto w-full bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center">
          {backLink && (
            <Link href={backLink} className="mr-4">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back</span>
            </Link>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </section>
  )
}
