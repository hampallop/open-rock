'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import Link from 'next/link'
import { Layout } from '@/components/layout'

export function EventList() {
  const [activeTab, setActiveTab] = useState('upcoming')

  const events = [
    {
      id: 1,
      name: 'IFSC Boulder World Cup',
      location: 'Meiringen, Switzerland',
      startDate: '2024-04-15',
      endDate: '2024-04-17',
      status: 'upcoming',
    },
    {
      id: 2,
      name: 'IFSC Lead World Cup',
      location: 'Villars, Switzerland',
      startDate: '2024-07-01',
      endDate: '2024-07-03',
      status: 'upcoming',
    },
    {
      id: 3,
      name: 'IFSC Speed World Cup',
      location: 'Seoul, South Korea',
      startDate: '2023-10-06',
      endDate: '2023-10-08',
      status: 'previous',
    },
    {
      id: 4,
      name: 'IFSC Combined World Cup',
      location: 'Innsbruck, Austria',
      startDate: '2023-06-21',
      endDate: '2023-06-25',
      status: 'previous',
    },
  ]

  return (
    <Layout title="Climbing Events">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="previous">Previous</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="grid gap-4 grid-cols-1">
            {events
              .filter((event) => event.status === 'upcoming')
              .map((event) => (
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
                        {event.startDate} - {event.endDate}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="previous">
          <div className="grid gap-4 grid-cols-1">
            {events
              .filter((event) => event.status === 'previous')
              .map((event) => (
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
                        {event.startDate} - {event.endDate}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  )
}
