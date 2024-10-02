import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import Link from 'next/link'
import { Layout } from '@/components/layout'
import { EventWithCompetePrograms } from '@/app/events/[eventId]/page'
import { format } from 'date-fns'

export function EventDetails({ event }: { event: EventWithCompetePrograms }) {
  return (
    <Layout title={event.name ?? 'Untitled Event'} backLink="/">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPinIcon className="mr-2 h-4 w-4" />
            {event.location}
          </p>
          <p className="flex items-center text-sm text-muted-foreground mb-4">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(event.startedAt, 'PPPP')} - {format(event.endedAt, 'PPPP')}
          </p>
          <p>{event.description}</p>
        </CardContent>
      </Card>
      <h2 className="text-xl font-bold mb-4">Competition Programs</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {event.competePrograms.map((program) => (
          <Link
            href={`/events/${event.id}/programs/${program.id}`}
            key={program.id}
          >
            <Card className="cursor-pointer hover:bg-accent">
              <CardHeader>
                <CardTitle className="text-lg">{program.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
