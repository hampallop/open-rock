import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, MapPinIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { Layout } from '@/components/layout'
import { format, isPast } from 'date-fns'
import { Tables } from '@/database.types'
import { Button } from '@/components/ui/button'

function EventCard({ event, isCms = false }: { event: any; isCms?: boolean }) {
  return (
    <Link
      href={isCms ? `/cms/events/${event.id}` : `/events/${event.id}`}
      key={event.id}
    >
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

  const stickyHeader = (
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
      <TabsTrigger value="previous">Previous</TabsTrigger>
    </TabsList>
  )

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      {isCms && (
        <section className="flex max-w-screen-md mx-auto w-full bg-background px-4">
          <div className="ml-auto">
            <Button asChild className="rounded-full p-2" variant={'secondary'}>
              <Link href="/cms/events/create">
                <PlusIcon />
              </Link>
            </Button>
          </div>
        </section>
      )}
      <Layout title={title} stickyHeader={stickyHeader}>
        <TabsContent value="upcoming">
          <div className="grid gap-4 grid-cols-1">
            {upcomingEvents.map((event) => (
              <EventCard event={event} key={event.id} isCms={isCms} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="previous">
          <div className="grid gap-4 grid-cols-1">
            {previousEvents.map((event) => (
              <EventCard event={event} key={event.id} isCms={isCms} />
            ))}
          </div>
        </TabsContent>
      </Layout>
    </Tabs>
  )
}
