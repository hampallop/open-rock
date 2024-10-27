'use client'
import Link from 'next/link'
import { format, isPast } from 'date-fns'
import { Tables } from '@/database.types'
import { Button } from '@/components/ui/button'
import { useQueryState } from 'nuqs'

function EventCard({ event, isCms = false }: { event: any; isCms?: boolean }) {
  return (
    <Link
      href={isCms ? `/cms/events/${event.id}` : `/events/${event.id}`}
      key={event.id}
    >
      <div className="-m-2 flex space-x-4 rounded-xl px-4 py-6 transition-colors hover:bg-secondary">
        <div className="flex flex-col items-center pt-1">
          <span className="text-xs font-medium">
            {format(event.startedAt, 'LLL').toUpperCase()}
          </span>
          <span className="text-2xl">{format(event.startedAt, 'd')}</span>
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-semibold">{event.name}</p>
          <p className="text-muted-foreground">{event.location}</p>
          <p className="text-sm">
            {format(event.startedAt, 'PPP')} - {format(event.endedAt, 'PPP')}
          </p>
        </div>
      </div>
    </Link>
  )
}

export function EventList({
  title = 'Events',
  events,
  isCms = false,
}: {
  title: string
  events: Tables<'events'>[]
  isCms?: boolean
}) {
  const previousEvents = events.filter((event) => isPast(event.endedAt))
  const upcomingEvents = events.filter((event) => !isPast(event.endedAt))

  const [tab, setTab] = useQueryState('tab', {
    defaultValue: 'previous',
  })

  const activeEvents = tab === 'upcoming' ? upcomingEvents : previousEvents

  return (
    <>
      <div className="flex flex-col bg-background px-5">
        <h1 className="mb-4 text-3xl font-medium">{title}</h1>
        <div className="mb-2 flex gap-2">
          <Button
            className="rounded-full"
            variant={tab === 'upcoming' ? 'default' : 'secondary'}
            onClick={() => setTab('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            className="rounded-full"
            variant={tab === 'previous' ? 'default' : 'secondary'}
            onClick={() => setTab('previous')}
          >
            Previous
          </Button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto px-5 py-2">
        {activeEvents.length > 0 ? (
          activeEvents.map((event) => (
            <EventCard event={event} key={event.id} isCms={isCms} />
          ))
        ) : (
          <p className="mb-auto mt-8 h-full">No events found</p>
        )}
      </div>
    </>
  )
}
