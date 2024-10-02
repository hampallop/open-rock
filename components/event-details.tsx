'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import Link from 'next/link'
import { Layout } from '@/components/layout'

export function EventDetails() {
  const event = {
    id: 1,
    name: 'IFSC Boulder World Cup',
    location: 'Meiringen, Switzerland',
    startDate: '2024-04-15',
    endDate: '2024-04-17',
    description:
      'The IFSC Boulder World Cup in Meiringen marks the start of the 2024 bouldering season.',
    programs: [
      { id: 1, name: 'Boulder Male', gender: 'male' },
      { id: 2, name: 'Boulder Female', gender: 'female' },
    ],
  }

  return (
    <Layout title={event.name} backLink="/">
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
            {event.startDate} - {event.endDate}
          </p>
          <p>{event.description}</p>
        </CardContent>
      </Card>
      <h2 className="text-xl font-bold mb-4">Competition Programs</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {event.programs.map((program) => (
          <Link
            href={`/events/${event.id}/programs/${program.id}`}
            key={program.id}
          >
            <Card className="cursor-pointer hover:bg-accent">
              <CardHeader>
                <CardTitle className="text-lg">{program.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gender:{' '}
                  {program.gender.charAt(0).toUpperCase() +
                    program.gender.slice(1)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
