import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { QueryData } from '@supabase/supabase-js'
import { ProgramSection } from '@/app/cms/events/[eventId]/edit/program'
import { InfoSection } from '@/app/cms/events/[eventId]/edit/info'

function queryEventWithCompetePrograms(eventId: string) {
  const supabase = createClient()
  return supabase
    .from('events')
    .select('*, competePrograms(*, competeRounds(*))')
    .eq('id', eventId)
    .single()
}
export type EventWithCompetePrograms = QueryData<
  ReturnType<typeof queryEventWithCompetePrograms>
>

export default async function EventEditPage({
  params,
}: {
  params: { eventId: string }
}) {
  const backLink = `/cms/events/${params.eventId}`
  const { data: event, error: _error } = await queryEventWithCompetePrograms(
    params.eventId,
  )
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
