import { EventList } from '@/components/event-list'
import { FooterAuth } from '@/components/footer-auth'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

function Navbar() {
  return (
    <nav className="flex min-h-16 items-center justify-between px-5 py-3">
      <Button
        asChild
        className="ml-auto rounded-full p-2"
        variant={'secondary'}
      >
        <ThemeSwitcher />
      </Button>
    </nav>
  )
}

export default async function Home() {
  const supabase = await createClient()
  const { data: events } = await supabase.from('events').select()

  if (!events) {
    return <div>No events found</div>
  }

  return (
    <main className="mx-auto flex max-h-screen min-h-screen max-w-screen-md flex-col">
      <Navbar />
      <EventList title="Events" events={events} />
      <FooterAuth />
    </main>
  )
}
