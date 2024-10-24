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
    <div className="max-w-screen-md mx-auto w-full bg-background flex flex-col px-5">
      <section className="flex mx-auto w-full bg-background mb-8 mt-4 items-center">
        <Link href={backLink} className="justify-items-start mr-4">
          <ChevronLeftIcon className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Link>
      </section>
      <section>
        <InfoSection event={event} />
        <ProgramSection competePrograms={event?.competePrograms ?? []} />
      </section>
    </div>
  )
}
