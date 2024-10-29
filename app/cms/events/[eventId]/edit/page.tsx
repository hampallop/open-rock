import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { QueryData } from '@supabase/supabase-js'
import { ProgramSection } from '@/app/cms/events/[eventId]/edit/program'
import { InfoSection } from '@/app/cms/events/[eventId]/edit/info'
import { AppLayout, AppNavbar } from '@/components/app-layout'

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
    <AppNavbar>
      <div className="flex items-center">
        <Link href={`/cms/events/${eventId}`} className="flex">
          <ChevronLeftIcon />
          <span className="ml-1">Back</span>
        </Link>
      </div>
    </AppNavbar>
  )
}

export default async function EventEditPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params

  const { data: event, error: _error } =
    await queryEventWithCompetePrograms(eventId)
  if (!event) {
    return <div>Event not found</div>
  }
  return (
    <AppLayout>
      <Navbar eventId={eventId} />
      <section className="grow overflow-y-auto px-5">
        <InfoSection event={event} />
        <ProgramSection competePrograms={event?.competePrograms ?? []} />
      </section>
    </AppLayout>
  )
}
