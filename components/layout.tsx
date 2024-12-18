import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
  backLink?: string
  title: string
  stickyHeader?: React.ReactNode
}

export function Layout({
  children,
  backLink,
  title,
  stickyHeader,
}: LayoutProps) {
  return (
    <section className="mx-auto w-full max-w-screen-md bg-background">
      <header className="sticky top-0 z-20 border-b border-border/40 bg-background px-4">
        <div className="flex items-center py-4">
          {backLink && (
            <Link href={backLink} className="mr-4">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back</span>
            </Link>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        {stickyHeader && (
          <div className="bg-background pb-2">{stickyHeader}</div>
        )}
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </section>
  )
}
