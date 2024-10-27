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

function Navbar({ eventId }: { eventId: string }) {
  return (
    <nav className="flex min-h-16 items-center justify-between px-5 py-3">
      <Link href={'/cms/events'} className="flex items-center">
        <ChevronLeftIcon />
        <span className="ml-1">Manage events</span>
      </Link>
      <Button asChild className="h-fit rounded-full p-3" variant={'secondary'}>
        <Link href={`/cms/events/${eventId}/edit`}>
          <PencilIcon size={16} />
        </Link>
      </Button>
    </nav>
  )
}

export default async function EventViewPage({
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

  console.log('event', event)

  return (
    <main className="mx-auto flex max-h-screen min-h-screen max-w-screen-md flex-col">
      <Navbar eventId={eventId} />
      <section className="px-5">
        <h1 className="mb-4 text-3xl font-medium">{event.name}</h1>
        <p className="text-lg text-muted-foreground">{event.location}</p>
        <p className="">
          {format(event.startedAt, 'PPP')} - {format(event.endedAt, 'PPP')}
        </p>
      </section>
      <div className="px-5">
        <Separator className="my-8" />
      </div>
      <section className="px-5">
        <h2 className="mb-6 text-2xl font-medium">Programs</h2>
        <div className="flex flex-col gap-4">
          {event.competePrograms.map((program) => (
            <section key={program.id}>
              <h3 className="text-md font-medium">{program.name}</h3>
              <div className="grid grid-cols-3 gap-2">
                {program.competeRounds.sort(sortRounds).map((round) => (
                  <Link
                    key={round.id}
                    href={`/cms/events/${eventId}/${program.id}/${round.id}`}
                    className="flex cursor-pointer items-center justify-center space-x-2 rounded-2xl border p-6 text-sm transition-colors hover:bg-primary/10"
                  >
                    {round.name}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  )
}
