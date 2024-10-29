export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex max-h-dvh min-h-dvh max-w-screen-md flex-col">
      {children}
    </main>
  )
}

export function AppNavbar({ children }: { children: React.ReactNode }) {
  return (
    <nav className="grid min-h-10 auto-cols-fr grid-flow-col items-center px-5 py-0 sm:py-3">
      {children}
    </nav>
  )
}

export function AppFooter({ children }: { children: React.ReactNode }) {
  return (
    <footer className="flex w-full items-center justify-between border-t bg-card px-5 py-2">
      {children}
    </footer>
  )
}
