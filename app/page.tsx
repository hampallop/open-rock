import { EventList } from '@/components/event-list'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = createClient()
  const { data: events } = await supabase.from('events').select()

  if (!events) {
    return <div>No events found</div>
  }

  return (
    <>
      <main className="max-h-[calc(100vh-64px)] flex flex-grow w-full overflow-y-auto">
        <EventList title="Climbing Events" events={events} />
      </main>
    </>
  )
}
