import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { QueryData } from '@supabase/supabase-js'
import { ProgramSection } from '@/app/cms/events/[eventId]/edit/program'
import { InfoSection } from '@/app/cms/events/[eventId]/edit/info'

async function queryEventWithCompetePrograms(eventId: string) {
  const supabase = await createClient()
  const response = await supabase
    .from('events')
    .select('*, competePrograms(*, competeRounds(*))')
    .eq('id', eventId)
    .order('name', { referencedTable: 'competePrograms' })
    .single()

  return response
}
export type EventWithCompetePrograms = QueryData<
  ReturnType<typeof queryEventWithCompetePrograms>
>

function Navbar({ eventId }: { eventId: string }) {
  return (
    <nav className="flex justify-between items-center px-5 py-3 min-h-16">
      <Link href={`/cms/events/${eventId}`} className="flex items-center">
        <ChevronLeftIcon />
        <span className="ml-1">Back</span>
      </Link>
    </nav>
  )
}

export default async function EventEditPage({
  params,
}: {
  params: { eventId: string }
}) {
  const { eventId } = await params

  const backLink = `/cms/events/${eventId}`
  const { data: event, error: _error } =
    await queryEventWithCompetePrograms(eventId)
  if (!event) {
    return <div>Event not found</div>
  }
  console.log('event', JSON.stringify(event, null, 2))
  return (
    <main className="flex flex-col min-h-screen max-w-screen-md mx-auto">
      <Navbar eventId={eventId} />
      {/* <section className="flex mx-auto w-full bg-background mb-8 mt-4 items-center">
        <Link href={backLink} className="justify-items-start mr-4">
          <ChevronLeftIcon className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Link>
      </section> */}
      <section className="px-5">
        <InfoSection event={event} />
        <ProgramSection competePrograms={event?.competePrograms ?? []} />
      </section>
    </main>
  )
}
