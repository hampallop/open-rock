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
export type EventWithCompetePrograms = QueryData<
  ReturnType<typeof queryEventWithCompetePrograms>
>

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
