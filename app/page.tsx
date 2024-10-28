import { AppLayout, AppNavbar } from '@/components/app-layout'
import { EventList } from '@/components/event-list'
import { FooterAuth } from '@/components/footer-auth'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

function Navbar() {
  return (
    <AppNavbar>
      <Button
        asChild
        className="ml-auto rounded-full p-2"
        variant={'secondary'}
      >
        <ThemeSwitcher />
      </Button>
    </AppNavbar>
  )
}

export default async function Home() {
  const supabase = await createClient()
  const { data: events } = await supabase.from('events').select()

  if (!events) {
    return <div>No events found</div>
  }

  return (
    <AppLayout>
      <Navbar />
      <EventList title="Events" events={events} />
      <FooterAuth />
    </AppLayout>
  )
}
