import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import { QueryData } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, PencilIcon } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

async function queryEventWithCompetePrograms(eventId: string) {
  const supabase = await createClient()
  return supabase
    .from('events')
    .select('*, competePrograms(*, competeRounds(*))')
    .eq('id', eventId)
    .single()
}
export type EventWithCompetePrograms = QueryData<
  ReturnType<typeof queryEventWithCompetePrograms>
>

const sortRoundsMap = {
  Qualifications: 1,
  'Semi-Final': 2,
  Final: 3,
} as Record<string, number>
type CompeteRound = {
  name: string
}
const sortRounds = (a: CompeteRound, b: CompeteRound) =>
  sortRoundsMap[a.name] - sortRoundsMap[b.name]

export default async function EventViewPage({
  params,
}: {
  params: { eventId: string }
}) {
  // asynchronous access of `params.id`.
  const { eventId } = await params

  const { data: event, error: _error } =
    await queryEventWithCompetePrograms(eventId)

  if (!event) {
    return <div>Event not found</div>
  }

  console.log('event', event)

  const backLink = `/cms/events`

  return (
    <div className="max-w-screen-md mx-auto w-full bg-background flex flex-col px-5">
      <section className="flex mx-auto w-full bg-background mb-8 mt-4 justify-between items-center">
        <Link href={backLink} className="mr-4">
          <ChevronLeftIcon className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Link>
        <div className="ml-auto">
          <Button
            asChild
            className="rounded-full p-4 inline-table"
            variant={'secondary'}
          >
            <Link href={`/cms/events/${event.id}/edit`}>
              <PencilIcon size={16} />
            </Link>
          </Button>
        </div>
      </section>
      <section>
        <h1 className="text-2xl font-medium mb-2">{event.name}</h1>
        <p>{event.location}</p>
        <p className="text-muted-foreground">
          {format(event.startedAt, 'PPP')} - {format(event.endedAt, 'PPP')}
        </p>
      </section>
      <Separator className="my-8" />
      <section className="">
        <h2 className="text-2xl font-medium mb-6">Programs</h2>
        <div className="flex flex-col gap-4">
          {event.competePrograms.map((program) => (
            <section key={program.id}>
              <h3 className="text-md font-medium">{program.name}</h3>
              <div className="grid grid-cols-3 gap-2">
                {program.competeRounds.sort(sortRounds).map((round) => (
                  <div
                    key={round.id}
                    className="flex justify-center border rounded-lg p-4 text-sm"
                  >
                    {round.name}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
