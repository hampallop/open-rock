import { ThemeProvider } from 'next-themes'
import './globals.css'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from '@/components/ui/sonner'
import { Figtree } from 'next/font/google'

const figtree = Figtree({
  subsets: ['latin'],
  display: 'swap',
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={figtree.className} suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        ></meta>
      </head>
      <body className="overflow-hidden bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
        <Toaster closeButton />
      </body>
    </html>
  )
}
