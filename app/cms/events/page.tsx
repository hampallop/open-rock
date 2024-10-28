import { AppLayout, AppNavbar } from '@/components/app-layout'
import { EventList } from '@/components/event-list'
import { FooterAuth } from '@/components/footer-auth'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

function Navbar() {
  return (
    <AppNavbar>
      <Button
        asChild
        className="ml-auto rounded-full p-2"
        variant={'secondary'}
      >
        <Link href="/cms/events/create">
          <PlusIcon />
        </Link>
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
      <EventList title="Manage events" events={events} isCms />
      <FooterAuth />
    </AppLayout>
  )
}
