import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import Link from 'next/link'
import { Layout } from '@/components/layout'
import { format, isPast } from 'date-fns'
import { Tables } from '@/database.types'

function EventCard({ event }: { event: any }) {
  return (
    <Link href={`/events/${event.id}`} key={event.id}>
      <Card className="cursor-pointer hover:bg-accent">
        <CardHeader>
          <CardTitle className="text-lg">{event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex items-center text-sm text-muted-foreground">
            <MapPinIcon className="mr-2 h-4 w-4" />
            {event.location}
          </p>
          <p className="flex items-center text-sm text-muted-foreground mt-2">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(event.startedAt, 'PPPP')} - {format(event.endedAt, 'PPPP')}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export function EventList({ events }: { events: Tables<'events'>[] }) {
  const previousEvents = events.filter((event) => isPast(event.endedAt))
  const upcomingEvents = events.filter((event) => !isPast(event.endedAt))

  const stickyHeader = (
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
      <TabsTrigger value="previous">Previous</TabsTrigger>
    </TabsList>
  )

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <Layout title="Climbing Events" stickyHeader={stickyHeader}>
        <TabsContent value="upcoming">
          <div className="grid gap-4 grid-cols-1">
            {upcomingEvents.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="previous">
          <div className="grid gap-4 grid-cols-1">
            {previousEvents.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        </TabsContent>
      </Layout>
    </Tabs>
  )
}
