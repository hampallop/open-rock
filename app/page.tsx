import { EventList } from '@/components/event-list'
import { createClient } from '@/utils/supabase/server'

function EventCard({ event }: { event: any }) {
  return (
    <div>
      <h1>{event.name}</h1>
      <p>{event.location}</p>
    </div>
  )
}

export default async function Home() {
  const supabase = createClient()
  const { data: events } = await supabase.from('events').select()
  console.info(events)
  if (!events) {
    return <div>No events found</div>
  }

  return <EventList events={events} />
}
