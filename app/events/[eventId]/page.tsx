import { EventDetails } from '@/components/event-details'
import { createClient } from '@/utils/supabase/server'
import { QueryData } from '@supabase/supabase-js'

function queryEventWithCompetePrograms(eventId: string) {
  const supabase = createClient()
  return supabase
    .from('events')
    .select('*, competePrograms(*)')
    .eq('id', eventId)
    .single()
}
type QueryReturn = ReturnType<typeof queryEventWithCompetePrograms>
export type EventWithCompetePrograms = QueryData<QueryReturn>

export default async function EventPage({
  params,
}: {
  params: { eventId: string }
}) {
  const { data: event, error } = await queryEventWithCompetePrograms(
    params.eventId,
  )

  if (!event) {
    return <div>No event found</div>
  }

  return <EventDetails event={event} />
}
