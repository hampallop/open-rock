import { EventList } from '@/components/event-list'
import { FooterAuth } from '@/components/footer-auth'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: events } = await supabase.from('events').select()

  if (!events) {
    return <div>No events found</div>
  }

  return (
    <main className="flex flex-col min-h-screen max-h-screen max-w-screen-md mx-auto">
      <div className="ml-auto px-5 py-3">
        <Button asChild className="rounded-full p-2" variant={'secondary'}>
          <Link href="/cms/events/create">
            <PlusIcon />
          </Link>
        </Button>
      </div>
      <EventList title="Manage events" events={events} isCms />
      <FooterAuth />
    </main>
  )
}
