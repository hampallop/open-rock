import { EventList } from '@/components/event-list'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = createClient()
  const { data: events } = await supabase.from('events').select()

  if (!events) {
    return <div>No events found</div>
  }

  return <EventList events={events} />
}
