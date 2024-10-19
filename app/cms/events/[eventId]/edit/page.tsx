import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { QueryData } from '@supabase/supabase-js'
import { ProgramSection } from '@/app/cms/events/[eventId]/edit/program'
import { Button } from '@/components/ui/button'

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
    <div className="flex flex-col px-5 w-full">
      <section className="flex mx-auto w-full bg-background mb-8 mt-4 items-center">
        <Link href={backLink} className="justify-items-start mr-4">
          <ChevronLeftIcon className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Link>
      </section>
      <section>
        <h1 className="text-3xl font-medium mb-8">Edit event</h1>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between pb-4 mb-4 border-b">
            <div>
              <p>Event Name</p>
              <p className="text-muted-foreground">{event?.name}</p>
            </div>
            <Button variant="link" className="underline p-2 -mt-2">
              Edit
            </Button>
          </div>
          <div className="flex justify-between pb-4 mb-4 border-b">
            <div>
              <p>Event Location</p>
              <p className="text-muted-foreground">
                {event?.location || 'N/A'}
              </p>
            </div>
            <Button variant="link" className="underline p-2 -mt-2">
              Edit
            </Button>
          </div>
          <div className="flex justify-between pb-4 mb-4 border-b">
            <div>
              <p>Event Start Date</p>
              <p className="text-muted-foreground">{event?.startedAt}</p>
            </div>
            <Button variant="link" className="underline p-2 -mt-2">
              Edit
            </Button>
          </div>
          <div className="flex justify-between pb-4 mb-8 border-b">
            <div>
              <p>Event End Date</p>
              <p className="text-muted-foreground">{event?.endedAt}</p>
            </div>
            <Button variant="link" className="underline p-2 -mt-2">
              Edit
            </Button>
          </div>
        </div>

        <ProgramSection competePrograms={event?.competePrograms ?? []} />
      </section>
    </div>
  )
}
