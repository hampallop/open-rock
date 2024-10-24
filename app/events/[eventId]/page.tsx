import { EventDetails } from '@/components/event-details'
import { createClient } from '@/utils/supabase/server'
import { QueryData } from '@supabase/supabase-js'

async function queryEventWithCompetePrograms(eventId: string) {
  const supabase = await createClient()
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
  const { eventId } = await params
  const { data: event, error: _error } =
    await queryEventWithCompetePrograms(eventId)

  if (!event) {
    return <div>No event found</div>
  }

  return <EventDetails event={event} />
}
