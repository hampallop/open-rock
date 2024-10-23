import { EventList } from '@/components/event-list'
import { Footer } from '@/components/ui/footer'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = createClient()
  const { data: events } = await supabase.from('events').select()

  if (!events) {
    return <div>No events found</div>
  }

  return (
    <>
      <main className="max-h-[calc(100vh-143px)] flex flex-grow w-full overflow-y-auto">
        <EventList title="Manage events" events={events} isCms />
      </main>
      <Footer />
    </>
  )
}
